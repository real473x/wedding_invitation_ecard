'use client';
import { useEffect, useRef, useState, CSSProperties, ReactNode } from 'react';
import { SectionStyle } from '@/lib/db';
import { RenderBorderFrame } from '@/lib/decorations';
import { getTransitionCssClass } from '@/lib/transitions';

interface SectionFrameProps {
  id: string;
  sectionKey: string;
  sectionStyle?: SectionStyle;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export default function SectionFrame({
  id,
  sectionStyle,
  className = '',
  style = {},
  children,
}: SectionFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [hoverTransition, setHoverTransition] = useState<string | null>(null);
  const [hoverBorderStyle, setHoverBorderStyle] = useState<string | null>(null);
  const [hoverHeadingFont, setHoverHeadingFont] = useState<string | null>(null);
  const [hoverBodyFont, setHoverBodyFont] = useState<string | null>(null);
  const [hoverAccentFont, setHoverAccentFont] = useState<string | null>(null);
  const [hoverOverlayOpacity, setHoverOverlayOpacity] = useState<number | null>(null);
  const [hoverOverlayColor, setHoverOverlayColor] = useState<string | null>(null);

  const activeTransitionKey = hoverTransition || sectionStyle?.transition || 'fade';
  const transitionClass = getTransitionCssClass(activeTransitionKey);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reset isEntering when transition key changes so CSS animation re-triggers
    setIsEntering(false);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger animation in next frame so browser animates from opacity: 0 to 1
            requestAnimationFrame(() => {
              setIsEntering(true);
            });
          } else {
            // Reset when scrolled out so re-scrolling back into section re-animates
            setIsEntering(false);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px 0px 50px 0px' }
    );

    observer.observe(el);

    function handleMessage(e: MessageEvent) {
      if (!el || !e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'GATE_OPENED' || e.data.type === 'PREVIEW_SELECT_SECTION') {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 200 && rect.bottom > -200) {
          setIsEntering(false);
          requestAnimationFrame(() => setIsEntering(true));
        }
      }
      if (e.data.type === 'PREVIEW_HOVER_STYLE') {
        if (e.data.sectionId === id) {
          if (e.data.transitionKey !== undefined) {
            setHoverTransition(e.data.transitionKey);
            setIsEntering(false);
            setTimeout(() => setIsEntering(true), 50);
          }
          if (e.data.borderStyle !== undefined) setHoverBorderStyle(e.data.borderStyle);
          if (e.data.headingFont !== undefined) setHoverHeadingFont(e.data.headingFont);
          if (e.data.bodyFont !== undefined) setHoverBodyFont(e.data.bodyFont);
          if (e.data.accentFont !== undefined) setHoverAccentFont(e.data.accentFont);
          if (e.data.overlayOpacity !== undefined) setHoverOverlayOpacity(e.data.overlayOpacity);
          if (e.data.overlayColor !== undefined) setHoverOverlayColor(e.data.overlayColor);
        }
      } else if (e.data.type === 'PREVIEW_CLEAR_HOVER') {
        setHoverTransition(null);
        setHoverBorderStyle(null);
        setHoverHeadingFont(null);
        setHoverBodyFont(null);
        setHoverAccentFont(null);
        setHoverOverlayOpacity(null);
        setHoverOverlayColor(null);
      }
    }

    window.addEventListener('message', handleMessage);

    return () => {
      observer.disconnect();
      window.removeEventListener('message', handleMessage);
    };
  }, [id, sectionStyle?.transition]);

  // Compute CSS custom variables for typography and styling overrides
  const customCssVars: Record<string, string> = {};

  const effectiveHeadingFont = hoverHeadingFont !== null ? hoverHeadingFont : sectionStyle?.headingStyle?.fontFamily;
  const effectiveBodyFont = hoverBodyFont !== null ? hoverBodyFont : sectionStyle?.bodyStyle?.fontFamily;
  const effectiveAccentFont = hoverAccentFont !== null ? hoverAccentFont : sectionStyle?.accentStyle?.fontFamily;

  if (effectiveHeadingFont) {
    customCssVars['--font-heading'] = `'${effectiveHeadingFont}', serif`;
  }
  if (sectionStyle?.headingStyle?.color) {
    customCssVars['--adaptive-text'] = sectionStyle.headingStyle.color;
  }
  if (sectionStyle?.headingStyle?.fontSize) {
    customCssVars['--section-heading-size'] = sectionStyle.headingStyle.fontSize;
  }
  if (effectiveBodyFont) {
    customCssVars['--font-body'] = `'${effectiveBodyFont}', sans-serif`;
  }
  if (sectionStyle?.bodyStyle?.color) {
    customCssVars['--adaptive-text-muted'] = sectionStyle.bodyStyle.color;
  }
  if (effectiveAccentFont) {
    customCssVars['--font-script'] = `'${effectiveAccentFont}', cursive`;
  }

  // Overlay opacity and color
  let overlayStyle: CSSProperties | undefined = undefined;
  const activeOverlayOpacity = hoverOverlayOpacity !== null ? hoverOverlayOpacity : sectionStyle?.overlayOpacity;
  const activeOverlayColor = hoverOverlayColor !== null ? hoverOverlayColor : sectionStyle?.overlayColor;

  if (activeOverlayOpacity !== undefined || activeOverlayColor) {
    const opacity = (activeOverlayOpacity ?? 50) / 100;
    const color = activeOverlayColor || '#000000';
    overlayStyle = {
      position: 'absolute',
      inset: 0,
      backgroundColor: color,
      opacity: opacity,
      pointerEvents: 'none',
      zIndex: 1,
    };
  }

  const activeBorderStyle = hoverBorderStyle !== null ? hoverBorderStyle : (sectionStyle?.borderStyle || 'none');

  return (
    <div
      ref={ref}
      id={id}
      className={`section-scroll-target ${transitionClass} ${className}`}
      data-entering={isEntering ? 'true' : 'false'}
      style={{
        position: 'relative',
        width: '100%',
        scrollSnapAlign: 'start',
        ...customCssVars,
        ...style,
      }}
    >
      {/* Background Overlay */}
      {overlayStyle && <div style={overlayStyle} />}

      {/* Decorative Border Frame */}
      {activeBorderStyle && activeBorderStyle !== 'none' && (
        <RenderBorderFrame
          borderStyle={activeBorderStyle}
          borderColor={sectionStyle?.borderColor}
          borderWidth={sectionStyle?.borderWidth || 1}
        />
      )}

      {/* Main Section Content */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        {children}
      </div>
    </div>
  );
}
