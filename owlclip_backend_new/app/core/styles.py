import pysubs2
from pysubs2 import Alignment



def _margin_v_percent(pct: float, video_height: int = 1920) -> int:
    """Convert a bottom-anchored percentage to marginV pixels."""
    return int(video_height * pct / 100)


def get_style_preset(preset_name: str, video_height: int = 1920) -> pysubs2.SSAStyle:
    """Return a pysubs2.SSAStyle for the given preset key."""
    style = pysubs2.SSAStyle()

    # Shared defaults
    style.bold = True
    style.alignment = Alignment.BOTTOM_CENTER   # numpad 2
    style.marginv = _margin_v_percent(14, video_height)   # lower-third
    style.borderstyle = 1                       # 1 = outline + shadow, 3 = opaque box
    style.encoding = 1

    n = preset_name.lower()

    # ─── CLEAN ──────────────────────────────────────────────────────────────
    if n == "clean":
        style.fontname = "Arial"
        style.fontsize = 42
        style.primarycolor = pysubs2.Color(255, 255, 255, 0)
        style.outlinecolor = pysubs2.Color(0, 0, 0, 120)
        style.backcolor = pysubs2.Color(0, 0, 0, 180)
        style.outline = 2.5
        style.shadow = 0.0
        style.spacing = 0.5

    # ─── NEON ───────────────────────────────────────────────────────────────
    elif n == "neon":
        style.fontname = "Montserrat"
        style.fontsize = 44
        style.primarycolor = pysubs2.Color(255, 255, 255, 0)
        style.outlinecolor = pysubs2.Color(103, 232, 249, 0)     # cyan
        style.backcolor = pysubs2.Color(0, 0, 0, 60)
        style.outline = 1.0
        style.shadow = 4.0                  # large offset shadow simulates glow
        style.spacing = 4.0
        style.marginv = _margin_v_percent(6, video_height)

    # ─── GOLD ───────────────────────────────────────────────────────────────
    elif n == "gold":
        style.fontname = "Georgia"
        style.fontsize = 48
        style.primarycolor = pysubs2.Color(253, 230, 138, 0)
        style.outlinecolor = pysubs2.Color(0, 0, 0, 120)
        style.backcolor = pysubs2.Color(0, 0, 0, 180)
        style.outline = 2.0
        style.shadow = 0.0
        style.spacing = 1.5

    # ─── KARAOKE ────────────────────────────────────────────────────────────
    elif n == "karaoke":
        style.fontname = "Arial"
        style.fontsize = 46
        style.primarycolor = pysubs2.Color(251, 146, 60, 0)      # orange
        style.secondarycolor = pysubs2.Color(156, 163, 175, 0)   # gray for unhighlighted
        style.outlinecolor = pysubs2.Color(0, 0, 0, 120)
        style.backcolor = pysubs2.Color(0, 0, 0, 180)
        style.outline = 2.5
        style.shadow = 0.0
        style.spacing = 0.0

    # ─── MINIMAL ────────────────────────────────────────────────────────────
    elif n == "minimal":
        style.fontname = "Helvetica"
        style.fontsize = 44
        style.bold = False
        style.primarycolor = pysubs2.Color(255, 255, 255, 0)
        style.outlinecolor = pysubs2.Color(0, 0, 0, 100)
        style.backcolor = pysubs2.Color(0, 0, 0, 180)
        style.outline = 1.5
        style.shadow = 0.0
        style.spacing = 0.3

    # ─── CINEMATIC ──────────────────────────────────────────────────────────
    elif n == "cinematic":
        style.fontname = "Helvetica"
        style.fontsize = 36
        style.bold = False
        style.primarycolor = pysubs2.Color(212, 212, 212, 0)
        style.outlinecolor = pysubs2.Color(0, 0, 0, 120)
        style.backcolor = pysubs2.Color(0, 0, 0, 180)
        style.outline = 1.5
        style.shadow = 0.0
        style.spacing = 6.0

    # ─── TYPEWRITER ─────────────────────────────────────────────────────────
    elif n == "typewriter":
        style.fontname = "Courier New"
        style.fontsize = 38
        style.primarycolor = pysubs2.Color(248, 250, 252, 0)
        style.outlinecolor = pysubs2.Color(0, 0, 0, 80)
        style.backcolor = pysubs2.Color(28, 25, 23, 200)
        style.outline = 1.0
        style.shadow = 0.0
        style.spacing = 2.0
        style.marginv = _margin_v_percent(18, video_height)

    # ─── SOFT-SHADOW ────────────────────────────────────────────────────────
    elif n == "soft-shadow":
        style.fontname = "Arial"
        style.fontsize = 44
        style.primarycolor = pysubs2.Color(254, 243, 199, 0)
        style.outlinecolor = pysubs2.Color(0, 0, 0, 100)
        style.backcolor = pysubs2.Color(0, 0, 0, 180)
        style.outline = 2.0
        style.shadow = 0.0
        style.spacing = 0.5

    # ─── OUTLINE ────────────────────────────────────────────────────────────
    elif n == "outline":
        style.fontname = "Arial Black"
        style.fontsize = 40
        style.primarycolor = pysubs2.Color(255, 255, 255, 255)   # transparent fill
        style.outlinecolor = pysubs2.Color(255, 255, 255, 0)     # white stroke
        style.backcolor = pysubs2.Color(0, 0, 0, 180)
        style.outline = 3.0
        style.shadow = 0.0
        style.spacing = 4.0

    # ─── DEFAULT FALLBACK ───────────────────────────────────────────────────
    else:
        style.fontname = "Arial"
        style.fontsize = 42
        style.primarycolor = pysubs2.Color(255, 255, 255, 0)
        style.outlinecolor = pysubs2.Color(0, 0, 0, 120)
        style.backcolor = pysubs2.Color(0, 0, 0, 180)
        style.outline = 2.0
        style.shadow = 0.0
        style.spacing = 0.0

    return style

