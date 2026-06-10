
def redistribute_subtitles(subtitles, clip_duration, min_gap=0.05):
    """
    Completely ignore original timestamps.
    Redistribute display time proportionally based on word count.
    Longer phrases get more screen time — matches natural speech pace.
    """
    if not subtitles:
        return []

    word_counts  = [len(sub["text"].split()) for sub in subtitles]
    total_words  = sum(word_counts)
    total_gaps   = min_gap * (len(subtitles) - 1)
    available    = clip_duration - total_gaps

    result = []
    cursor = 0.0

    for i, sub in enumerate(subtitles):
        proportion = word_counts[i] / total_words
        duration   = max(0.5, round(available * proportion, 3))
        start      = round(cursor, 3)
        end        = min(round(cursor + duration, 3), clip_duration)

        result.append({"text": sub["text"], "start": start, "end": end})
        cursor = end + min_gap

    return result




def group_subtitles(subtitles, max_words=5):
    """
    Merge subtitle entries into natural reading chunks.
    Flushes when word limit hit or a natural pause gap exists.
    """
    grouped   = []
    buf_words = []
    buf_start = None
    buf_end   = None

    for i, sub in enumerate(subtitles):
        words = sub["text"].strip().split()
        if buf_start is None:
            buf_start = sub["start"]
        buf_words.extend(words)
        buf_end = sub["end"]

        next_gap = (
            i + 1 < len(subtitles) and
            subtitles[i + 1]["start"] - sub["end"] > 0.35
        )

        if len(buf_words) >= max_words or next_gap:
            grouped.append({
                "text":  " ".join(buf_words),
                "start": buf_start,
                "end":   buf_end
            })
            buf_words = []
            buf_start = None
            buf_end   = None

    if buf_words:
        grouped.append({
            "text":  " ".join(buf_words),
            "start": buf_start,
            "end":   buf_end
        })

    return grouped



