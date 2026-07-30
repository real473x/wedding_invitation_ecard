'use client';
import { useState } from 'react';
import { WeddingConfig } from '@/lib/db';

import { INVITATION_DICT, Lang, getInvitationText } from '@/lib/i18n';

interface Props { config: WeddingConfig; onClose: () => void; lang?: Lang; textOverrides?: Record<string, string>; }

export default function LocationPopup({ config, onClose, lang, textOverrides }: Props) {
  const currentLang: Lang = lang || config.language || 'ms';
  const t = getInvitationText(currentLang, textOverrides);
  const [closing, setClosing] = useState(false);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 250);
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

        <div className="popup-header">
          <h3>{t.locationHeader}</h3>
          <button className="popup-close" onClick={handleClose}>✕</button>
        </div>
        <div className="popup-body">
          <div style={{
            marginBottom: '1.25rem',
            padding: '1.25rem',
            background: 'rgba(27, 67, 50, 0.04)',
            border: '1.5px solid rgba(201, 168, 76, 0.28)',
            borderRadius: '12px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            textAlign: 'center'
          }}>
            <p style={{
              fontWeight: 800,
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.1rem',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}>
              🏨 {config.venue}
            </p>
            <p style={{
              color: 'var(--color-text-muted)',
              fontSize: '0.85rem',
              fontWeight: 500,
              lineHeight: 1.4,
              borderTop: '1px dashed rgba(201, 168, 76, 0.3)',
              paddingTop: '0.6rem',
              marginTop: '0.2rem',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}>
              🗺️ {config.venueAddress}
            </p>
          </div>

          {config.showMap && config.mapEmbedUrl && (
            <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid var(--color-border)' }}>
              <iframe
                src={config.mapEmbedUrl}
                width="100%" height="200" style={{ border: 'none', display: 'block' }}
                title="Peta Lokasi" loading="lazy"
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {config.wazeLink && (
              <a href={config.wazeLink} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ justifyContent: 'center', background: '#33ccff', color: '#fff', border: 'none' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                  <path d="M19.78 10.15c-.24-3.52-2.94-6.43-6.43-6.93-4.14-.59-7.85 2.22-8.32 6.27-.08.68-.04 1.34.1 1.97-.2.25-.33.56-.33.91 0 .83.67 1.5 1.5 1.5.21 0 .4-.05.58-.13.78.68 1.79 1.12 2.92 1.21.05.55.27 1.05.62 1.45l-.47 1.4c-.16.48.09 1 .57 1.16.48.16 1-.09 1.16-.57l.38-1.14c.2.03.41.05.63.05.22 0 .43-.02.63-.05l.38 1.14c.16.48.68.73 1.16.57.48-.16.73-.68.57-1.16l-.47-1.4c.35-.4.57-.9.62-1.45 1.13-.09 2.14-.53 2.92-1.21.18.08.37.13.58.13.83 0 1.5-.67 1.5-1.5 0-.35-.13-.66-.33-.91.14-.63.18-1.29.1-1.97zM7.5 9c-.83 0-1.5-.67-1.5-1.5S6.67 6 7.5 6s1.5.67 1.5 1.5S8.33 9 7.5 9zm5 0c-.83 0-1.5-.67-1.5-1.5S11.67 6 12.5 6s1.5.67 1.5 1.5S13.33 9 12.5 9z" />
                </svg>
                Buka dengan Waze
              </a>
            )}
            {config.googleMapsLink && (
              <a href={config.googleMapsLink} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ justifyContent: 'center', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" fill="#EA4335" />
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 1.34.27 2.62.77 3.8L12 22l6.23-9.2C18.73 11.62 19 10.34 19 9c0-3.87-3.13-7-7-7z" stroke="#4285F4" strokeWidth="1.5" />
                </svg>
                Buka dengan Google Maps
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
