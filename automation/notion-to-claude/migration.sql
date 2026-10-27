create table if not exists public.claude_relay_events (
  id bigint generated always as identity primary key,
  route text not null,
  page_id text,
  title text,
  notion_event_id text,
  status text not null,          -- fired | deduped | rate_limited | fire_failed | skipped_no_routine
  detail text,
  text text,
  fired_at timestamptz not null default now()
);
create index if not exists claude_relay_events_lookup on public.claude_relay_events (route, page_id, status, fired_at desc);
create index if not exists claude_relay_events_notion_event on public.claude_relay_events (notion_event_id);
alter table public.claude_relay_events enable row level security;
-- 서비스 롤(Edge Function)만 접근. anon/authenticated 정책 없음.
