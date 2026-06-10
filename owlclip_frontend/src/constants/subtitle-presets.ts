  // ─── Subtitle Presets ─────────────────────────────────────────────────────────
  // NO BACKGROUNDS — clean text only, positioned intelligently.

  export interface SubtitlePreset {
    name: string;
    fontSize: number;
    fontWeight: number;
    textColor: string;
    textStroke?: string;
    textShadow?: string;
    textTransform?: 'uppercase' | 'lowercase' | 'none';
    position?: 'bottom' | 'lower-third' | 'center';
    letterSpacing?: number;
    fontFamily?: string;
    lineHeight?: number;
    karaokeColor?: string;
    karaokeGlow?: string;
    wordAnimation?: 'pop' | 'fade' | 'slide' | 'none';
    wordByWord?: boolean;       // highlight word by word as video plays
    backgroundColor?: string;   // optional dark backdrop pill (CSS)
    padding?: string;           // inner spacing for backdrop pill (CSS)
    borderRadius?: string;      // corner radius for backdrop pill (CSS)
    }

  export const SUBTITLE_PRESETS: Record<string, SubtitlePreset> = {
    // ─── Clean White: The default subtitle look ──────────────────────────────
    clean: {
      name: 'Clean',
      fontSize: 22,
      fontWeight: 600,
      textColor: '#ffffff',
      textShadow:
        '0 1px 8px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,1)',
      position: 'lower-third',
      letterSpacing: 0.2,
      lineHeight: 1.45,
    },

    // ─── Neon: Controlled glow, not nuclear ──────────────────────────────────
 neon: {
  name: 'Neon',
  fontSize: 22,            // Bumped up slightly to ensure high readability on mobile screens
  fontWeight: 900,            // Maximum black/ultra weight gives the letters solid core structure
  textColor: '#ffffff',       // Pure white core—crucial for realistic neon (the glow provides the color)
  textShadow: '0 0 4px #67e8f9, 0 0 12px #67e8f9, 0 0 30px rgba(103,232,249,0.6), 0 2px 4px rgba(0,0,0,0.9), 0 6px 16px rgba(0,0,0,0.95)',
  textTransform: 'uppercase',
  position: 'bottom',
      // Fine-tuned placement slightly higher to perfectly dodge platform UI elements
  letterSpacing: 4.5,         // Expanded letter spacing; prevents glowing letters from blurring into a blob
  lineHeight: 1.5,
  
  // Advanced Additions (Supported by most modern video rendering & canvas engines)
  backgroundColor: 'rgba(0, 0, 0, 0.25)', // Subtle dark backdrop pill to make the cyan pop drastically
  padding: '8px 20px',        // Internal spacing for the backdrop pill
  borderRadius: '12px',       // Smooth, modern rounded corners for the backdrop
  fontFamily: 'Montserrat, Inter, system-ui', // Punchy, modern geometric sans-serif fonts
},



    // ─── Gold: Premium warm gold ─────────────────────────────────────────────
    gold: {
      name: 'Gold',
      fontSize: 26,
      fontWeight: 800,
      textColor: '#fde68a',
      textShadow:
        '0 1px 6px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)',
      position: 'lower-third',
      letterSpacing: 0.8,
      lineHeight: 1.4,
    },

    // ─── Karaoke: Word-by-word highlight as video plays ──────────────────────
    karaoke: {
      name: 'Karaoke',
      fontSize: 26,
      fontWeight: 800,
      textColor: '#9ca3af',
      textShadow:
        '0 2px 10px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.9)',
      position: 'lower-third',
      letterSpacing: 0,
      lineHeight: 1.45,
      karaokeColor: '#fb923c',
      karaokeGlow: '0 0 12px rgba(251,146,60,0.6), 0 0 4px rgba(251,146,60,0.3)',
      wordByWord: true,
    },

    // ─── Minimal: Invisible text, just clean readable ────────────────────────
    minimal: {
      name: 'Minimal',
      fontSize: 25,
      fontWeight: 500,
      textColor: '#ffffff',
      textShadow:
        '0 1px 6px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,1)',
      position: 'lower-third',
      letterSpacing: 0.15,
      lineHeight: 1.5,
    },

    // ─── Cinematic: Thin + wide track ────────────────────────────────────────
    cinematic: {
      name: 'Cinematic',
      fontSize: 20,
      fontWeight: 400,
      textColor: '#d4d4d4',
      textShadow: '0 1px 4px rgba(0,0,0,0.9)',
      textTransform: 'uppercase',
      position: 'lower-third',
      letterSpacing: 4,
      lineHeight: 1.5,
    },


    // ─── Typewriter: Monospace + fade-in per word ────────────────────────────
   typewriter: {
  name: 'Typewriter',
  fontSize: 22,                 // Slightly smaller to mimic vintage document sizing
  fontWeight: 700,                 // Bold stamp effect mimics ink bleeding into paper
  textColor: '#f8fafc',            // Off-white paper color instead of gray
  textShadow: '2px 2px 0px rgba(0,0,0,0.2), 0px 0px 4px rgba(0,0,0,0.15)', // Sharp stamp offset instead of a soft glow
  position: 'lower-third',
  bottom: '20%',                   // Keeps consistency with your preferred layout placement
  letterSpacing: 1.5,              // Classic spacious mechanical spacing
  lineHeight: 1.5,
  fontFamily: '"Courier New", Courier, "Special Elite", monospace', // Authentic vintage typewriter fonts instead of programming fonts
  
  // Animation Tuning
  wordAnimation: 'slide',
  wordByWord: true,
  karaokeColor: '#f1f5f9',         // Kept neutral to match real ink (avoid neon colors here)
  karaokeGlow: 'none',
  
  // Advanced Mechanical Touches
  backgroundColor: 'rgba(28, 25, 23, 0.85)', // A dark, structured ticket-strip background
  padding: '6px 14px',             // Makes it look like an authentic typed strip tape
  borderRadius: '2px',             // Sharp, paper-cut edges instead of soft rounded corners
}
,
    // ─── Soft Shadow: Warm white with deep soft shadow ───────────────────────
    'soft-shadow': {
      name: 'Soft Shadow',
      fontSize: 24,
      fontWeight: 700,
      textColor: '#fef3c7',
      textShadow:
        '0 2px 20px rgba(0,0,0,0.95), 0 4px 12px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.5)',
      position: 'lower-third',
      letterSpacing: 0.3,
      lineHeight: 1.45,
    },

    // ─── Outline Only: Hollow text with strong stroke ────────────────────────
    outline: {
      name: 'Outline',
      fontSize: 22,
      fontWeight: 900,
      textColor: 'transparent',
      textStroke: '1.5px #ffffff',
      textShadow: '0 0 12px rgba(255,255,255,0.3)',
      textTransform: 'uppercase',
      position: 'lower-third',
      letterSpacing: 3,
      lineHeight: 1.35,
    },

    
  };

  // ─── Position system ─────────────────────────────────────────────────────────
  // All positions are bottom-anchored % to stay consistent across aspect ratios.
  // "lower-third" = classic TV safe area, "bottom" = just above controls, "center" = middle

  export const POSITION_MAP: Record<string, string> = {
    bottom: '5%',
    'lower-third': '18%',
    center: '50%',
  };

  export function getSubtitlePositionStyles(presetKey: string): React.CSSProperties {
    const p = SUBTITLE_PRESETS[presetKey];
    const pos = p?.position || 'lower-third';

    if (pos === 'center') {
      return { top: '50%', transform: 'translateY(-50%)' };
    }
    return { bottom: POSITION_MAP[pos] || '18%' };
  }

  // ─── Convert preset to inline styles ────────────────────────────────────────

  export function presetToTextStyle(presetKey: string): React.CSSProperties {
    const p = SUBTITLE_PRESETS[presetKey];
    if (!p) return {};
    return {
      fontSize: `${p.fontSize}px`,
      fontWeight: p.fontWeight,
      color: p.textColor,
      WebkitTextStroke: p.textStroke,
      textShadow: p.textShadow || undefined,
      textTransform: p.textTransform || undefined,
      letterSpacing: p.letterSpacing ? `${p.letterSpacing}px` : undefined,
      fontFamily:
        p.fontFamily ||
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif',
      lineHeight: p.lineHeight || 1.4,
      backgroundColor: p.backgroundColor || undefined,
      padding: p.padding || undefined,
      borderRadius: p.borderRadius || undefined,
    };
  }

  // ─── Word entrance animation ────────────────────────────────────────────────

  export function getWordAnimation(presetKey: string): string | undefined {
    const p = SUBTITLE_PRESETS[presetKey];
    if (!p || p.wordAnimation === 'none') return undefined;
    switch (p.wordAnimation) {
      case 'pop':
        return 'subtitleWordPop 220ms cubic-bezier(0.34, 1.56, 0.64, 1) both';
      case 'fade':
        return 'subtitleWordFade 220ms ease-out both';
      case 'slide':
        return 'subtitleWordSlide 220ms ease-out both';
      default:
        return undefined;
    }
  }
