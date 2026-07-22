'use client';
/**
 * useAdaptiveText.ts
 * ──────────────────────────────────────────────────────────────
 * React hook that observes the computed background-color of a
 * given element ref and returns recommended text colours that
 * will always pass WCAG AA contrast (≥4.5:1) against that
 * background.
 *
 * Usage:
 *   const { isDark, textColor, mutedColor } = useAdaptiveText(ref);
 *
 * Re-runs whenever:
 *   - The ref element mounts
 *   - The element's style attribute changes (MutationObserver)
 *   - activeSection prop changes (e.g. when a new section scrolls in)
 * ──────────────────────────────────────────────────────────────
 */
import { useEffect, useState, RefObject } from 'react';
import { getTextPaletteForBg, LIGHT_TEXT, DARK_TEXT } from '@/lib/contrast';

interface AdaptiveTextResult {
  /** True when the detected background is dark */
  isDark: boolean;
  /** The recommended primary text colour (hex/rgba string) */
  textColor: string;
  /** A slightly muted variant for secondary labels */
  mutedColor: string;
  /** A warm gold / deep-green accent colour */
  accentColor: string;
}

const DEFAULT_LIGHT: AdaptiveTextResult = {
  isDark: false,
  textColor: DARK_TEXT.primary,
  mutedColor: DARK_TEXT.muted,
  accentColor: DARK_TEXT.accent,
};
const DEFAULT_DARK: AdaptiveTextResult = {
  isDark: true,
  textColor: LIGHT_TEXT.primary,
  mutedColor: LIGHT_TEXT.muted,
  accentColor: LIGHT_TEXT.accent,
};

export function useAdaptiveText(
  ref: RefObject<HTMLElement | null>,
  /** Optional extra dep — re-evaluate when this value changes */
  dep?: unknown,
): AdaptiveTextResult {
  const [result, setResult] = useState<AdaptiveTextResult>(DEFAULT_LIGHT);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function evaluate() {
      if (!el) return;
      const computed = window.getComputedStyle(el);
      const bg = computed.backgroundImage || computed.backgroundColor;
      const { isDark } = getTextPaletteForBg(bg);

      // Also check the inline style backgroundImage (passed as style prop)
      // which getComputedStyle already resolves, but for overlay gradients
      // we need to detect the overlay darkness manually.
      // The overlay used in getSectionStyle is rgba(0,0,0,0.55) for dark
      // sections — if we find that pattern, force isDark=true.
      const inlineBg = el.style.backgroundImage || '';
      const hasDarkOverlay = /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.[4-9]/.test(inlineBg);

      const finalDark = isDark || hasDarkOverlay;
      setResult(finalDark ? DEFAULT_DARK : DEFAULT_LIGHT);
    }

    evaluate();

    // Watch for future style changes (e.g. when background image loads or theme switches)
    const observer = new MutationObserver(evaluate);
    observer.observe(el, { attributes: true, attributeFilter: ['style', 'class'] });

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, dep]);

  return result;
}
