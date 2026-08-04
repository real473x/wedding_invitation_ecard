'use client';
/**
 * AdaptiveTextSection.tsx
 * ──────────────────────────────────────────────────────────────
 * A wrapper component that:
 *  1. Detects whether its own background is dark or light.
 *  2. Injects a set of CSS custom properties into the element
 *     so that all child text that references these variables
 *     automatically renders in a readable colour.
 *
 * Injected CSS variables:
 *   --adaptive-text         — primary text colour
 *   --adaptive-text-muted   — secondary / muted text colour
 *   --adaptive-accent       — warm accent (gold on dark, green on light)
 *   --adaptive-is-dark      — "1" when dark, "0" when light (for calc())
 *
 * Any invitation section can simply use `var(--adaptive-text)` in its
 * CSS and the colour will always be readable regardless of background.
 *
 * Usage:
 *   <AdaptiveTextSection className="invitation-section" style={bgStyle}>
 *     <h1 style={{ color: 'var(--adaptive-text)' }}>Majlis Perkahwinan</h1>
 *   </AdaptiveTextSection>
 * ──────────────────────────────────────────────────────────────
 */

import { useRef, CSSProperties, ReactNode } from 'react';
import { useAdaptiveText } from '@/hooks/useAdaptiveText';

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
  /** Extra dependency to force re-evaluation (e.g. theme key) */
  dep?: unknown;
}

export default function AdaptiveTextSection({ children, className, style, id, dep }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { textColor, mutedColor, accentColor, isDark } = useAdaptiveText(
    ref as React.RefObject<HTMLElement>,
    dep,
  );

  const adaptiveVars: CSSProperties = {
    '--adaptive-text': textColor,
    '--adaptive-text-muted': mutedColor,
    '--adaptive-accent': accentColor,
    '--adaptive-is-dark': isDark ? '1' : '0',
  } as CSSProperties;

  return (
    <section
      ref={ref}
      id={id}
      className={className}
      style={{ ...style, ...adaptiveVars }}
      data-bg-dark={isDark ? 'true' : 'false'}
    >
      {children}
    </section>
  );
}
