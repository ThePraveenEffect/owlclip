export interface Subtitle {
  text: string;
  start: number;
  end: number;
}

export type SubtitleStyle =
  | 'classic'
  | 'neon'
  | 'minimal'
  | 'bold-box'
  | 'karaoke';

export interface SubtitleStyleConfig {
  id: SubtitleStyle;
  label: string;
  description: string;
}

export const SUBTITLE_STYLES: SubtitleStyleConfig[] = [
  { id: 'classic', label: 'Classic', description: 'White text, dark pill background' },
  { id: 'neon', label: 'Neon', description: 'Cyan glow, no background' },
  { id: 'minimal', label: 'Minimal', description: 'Clean white, subtle shadow' },
  { id: 'bold-box', label: 'Bold Box', description: 'Yellow text, black rounded box' },
  { id: 'karaoke', label: 'Karaoke', description: 'Word-by-word highlight' },
];

export interface Clip {
  clip_num: number;
  title: string;
  description?: string;
  hashtags?: string[];
  url: string;
  viral_score: number;
  reasoning: string;
  start_time: number;
  end_time: number;
  subtitles: Subtitle[];
  subtitles_url?: string;
  hook?: string;
}

export interface JobData {
  success?: boolean;
  job_id: string;
  status: string;
  message: string;
  clips: Clip[];
  total_clips: number;
}

export interface ClipEditPayload {
  clip_num: number;
  title: string;
  description: string;
  hashtags: string[];
  start_time: number;
  end_time: number;
}
