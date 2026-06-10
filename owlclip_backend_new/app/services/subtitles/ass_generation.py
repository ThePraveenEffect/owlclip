
def seconds_to_ass(s):
    h  = int(s // 3600)
    m  = int((s % 3600) // 60)
    se = int(s % 60)
    cs = int((s % 1) * 100)
    return f"{h}:{m:02d}:{se:02d}.{cs:02d}"


def build_ass(subtitles, w, h, title_text=None):
    """
    Generate ASS subtitle file.
    Style: bold white text, black outline, centered bottom.
    Tweak the Style line to change appearance.

    Color format is &HAABBGGRR (alpha, blue, green, red):
      &H00FFFFFF = white text
      &H00000000 = black outline
      &H80000000 = semi-transparent black background
    Alignment 2 = bottom center
    """
    header = f"""\
[Script Info]
ScriptType: v4.00+
PlayResX: {w}
PlayResY: {h}
WrapStyle: 0

[V4+ Styles]    
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Default,Arial,60,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,1,0,1,3,1,2,40,40,535,1
Style: TitleStyle,Arial,48,&H0000FF00,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,1,0,1,3,1,8,40,40,535,1


[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
"""
    lines = []

     # ⭐ ADD THIS: Title at the top
    if title_text and subtitles:
        title_start = seconds_to_ass(subtitles[0]["start"])
        title_end = seconds_to_ass(subtitles[-1]["end"])  # Show for whole clip
        lines.append(f"Dialogue: 0,{title_start},{title_end},TitleStyle,,0,0,0,,{title_text.upper()}")


    for sub in subtitles:
        start = seconds_to_ass(sub["start"])
        end   = seconds_to_ass(sub["end"])
        text  = sub["text"].upper()
        lines.append(f"Dialogue: 0,{start},{end},Default,,0,0,0,,{text}")

    return header + "\n".join(lines)

