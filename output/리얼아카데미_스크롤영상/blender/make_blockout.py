"""리얼아카데미 스크롤 영상 — Blender 블록아웃(프리비즈) 생성 스크립트.

회색 단순 형태로 방·책상·아이·태블릿을 배치하고, 8초(24fps, 192프레임) 카메라 이동을
만든 뒤 Seedance 2.5에 넣을 참조 영상과 검토용 정지 이미지를 렌더한다.

실행:
    pip install bpy==4.2.0        # Python 3.11 필요
    python make_blockout.py       # 결과는 ./render/ 에 저장

좌표계(단위 m): 아이는 원점에 앉아 +Y(책상 쪽)를 바라본다. +X가 아이의 오른쪽, +Z가 위.
카메라 각도 θ는 위에서 볼 때 아이 정면(+Y)에서 오른쪽(+X)으로 도는 시계 방향 각도.
"""

import math
import os
import sys

# 화면 없는 서버에서 Workbench 렌더용(소프트웨어 OpenGL)
os.environ.setdefault("EGL_PLATFORM", "surfaceless")

import bpy  # noqa: E402
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "render")
os.makedirs(OUT, exist_ok=True)

FPS = 24
FRAMES = 192  # 8초
MOVE_START_S, MOVE_END_S = 2.0, 7.0
LENS_MM = 50  # 영상 전체에서 고정
RES = (1280, 720)

# 카메라 경로: (각도°, 피벗까지 거리, 높이, 바라보는 지점)
CAM_START = dict(theta=30.0, radius=1.70, height=0.92)
CAM_END = dict(theta=153.0, radius=0.67, height=1.05)  # 오른쪽 어깨 뒤, 눈높이 바로 위(오버더숄더)
PIVOT_START = Vector((0.0, 0.25, 0.0))
PIVOT_END = Vector((0.0, 0.30, 0.0))
LOOK_START = Vector((0.0, 0.12, 0.93))  # 아이 얼굴과 태블릿 뒷면 사이
LOOK_END = Vector((0.0, 0.42, 0.80))  # 태블릿 화면 중앙

DESK_H = 0.70
TABLET_POS = Vector((0.0, 0.40, DESK_H))
TABLET_TILT_DEG = -22.0  # 윗부분이 뒤(+Y)로 기울어 화면이 아이 눈높이를 향함


# ---------------------------------------------------------------- 유틸
def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


_mats = {}


def mat(name, rgb):
    if name in _mats:
        return _mats[name]
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*rgb, 1.0)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*rgb, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.8
    _mats[name] = m
    return m


def box(name, size, loc, color, rot=(0, 0, 0), parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    o.scale = size
    o.data.materials.append(mat(name + "_m", color))
    if parent:
        o.parent = parent
    return o


def cyl_between(name, p1, p2, r, color):
    p1, p2 = Vector(p1), Vector(p2)
    d = p2 - p1
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d.length, location=(p1 + p2) / 2)
    o = bpy.context.active_object
    o.name = name
    o.rotation_mode = "QUATERNION"
    o.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(d.normalized())
    o.data.materials.append(mat(name + "_m", color))
    return o


def sphere(name, r, loc, color, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=32, ring_count=16)
    o = bpy.context.active_object
    o.name = name
    o.scale = scale
    bpy.ops.object.shade_smooth()
    o.data.materials.append(mat(name + "_m", color))
    return o


# ---------------------------------------------------------------- 색
WALL = (0.80, 0.78, 0.74)
FLOOR = (0.55, 0.47, 0.38)
WOOD = (0.76, 0.62, 0.45)
CREAM = (0.92, 0.88, 0.78)
SKIN = (0.85, 0.68, 0.56)
HAIR = (0.05, 0.05, 0.05)
DARK = (0.08, 0.08, 0.09)
TABLET_GRAY = (0.45, 0.46, 0.48)
SCREEN_GRAY = (0.40, 0.40, 0.40)
NIGHT = (0.04, 0.06, 0.14)


# ---------------------------------------------------------------- 방
def build_room():
    W, D0, D1, H = (-1.6, 1.7), -1.6, 2.2, 2.4
    cx, cy = (W[0] + W[1]) / 2, (D0 + D1) / 2
    box("Floor", (W[1] - W[0], D1 - D0, 0.02), (cx, cy, -0.01), FLOOR)
    box("Wall_Back", (W[1] - W[0], 0.05, H), (cx, D0, H / 2), WALL)  # 아이 등 뒤
    box("Wall_Front", (W[1] - W[0], 0.05, H), (cx, D1, H / 2), WALL)  # 책상 너머
    box("Wall_Left", (0.05, D1 - D0, H), (W[0], cy, H / 2), WALL)
    box("Wall_Right", (0.05, D1 - D0, H), (W[1], cy, H / 2), WALL)

    # 아이 등 뒤 벽: 그림·책장·문 (시작 화면의 배경)
    for i, (x, c) in enumerate([(-0.75, (0.9, 0.5, 0.4)), (-0.35, (0.4, 0.7, 0.5)), (0.0, (0.5, 0.6, 0.9))]):
        box(f"Drawing_{i}", (0.28, 0.01, 0.36), (x, D0 + 0.03, 1.45), c)
    box("Bookshelf", (0.8, 0.30, 1.6), (0.85, D0 + 0.17, 0.8), WOOD)
    box("Door", (0.85, 0.03, 2.05), (-1.15, D0 + 0.03, 1.025), (0.88, 0.86, 0.82))

    # 왼쪽 벽: 밤 창문 (시작 화면 오른쪽에 보임)
    box("Window_Left", (0.02, 1.2, 1.1), (W[0] + 0.03, -0.6, 1.45), NIGHT)

    # 책상 너머 벽: 침대·옷장 (마지막 화면의 배경)
    box("Bed", (1.0, 1.9, 0.45), (-1.05, 1.2, 0.225), (0.85, 0.85, 0.92))
    box("Wardrobe", (0.8, 0.55, 2.0), (-0.1, D1 - 0.3, 1.0), (0.90, 0.88, 0.84))  # 카메라 시작점과 겹치지 않게


# ---------------------------------------------------------------- 책상·의자·소품
def build_desk():
    box("DeskTop", (1.2, 0.6, 0.03), (0.0, 0.45, DESK_H - 0.015), WOOD)
    for i, (x, y) in enumerate([(-0.57, 0.18), (0.57, 0.18), (-0.57, 0.72), (0.57, 0.72)]):
        box(f"DeskLeg_{i}", (0.04, 0.04, DESK_H - 0.03), (x, y, (DESK_H - 0.03) / 2), WOOD)
    # 의자
    box("ChairSeat", (0.42, 0.40, 0.05), (0.0, -0.12, 0.42), (0.35, 0.36, 0.40))
    box("ChairBack", (0.40, 0.04, 0.40), (0.0, -0.34, 0.68), (0.35, 0.36, 0.40))
    box("ChairPost", (0.06, 0.06, 0.40), (0.0, -0.12, 0.20), DARK)
    # 스탠드 조명(아이 왼쪽)
    cyl_between("LampBase", (-0.45, 0.62, DESK_H), (-0.45, 0.62, DESK_H + 0.02), 0.07, (0.9, 0.9, 0.9))
    cyl_between("LampArm", (-0.45, 0.62, DESK_H + 0.02), (-0.38, 0.55, DESK_H + 0.42), 0.012, (0.9, 0.9, 0.9))
    sphere("LampShade", 0.07, (-0.33, 0.50, DESK_H + 0.42), (1.0, 0.95, 0.8), scale=(1, 1, 0.5))
    # 연필꽂이·교재
    cyl_between("PencilCup", (0.42, 0.62, DESK_H), (0.42, 0.62, DESK_H + 0.11), 0.04, (0.85, 0.85, 0.82))
    box("Workbook", (0.21, 0.28, 0.02), (-0.30, 0.30, DESK_H + 0.01), (0.3, 0.6, 0.55), rot=(0, 0, 0.15))


# ---------------------------------------------------------------- 태블릿(5:3 화면 + 십자 5개)
def build_tablet():
    bpy.ops.object.empty_add(location=TABLET_POS + Vector((0, 0, 0.035)))
    rig = bpy.context.active_object
    rig.name = "TabletRig"
    rig.rotation_euler = (math.radians(TABLET_TILT_DEG), 0, 0)

    bw, bh, bt = 0.211, 0.1247, 0.008  # 본체
    sw, sh = 0.1895, 0.1137  # 8.7인치 5:3 활성 화면
    zc = bh / 2  # 리그 원점 = 본체 아래 모서리 중앙
    box("TabletBody", (bw, bt, bh), (0, 0, zc), TABLET_GRAY, parent=rig)
    box("TabletBezel", (bw - 0.002, 0.0005, bh - 0.002), (0, -bt / 2 - 0.0003, zc), DARK, parent=rig)
    box("TabletScreen", (sw, 0.0005, sh), (0, -bt / 2 - 0.0007, zc), SCREEN_GRAY, parent=rig)

    arm, th, inset = 0.012, 0.0018, 0.014
    yf = -bt / 2 - 0.0011
    centers = [
        (-sw / 2 + inset, zc + sh / 2 - inset, arm),
        (sw / 2 - inset, zc + sh / 2 - inset, arm),
        (-sw / 2 + inset, zc - sh / 2 + inset, arm),
        (sw / 2 - inset, zc - sh / 2 + inset, arm),
        (0.0, zc, arm * 0.7),
    ]
    for i, (x, z, a) in enumerate(centers):
        box(f"Marker_{i}_h", (a, 0.0005, th), (x, yf, z), DARK, parent=rig)
        box(f"Marker_{i}_v", (th, 0.0005, a), (x, yf, z), DARK, parent=rig)

    # 거치대: 바닥판 + 뒤 받침
    box("StandBase", (0.16, 0.10, 0.006), TABLET_POS + Vector((0, 0.03, 0.003)), (0.3, 0.3, 0.32))
    box("StandBack", (0.12, 0.006, 0.10), TABLET_POS + Vector((0, 0.06, 0.05)), (0.3, 0.3, 0.32),
        rot=(math.radians(-25), 0, 0))
    box("StandLip", (0.18, 0.02, 0.035), TABLET_POS + Vector((0, 0.0, 0.017)), (0.3, 0.3, 0.32))


# ---------------------------------------------------------------- 아이(9세, 앉은 자세, 화면을 바라봄)
def build_boy():
    box("Torso", (0.30, 0.17, 0.42), (0.0, -0.04, 0.66), CREAM, rot=(math.radians(8), 0, 0))
    box("Hips", (0.30, 0.30, 0.12), (0.0, -0.08, 0.50), (0.3, 0.35, 0.45))
    for s in (-1, 1):
        cyl_between(f"Thigh_{s}", (0.09 * s, -0.05, 0.48), (0.10 * s, 0.25, 0.47), 0.055, (0.3, 0.35, 0.45))
        cyl_between(f"Shin_{s}", (0.10 * s, 0.25, 0.47), (0.10 * s, 0.28, 0.05), 0.045, (0.3, 0.35, 0.45))
        sh = (0.17 * s, -0.01, 0.84)
        el = (0.21 * s, 0.10, 0.73)
        hd = (0.15 * s, 0.30, DESK_H + 0.03)  # 손은 태블릿 옆 책상 위
        cyl_between(f"UpperArm_{s}", sh, el, 0.045, CREAM)
        cyl_between(f"Forearm_{s}", el, hd, 0.038, CREAM)
        sphere(f"Hand_{s}", 0.035, hd, SKIN, scale=(1, 1.3, 0.6))
    cyl_between("Neck", (0, 0.0, 0.86), (0, 0.02, 0.94), 0.045, SKIN)
    head = sphere("Head", 0.095, (0.0, 0.03, 1.01), SKIN, scale=(0.95, 1.0, 1.08))
    head.rotation_euler = (math.radians(-25), 0, 0)  # 화면을 내려다봄
    sphere("Hair", 0.098, (0.0, -0.005, 1.035), HAIR, scale=(0.98, 1.0, 0.98))
    # 안경(얼굴 방향 표시)
    for s in (-1, 1):
        bpy.ops.mesh.primitive_torus_add(major_radius=0.022, minor_radius=0.003,
                                         location=(0.035 * s, 0.115, 0.975),
                                         rotation=(math.radians(90 - 25), 0, 0))
        g = bpy.context.active_object
        g.name = f"Glasses_{s}"
        g.data.materials.append(mat("Glasses_m", DARK))


# ---------------------------------------------------------------- 조명·월드
def build_lights():
    world = bpy.data.worlds.new("World")
    bpy.context.scene.world = world
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs[0].default_value = (0.02, 0.02, 0.03, 1)
    world.node_tree.nodes["Background"].inputs[1].default_value = 0.3

    bpy.ops.object.light_add(type="AREA", location=(0.0, 0.2, 2.35))
    ceil = bpy.context.active_object
    ceil.name = "CeilingLight"
    ceil.data.size = 1.2
    ceil.data.energy = 60
    ceil.data.color = (1.0, 0.9, 0.78)

    bpy.ops.object.light_add(type="POINT", location=(-0.33, 0.50, DESK_H + 0.38))
    lamp = bpy.context.active_object
    lamp.name = "DeskLampLight"
    lamp.data.energy = 8
    lamp.data.color = (1.0, 0.85, 0.65)
    lamp.data.shadow_soft_size = 0.05


# ---------------------------------------------------------------- 카메라
def smooth(t):
    t = min(max(t, 0.0), 1.0)
    return t * t * t * (t * (6 * t - 15) + 10)  # smootherstep: 시작·끝 가감속


def lerp(a, b, t):
    return a + (b - a) * t


def cam_state(frame):
    sec = (frame - 1) / FPS
    u = smooth((sec - MOVE_START_S) / (MOVE_END_S - MOVE_START_S))
    theta = math.radians(lerp(CAM_START["theta"], CAM_END["theta"], u))
    r = lerp(CAM_START["radius"], CAM_END["radius"], u)
    h = lerp(CAM_START["height"], CAM_END["height"], u)
    pivot = PIVOT_START.lerp(PIVOT_END, u)
    pos = Vector((pivot.x + r * math.sin(theta), pivot.y + r * math.cos(theta), h))
    look = LOOK_START.lerp(LOOK_END, smooth((sec - MOVE_START_S - 0.5) / (MOVE_END_S - MOVE_START_S - 1.0)))
    return pos, look


def build_camera():
    scn = bpy.context.scene
    bpy.ops.object.empty_add(location=LOOK_START)
    target = bpy.context.active_object
    target.name = "CamTarget"
    bpy.ops.object.camera_add(location=(0, 0, 1))
    cam = bpy.context.active_object
    cam.name = "ShotCam"
    cam.data.lens = LENS_MM
    cam.data.sensor_width = 36
    c = cam.constraints.new("TRACK_TO")
    c.target = target
    c.track_axis = "TRACK_NEGATIVE_Z"
    c.up_axis = "UP_Y"
    for f in range(1, FRAMES + 1):
        pos, look = cam_state(f)
        cam.location = pos
        target.location = look
        cam.keyframe_insert("location", frame=f)
        target.keyframe_insert("location", frame=f)
    scn.camera = cam
    return cam


def build_path_overlay():
    """위에서 본 검토 이미지용 카메라 경로(본 영상에는 렌더하지 않음)."""
    pts = [cam_state(f)[0] for f in range(1, FRAMES + 1, 4)] + [cam_state(FRAMES)[0]]
    cd = bpy.data.curves.new("CamPath", "CURVE")
    cd.dimensions = "3D"
    cd.bevel_depth = 0.012
    sp = cd.splines.new("POLY")
    sp.points.add(len(pts) - 1)
    for p, v in zip(sp.points, pts):
        p.co = (v.x, v.y, 2.0, 1)
    ob = bpy.data.objects.new("CamPath", cd)
    ob.data.materials.append(mat("Path_m", (0.9, 0.1, 0.1)))
    bpy.context.collection.objects.link(ob)
    overlay = [ob]
    for name, f, col in (("CamStart", 1, (0.1, 0.7, 0.2)), ("CamEnd", FRAMES, (0.1, 0.3, 0.9))):
        s = sphere(name, 0.06, cam_state(f)[0], col)
        s.location.z = 2.0
        overlay.append(s)
    return overlay


# ---------------------------------------------------------------- 렌더
def setup_render(engine):
    scn = bpy.context.scene
    scn.render.engine = engine
    scn.render.resolution_x, scn.render.resolution_y = RES
    scn.render.resolution_percentage = 100
    scn.render.fps = FPS
    scn.frame_start, scn.frame_end = 1, FRAMES
    if engine == "BLENDER_WORKBENCH":
        sh = scn.display.shading
        sh.light = "STUDIO"
        sh.color_type = "MATERIAL"
        sh.show_shadows = False  # 켜면 소프트웨어 렌더에서 그림자 띠 결함이 생김
        sh.show_cavity = True
        scn.display.render_aa = "8"
    if engine == "CYCLES":
        scn.cycles.device = "CPU"
        scn.cycles.samples = 24
        scn.cycles.use_denoising = True
        scn.cycles.max_bounces = 4
    scn.view_settings.view_transform = "Standard"


def render_still(path, frame):
    scn = bpy.context.scene
    scn.frame_set(frame)
    scn.render.image_settings.file_format = "PNG"
    scn.render.filepath = path
    bpy.ops.render.render(write_still=True)


def render_video(path):
    scn = bpy.context.scene
    scn.render.image_settings.file_format = "FFMPEG"
    scn.render.ffmpeg.format = "MPEG4"
    scn.render.ffmpeg.codec = "H264"
    scn.render.ffmpeg.constant_rate_factor = "HIGH"
    scn.render.ffmpeg.gopsize = 1  # 모든 프레임을 키프레임으로(스크롤 시킹 시험용)
    scn.render.filepath = path
    bpy.ops.render.render(animation=True)


def render_top_view(overlay):
    scn = bpy.context.scene
    shot = scn.camera
    bpy.ops.object.camera_add(location=(0.05, 0.35, 6.0), rotation=(0, 0, 0))
    top = bpy.context.active_object
    top.data.type = "ORTHO"
    top.data.ortho_scale = 6.4
    scn.camera = top
    hide = [o for o in scn.objects if o.name.startswith(("Wall_Front", "Wall_Back", "Wall_Left", "Wall_Right"))]
    for o in hide:
        o.hide_render = True
    for o in overlay:
        o.hide_render = False
    bpy.ops.object.light_add(type="SUN", location=(0, 0, 5))
    sun = bpy.context.active_object
    sun.data.energy = 3
    render_still(os.path.join(OUT, "top_view_camera_path.png"), 1)
    bpy.data.objects.remove(sun)
    for o in hide:
        o.hide_render = False
    for o in overlay:
        o.hide_render = True
    scn.camera = shot


def main():
    reset()
    build_room()
    build_desk()
    build_tablet()
    build_boy()
    build_lights()
    build_camera()
    overlay = build_path_overlay()
    for o in overlay:
        o.hide_render = True

    # WORKBENCH: 빠른 회색 프리비즈(기본). CYCLES: 조명 포함, 프레임당 수십 초.
    engine = os.environ.get("BLOCKOUT_ENGINE", "BLENDER_WORKBENCH")
    setup_render(engine)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, "blockout.blend"))

    for name, f in (("frame_000_start", 1), ("frame_048_move_start", 49), ("frame_108_mid", 109),
                    ("frame_168_move_end", 169), ("frame_192_end", 192)):
        render_still(os.path.join(OUT, name + ".png"), f)
    render_top_view(overlay)
    if "--stills-only" not in sys.argv:
        render_video(os.path.join(OUT, "blockout_previs_8s_24fps.mp4"))


if __name__ == "__main__":
    main()
