'use client';
import { WeddingConfig } from '@/lib/db';

import { useState } from 'react';

import { INVITATION_DICT, Lang, getInvitationText } from '@/lib/i18n';

interface Props { config: WeddingConfig; onClose: () => void; lang?: Lang; textOverrides?: Record<string, string>; }

export default function CalendarPopup({ config, onClose, lang, textOverrides }: Props) {
  const currentLang: Lang = lang || config.language || 'ms';
  const t = getInvitationText(currentLang, textOverrides);
  const { groomName, brideName, weddingDate, weddingTime, venue, venueAddress } = config;
  const [closing, setClosing] = useState(false);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 250);
  }

  const title = encodeURIComponent(`Majlis Perkahwinan ${groomName} & ${brideName}`);
  const location = encodeURIComponent(`${venue}, ${venueAddress}`);
  const details = encodeURIComponent(`Jemputan ke Majlis Perkahwinan ${groomName} & ${brideName}`);

  // Google Calendar
  const gcStart = weddingDate.replace(/-/g, '') + 'T110000';
  const gcEnd = weddingDate.replace(/-/g, '') + 'T220000';
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${gcStart}/${gcEnd}&details=${details}&location=${location}`;

  // ICS for Apple Calendar
  function downloadIcs() {
    const icsContent = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//eWedding//EN',
      'BEGIN:VEVENT',
      `DTSTART:${gcStart}`,
      `DTEND:${gcEnd}`,
      `SUMMARY:${decodeURIComponent(title)}`,
      `DESCRIPTION:${decodeURIComponent(details)}`,
      `LOCATION:${decodeURIComponent(location)}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `perkahwinan-${groomName}-${brideName}.ics`.toLowerCase().replace(/\s/g, '-');
    a.click(); URL.revokeObjectURL(url);
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
          <h3>📅 Simpan ke Kalendar</h3>
          <button className="popup-close" onClick={handleClose}>✕</button>
        </div>
        <div className="popup-body">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>Majlis Perkahwinan</p>
            <p style={{ color: 'var(--color-primary)', fontSize: '1.2rem', fontWeight: 600, margin: '0.2rem 0' }}>- {groomName} &amp; {brideName} -</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0 }}>Simpan tarikh ke dalam kalendar anda.</p>
          </div>
          <div style={{
            marginTop: '1.5rem',
            marginBottom: '1.5rem',
            padding: '1.2rem',
            background: 'rgba(27, 67, 50, 0.05)',
            border: '1.5px solid rgba(27, 67, 50, 0.12)',
            borderRadius: '12px',
            textAlign: 'center',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            color: 'var(--color-text)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.02em', fontSize: '0.95rem' }}>
              📅 {weddingDate ? new Date(weddingDate + 'T00:00:00').toLocaleDateString('ms-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              🕐 {weddingTime}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600, borderTop: '1px solid rgba(27, 67, 50, 0.08)', paddingTop: '0.45rem', marginTop: '0.2rem' }}>
              📍 {venue}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a href={googleUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ justifyContent: 'center' }}>
              <CalIcon /> Simpan ke Google Calendar
            </a>
            <button className="btn btn-outline" onClick={downloadIcs} style={{ justifyContent: 'center' }}>
              🍎 Simpan ke Apple Calendar (.ics)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
