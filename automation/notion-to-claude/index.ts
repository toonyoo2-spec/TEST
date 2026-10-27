// notion-to-claude: Notion 데이터베이스 자동화의 "웹훅 보내기" → Claude Code 자동화(루틴) API 실행 중계
//
// 역할
//  1) Notion이 보낸 페이지 정보를 읽어 사람이 읽을 수 있는 한 줄 요약(text)으로 만든다
//  2) 같은 페이지·같은 경로의 재전송을 DEBOUNCE_SECONDS 안에서는 한 번만 실행한다 (Notion 재시도 → 세션 중복 방지)
//  3) Claude 루틴 fire 엔드포인트를 호출한다
//  4) Notion에는 항상 200을 돌려준다 (실패 시 Notion이 자동화를 일시정지하는 것을 막기 위함). 실패 내역은 테이블에 남긴다
//
// 호출 형식
//  POST {FUNCTION_URL}?route=blog   헤더 x-relay-key: {RELAY_KEY}
//  route 값마다 환경변수 ROUTINE_{ROUTE}_URL / ROUTINE_{ROUTE}_TOKEN 이 있어야 한다 (예: ROUTINE_BLOG_URL)
//
// 환경변수(Edge Function secrets)
//  RELAY_KEY              Notion 웹훅 헤더에 넣을 공유 비밀값
//  ROUTINE_BLOG_URL       Claude 앱에서 복사한 fire URL (https://api.anthropic.com/v1/claude_code/routines/<id>/fire)
//  ROUTINE_BLOG_TOKEN     같은 화면의 API 토큰 (sk-ant-oat01-...)
//  ROUTINE_CARD_URL / ROUTINE_CARD_TOKEN   카드뉴스용
//  ROUTINE_RELAY_URL / ROUTINE_RELAY_TOKEN 공용 중계 자동화(route별 값이 없을 때 사용). 지금 구성은 이것 하나만 있으면 된다
//  DEBOUNCE_SECONDS       기본 180
//  SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY  Supabase가 자동 주입

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ANTHROPIC_VERSION = "2023-06-01";
const ROUTINE_BETA = "experimental-cc-routine-2026-04-01";

type Json = Record<string, unknown>;

function plain(prop: Json | undefined): string {
  if (!prop || typeof prop !== "object") return "";
  const t = prop.type as string | undefined;
  const v = t ? (prop as Json)[t] : undefined;
  switch (t) {
    case "title":
    case "rich_text":
      return Array.isArray(v) ? v.map((x: Json) => (x.plain_text as string) ?? "").join("") : "";
    case "select":
    case "status":
      return v && typeof v === "object" ? ((v as Json).name as string) ?? "" : "";
    case "multi_select":
      return Array.isArray(v) ? v.map((x: Json) => x.name as string).join(", ") : "";
    case "date":
      return v && typeof v === "object" ? ((v as Json).start as string) ?? "" : "";
    case "checkbox":
      return v ? "예" : "아니오";
    case "number":
      return v == null ? "" : String(v);
    case "url":
    case "email":
    case "phone_number":
      return (v as string) ?? "";
    case "people":
      return Array.isArray(v) ? v.map((x: Json) => (x.name as string) ?? "").join(", ") : "";
    case "relation":
      return Array.isArray(v) ? `${v.length}건` : "";
    case "formula":
    case "rollup": {
      const inner = v as Json | undefined;
      const it = inner?.type as string | undefined;
      return it ? String(inner?.[it] ?? "") : "";
    }
    default:
      return "";
  }
}

function pageIdOf(data: Json): string {
  const id = (data.id as string) ?? "";
  return id.replace(/-/g, "");
}

function summarize(route: string, body: Json): { pageId: string; title: string; text: string } {
  const data = (body.data as Json) ?? body;
  const props = (data.properties as Record<string, Json>) ?? {};
  const pageId = pageIdOf(data);
  let title = "";
  const lines: string[] = [];
  for (const [name, prop] of Object.entries(props)) {
    const val = plain(prop);
    if (prop?.type === "title") title = val;
    if (val) lines.push(`${name}=${val}`);
  }
  const url = pageId ? `https://www.notion.so/${pageId}` : "";
  const text =
    `[웹훅] route=${route} page_id=${pageId || "(없음)"} 제목=${title || "(없음)"}\n` +
    `페이지: ${url}\n현재 속성: ${lines.join(" | ")}\n` +
    `지시: 이 페이지 하나만 notion-fetch로 열어 처리한다. 전체 조회·후보 편성·정기 점검은 건너뛴다.`;
  return { pageId, title, text };
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("POST only", { status: 405 });

  const relayKey = Deno.env.get("RELAY_KEY") ?? "";
  if (!relayKey || req.headers.get("x-relay-key") !== relayKey) {
    return new Response("unauthorized", { status: 401 });
  }

  const url = new URL(req.url);
  const route = (url.searchParams.get("route") ?? "").toLowerCase();
  if (!/^[a-z0-9_-]{1,32}$/.test(route)) return new Response("bad route", { status: 400 });

  // route별 시크릿이 없으면 공용 중계 자동화(ROUTINE_RELAY_*)로 보낸다.
  // 로컬(Mac) 자동화는 API 트리거를 못 붙이므로, 클라우드 "[자동화 웹훅중계]"가 받아서 fire_trigger로 로컬 자동화를 실행한다.
  const fireUrl = Deno.env.get(`ROUTINE_${route.toUpperCase()}_URL`) || Deno.env.get("ROUTINE_RELAY_URL") || "";
  const token = Deno.env.get(`ROUTINE_${route.toUpperCase()}_TOKEN`) || Deno.env.get("ROUTINE_RELAY_TOKEN") || "";
  const debounce = Number(Deno.env.get("DEBOUNCE_SECONDS") ?? "180");

  let body: Json = {};
  try {
    body = (await req.json()) as Json;
  } catch {
    body = {};
  }
  const { pageId, title, text } = summarize(route, body);
  const notionEventId = ((body.source as Json)?.event_id as string) ?? null;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const ok = (payload: Json) =>
    new Response(JSON.stringify(payload), { status: 200, headers: { "content-type": "application/json" } });

  if (!fireUrl || !token) {
    await supabase.from("claude_relay_events").insert({
      route, page_id: pageId, title, notion_event_id: notionEventId, status: "skipped_no_routine", detail: "ROUTINE_*_URL/TOKEN 미설정",
    });
    return ok({ ok: false, reason: "routine not configured" });
  }

  // 중복 방지: 같은 Notion 이벤트 ID, 또는 같은 페이지·경로가 debounce 안에 이미 실행됨
  if (pageId) {
    const since = new Date(Date.now() - debounce * 1000).toISOString();
    const q = supabase
      .from("claude_relay_events")
      .select("id, notion_event_id, fired_at")
      .eq("route", route)
      .eq("page_id", pageId)
      .eq("status", "fired")
      .gte("fired_at", since)
      .limit(1);
    const { data: recent } = await q;
    const dupByEvent = notionEventId
      ? (await supabase.from("claude_relay_events").select("id").eq("notion_event_id", notionEventId).eq("status", "fired").limit(1)).data
      : null;
    if ((recent && recent.length > 0) || (dupByEvent && dupByEvent.length > 0)) {
      await supabase.from("claude_relay_events").insert({
        route, page_id: pageId, title, notion_event_id: notionEventId, status: "deduped", detail: `${debounce}s 안에 이미 실행`,
      });
      return ok({ ok: true, deduped: true });
    }
  }

  let status = "fired";
  let detail = "";
  try {
    const res = await fetch(fireUrl, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${token}`,
        "anthropic-version": ANTHROPIC_VERSION,
        "anthropic-beta": ROUTINE_BETA,
        "content-type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    detail = `${res.status} ${(await res.text()).slice(0, 500)}`;
    if (!res.ok) status = res.status === 429 ? "rate_limited" : "fire_failed";
  } catch (e) {
    status = "fire_failed";
    detail = String(e).slice(0, 500);
  }

  await supabase.from("claude_relay_events").insert({
    route, page_id: pageId, title, notion_event_id: notionEventId, status, detail, text,
  });

  // Notion에는 항상 200 (실패해도 자동화가 멈추지 않도록). 실패는 테이블에서 확인.
  return ok({ ok: status === "fired", status });
});
