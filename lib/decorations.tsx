import React from 'react';

export interface BorderPreset {
  key: string;
  label: string;
  labelEn: string;
  icon: string;
  description: string;
}

export const BORDER_PRESETS: BorderPreset[] = [
  { key: 'none', label: 'Tiada Bingkai', labelEn: 'None', icon: '⬛', description: 'Paparan bersih tanpa bingkai' },
  { key: 'single', label: 'Garisan Halus', labelEn: 'Single Line', icon: '🖼️', description: 'Bingkai garisan tunggal yang minimalist' },
  { key: 'double', label: 'Garisan Berganda', labelEn: 'Double Line', icon: '🔲', description: 'Dua lapisan garisan selari' },
  { key: 'ornate-gold', label: 'Ukiran Klasik Gold', labelEn: 'Ornate Gold', icon: '⚜️', description: 'Ukiran bucu klasik berunsur diraja' },
  { key: 'floral', label: 'Bunga-bungaan', labelEn: 'Floral Wreath', icon: '🌸', description: 'Hiasan flora di setiap sudut bingkai' },
  { key: 'corner-dots', label: 'Titik Bucu Minimalis', labelEn: 'Corner Dots', icon: '✦', description: 'Tiga titik geometri bergemerlapan di bucu' },
  { key: 'art-deco', label: 'Art Deco Mewah', labelEn: 'Art Deco', icon: '👑', description: 'Garisan geometri bermutu tinggi' },
  { key: 'mandala-corner', label: 'Mandala Ukiran', labelEn: 'Mandala Motifs', icon: '☸️', description: 'Corak simetri mandala tradisional' },
  { key: 'islamic', label: 'Kubah Arabesque', labelEn: 'Islamic Arch', icon: '🕌', description: 'Garisan gelembung bercorak geometri Islamik' },
  { key: 'bamboo', label: 'Buluh Tradisional', labelEn: 'Bamboo Frame', icon: '🎋', description: 'Bingkai elemen buluh semula jadi' },
];

export interface CornerPreset {
  key: string;
  label: string;
  icon: string;
}

export const CORNER_PRESETS: CornerPreset[] = [
  { key: 'none', label: 'Tiada', icon: '⚪' },
  { key: 'star', label: 'Bintang ✦', icon: '✦' },
  { key: 'floral', label: 'Bunga 🌸', icon: '🌸' },
  { key: 'diamond', label: 'Intan ◆', icon: '◆' },
  { key: 'mandala', label: 'Mandala ☸', icon: '☸' },
];

export interface BorderFrameProps {
  borderStyle?: string;
  borderColor?: string;
  borderWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export function RenderBorderFrame({ borderStyle = 'none', borderColor = 'var(--color-border)', borderWidth = 1 }: BorderFrameProps) {
  if (!borderStyle || borderStyle === 'none') return null;

  const color = borderColor || 'var(--color-border)';

  switch (borderStyle) {
    case 'single':
      return (
        <div
          style={{
            position: 'absolute',
            inset: '12px',
            border: `${borderWidth}px solid ${color}`,
            borderRadius: '12px',
            pointerEvents: 'none',
            zIndex: 2,
            opacity: 0.85,
          }}
        />
      );

    case 'double':
      return (
        <div
          style={{
            position: 'absolute',
            inset: '10px',
            border: `${borderWidth}px solid ${color}`,
            borderRadius: '16px',
            pointerEvents: 'none',
            zIndex: 2,
            opacity: 0.85,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '4px',
              border: `${Math.max(1, borderWidth - 1)}px solid ${color}`,
              borderRadius: '12px',
              opacity: 0.6,
            }}
          />
        </div>
      );

    case 'ornate-gold':
      return (
        <div
          style={{
            position: 'absolute',
            inset: '12px',
            border: `${borderWidth}px solid ${color}`,
            borderRadius: '16px',
            pointerEvents: 'none',
            zIndex: 2,
            boxShadow: `inset 0 0 12px ${color}22`,
          }}
        >
          {/* Corner ornaments */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => {
            const isTop = pos.includes('top');
            const isLeft = pos.includes('left');
            return (
              <svg
                key={pos}
                width="36"
                height="36"
                viewBox="0 0 40 40"
                fill="none"
                style={{
                  position: 'absolute',
                  top: isTop ? '-2px' : 'auto',
                  bottom: !isTop ? '-2px' : 'auto',
                  left: isLeft ? '-2px' : 'auto',
                  right: !isLeft ? '-2px' : 'auto',
                  transform: `scale(${isLeft ? 1 : -1}, ${isTop ? 1 : -1})`,
                }}
              >
                <path
                  d="M0 0 L40 0 C25 0 20 5 20 20 C20 35 0 25 0 40 L0 0 Z"
                  fill={color}
                  opacity="0.25"
                />
                <path
                  d="M4 4 C15 4 18 8 18 18 M8 4 C16 4 16 16 4 16"
                  stroke={color}
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            );
          })}
        </div>
      );

    case 'floral':
      return (
        <div
          style={{
            position: 'absolute',
            inset: '14px',
            border: `${borderWidth}px dashed ${color}`,
            borderRadius: '20px',
            pointerEvents: 'none',
            zIndex: 2,
            opacity: 0.7,
          }}
        >
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => {
            const isTop = pos.includes('top');
            const isLeft = pos.includes('left');
            return (
              <span
                key={pos}
                style={{
                  position: 'absolute',
                  top: isTop ? '-12px' : 'auto',
                  bottom: !isTop ? '-12px' : 'auto',
                  left: isLeft ? '-12px' : 'auto',
                  right: !isLeft ? '-12px' : 'auto',
                  fontSize: '18px',
                  color: color,
                }}
              >
                🌸
              </span>
            );
          })}
        </div>
      );

    case 'corner-dots':
      return (
        <div
          style={{
            position: 'absolute',
            inset: '14px',
            border: `${borderWidth}px solid ${color}`,
            borderRadius: '14px',
            pointerEvents: 'none',
            zIndex: 2,
            opacity: 0.75,
          }}
        >
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => {
            const isTop = pos.includes('top');
            const isLeft = pos.includes('left');
            return (
              <span
                key={pos}
                style={{
                  position: 'absolute',
                  top: isTop ? '-8px' : 'auto',
                  bottom: !isTop ? '-8px' : 'auto',
                  left: isLeft ? '-8px' : 'auto',
                  right: !isLeft ? '-8px' : 'auto',
                  fontSize: '12px',
                  color: color,
                  fontWeight: 'bold',
                }}
              >
                ✦
              </span>
            );
          })}
        </div>
      );

    case 'art-deco':
      return (
        <div
          style={{
            position: 'absolute',
            inset: '10px',
            border: `${borderWidth + 1}px solid ${color}`,
            borderRadius: '4px',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '6px',
              border: `1px solid ${color}`,
              opacity: 0.6,
            }}
          />
        </div>
      );

    default:
      return (
        <div
          style={{
            position: 'absolute',
            inset: '12px',
            border: `${borderWidth}px solid ${color}`,
            borderRadius: '12px',
            pointerEvents: 'none',
            zIndex: 2,
            opacity: 0.8,
          }}
        />
      );
  }
}
