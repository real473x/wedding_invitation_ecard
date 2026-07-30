'use client';
import { useState } from 'react';
import { WeddingConfig } from '@/lib/db';

import { INVITATION_DICT, Lang, getInvitationText } from '@/lib/i18n';

interface Props { config: WeddingConfig; onClose: () => void; lang?: Lang; textOverrides?: Record<string, string>; }

const QR_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE1MCIgeD0iMCIgeT0iMCIgZmlsbD0iI2Y1ZjVmNSIgcng9IjgiLz48dGV4dCB4PSI3NSIgeT0iNjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMjgiPvwn5GJ8J+RiTwvdGV4dD48dGV4dCB4PSI3NSIgeT0iOTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNiYmIiIGZvbnQtc2l6ZT0iMTEiPlFSIENvZGU8L3RleHQ+PHRleHQgeD0iNzUiIHk9IjExMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2NjYyIgZm9udC1zaXplPSI5Ij5QbGFjZWhvbGRlcjwvdGV4dD48L3N2Zz4=';

export default function MoneyPopup({ config, onClose, lang, textOverrides }: Props) {
  const [copied, setCopied] = useState(false);

  const currentLang: Lang = lang || config.language || 'ms';
  const t = getInvitationText(currentLang, textOverrides);
  const qrSrc = config.bankQrUrl || QR_PLACEHOLDER;
  const [showHearts, setShowHearts] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; left: number; delay: number }[]>([]);
  const [closing, setClosing] = useState(false);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 250);
  }

  function copyAccNum() {
    navigator.clipboard.writeText(config.bankAccountNo).catch(() => {});
    setShowHearts(true);
    setHearts(Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      delay: Math.random() * 0.7
    })));
    setTimeout(() => {
      setShowHearts(false);
      setHearts([]);
    }, 2800);
  }

  return (
    <div className={`popup-overlay ${closing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`popup-sheet ${closing ? 'closing' : ''}`} style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
        {/* Animated Corner Flowers */}
        <div style={{
          position: 'absolute',
          top: '-15px',
          right: '-15px',
          fontSize: '2.5rem',
          transform: 'rotate(15deg)',
          animation: 'spin 20s linear infinite',
          pointerEvents: 'none',
          opacity: 0.85
        }}>🌸</div>
        
        {/* Floating Hearts Overlay */}
        {showHearts && (
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            borderRadius: '24px',
            zIndex: 10
          }}>
            {hearts.map(h => (
              <div
                key={h.id}
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: `${h.left}%`,
                  fontSize: '1.5rem',
                  animation: 'floating-heart-up 2.2s ease-out forwards',
                  animationDelay: `${h.delay}s`,
                  opacity: 0,
                }}
              >
                ❤️
              </div>
            ))}
          </div>
        )}

        <div className="popup-header">
          <h3>{t.moneyHeader}</h3>
          <button className="popup-close" onClick={handleClose}>✕</button>
        </div>
        <div className="popup-body">
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem', padding: '0 0.5rem' }}>
            <strong style={{ display: 'block', fontWeight: '700', color: 'var(--color-primary)' }}>
              {currentLang === 'en' ? 'Your kind monetary gift is deeply appreciated. Thank you!' : 'Sumbangan ikhlas anda amat dihargai. Terima kasih!'}
            </strong>
          </p>

          <div style={{ background: 'var(--color-surface)', borderRadius: '14px', padding: '1.25rem', border: '1px solid rgba(201,168,76,.2)', display: 'flex', flexDirection: 'column', gap: '0.85rem', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '100%' }}>
              <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>Bank</p>
              <p style={{ fontFamily: 'var(--font-body), sans-serif', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>{config.bankName}</p>
            </div>
            
            <div style={{ width: '100%' }}>
              <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>Nama Pemilik</p>
              <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>{config.bankAccountName}</p>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>No. Akaun</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <p style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.05em' }}>{config.bankAccountNo}</p>
                <button
                  onClick={copyAccNum}
                  className="btn btn-sm"
                  style={{
                    background: 'var(--color-primary-light)',
                    color: '#fff',
                    border: 'none',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    borderRadius: '6px'
                  }}
                  title="Salin No. Akaun"
                >
                  📋 Salin
                </button>
              </div>
            </div>

            <div style={{ marginTop: '0.5rem', textAlign: 'center', width: '100%' }}>
              <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)', marginBottom: '0.65rem' }}>Imbas Kod QR</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrSrc} alt="Banking QR Code" style={{ width: 150, height: 150, borderRadius: '8px', border: '2px solid var(--color-border)', display: 'block', margin: '0 auto' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
