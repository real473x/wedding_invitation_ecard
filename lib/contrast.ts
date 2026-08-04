/**
 * contrast.ts
 * ─────────────────────────────────────────────────────────────
 * Utilities for detecting dark backgrounds and choosing
 * readable foreground (text) colors based on WCAG 2.1 relative
 * luminance formulas.
 * ─────────────────────────────────────────────────────────────
 */

/** Parse any CSS color string into { r, g, b } in 0-255 range */
export function parseCssColor(color: string): { r: number; g: number; b: number } | null {
  // Normalize
  const s = color.trim().toLowerCase();

  // rgb() / rgba()
  const rgbMatch = s.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (rgbMatch) {
    return { r: +rgbMatch[1], g: +rgbMatch[2], b: +rgbMatch[3] };
  }

  // #rrggbb / #rgb / #rrggbbaa
  const hex6 = s.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/);
  if (hex6) {
    const h = hex6[1];
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }
  const hex3 = s.match(/^#([0-9a-f]{3})$/);
  if (hex3) {
    const h = hex3[1];
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
    };
  }

  // Named colors (handle common dark ones explicitly)
  const namedDark: Record<string, [number, number, number]> = {
    black: [0, 0, 0],
    white: [255, 255, 255],
    transparent: [255, 255, 255],
  };
  if (namedDark[s]) {
    const [r, g, b] = namedDark[s];
    return { r, g, b };
  }

  return null;
}

/**
 * Calculate relative luminance of an sRGB colour (WCAG 2.1 §1.4.3)
 * Returns a value in [0, 1].  0 = black, 1 = white.
 */
export function relativeLuminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * WCAG contrast ratio between two luminances.
 * Returns a value in [1, 21].  21 = black on white.
 */
export function contrastRatio(lum1: number, lum2: number): number {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Given a background luminance, return whether it is "dark"
 * (i.e. luminance < 0.18, roughly below 18% grey).
 */
export function isLuminanceDark(lum: number): boolean {
  return lum < 0.18;
}

/**
 * Extract the dominant background color of a CSS `background` value.
 * Handles plain colors, rgba() overlays, and gradients.
 * Falls back to null if the color cannot be determined.
 */
export function extractBgColor(bgValue: string): { r: number; g: number; b: number } | null {
  if (!bgValue || bgValue === 'none' || bgValue === 'transparent') return null;

  // Try parsing as direct color first
  const direct = parseCssColor(bgValue);
  if (direct) return direct;

  // For gradients or compound values, try to find an rgba/rgb token
  const rgbaMatch = bgValue.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s]+[\d.]+)?\)/);
  if (rgbaMatch) {
    return { r: +rgbaMatch[1], g: +rgbaMatch[2], b: +rgbaMatch[3] };
  }

  // Try to find a hex token anywhere in the string
  const hexMatch = bgValue.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/);
  if (hexMatch) {
    return parseCssColor(hexMatch[0]);
  }

  return null;
}

/** Light text palette (for dark backgrounds) */
export const LIGHT_TEXT = {
  primary: '#FFFFFF',
  secondary: '#F0E8D0',   // warm off-white
  accent: '#F5D87A',      // warm gold highlight
  muted: 'rgba(255,255,255,0.72)',
} as const;

/** Dark text palette (for light backgrounds) */
export const DARK_TEXT = {
  primary: '#1A1A1A',
  secondary: '#2C1810',
  accent: '#1B4332',      // deep green
  muted: 'rgba(44,24,16,0.6)',
} as const;

/**
 * Given a background CSS string, determine if it is dark and return
 * a recommended text color palette.
 * Threshold: luminance < 0.18 → dark bg.
 */
export function getTextPaletteForBg(bgCss: string): {
  isDark: boolean;
  text: typeof LIGHT_TEXT | typeof DARK_TEXT;
  primaryColor: string;
} {
  const parsed = extractBgColor(bgCss);
  if (!parsed) {
    // Default: assume light bg
    return { isDark: false, text: DARK_TEXT, primaryColor: DARK_TEXT.primary };
  }
  const lum = relativeLuminance(parsed.r, parsed.g, parsed.b);
  const dark = isLuminanceDark(lum);
  return {
    isDark: dark,
    text: dark ? LIGHT_TEXT : DARK_TEXT,
    primaryColor: dark ? LIGHT_TEXT.primary : DARK_TEXT.primary,
  };
}
