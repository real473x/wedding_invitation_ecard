'use client';
import { useState } from 'react';
import { WeddingConfig } from '@/lib/db';

import { INVITATION_DICT, Lang, getInvitationText } from '@/lib/i18n';

interface Props { config: WeddingConfig; coupleId: string; onClose: () => void; lang?: Lang; textOverrides?: Record<string, string>; }

export default function RsvpPopup({ config, coupleId, onClose, lang, textOverrides }: Props) {
  const currentLang: Lang = lang || config.language || 'ms';
  const t = getInvitationText(currentLang, textOverrides);
  const [form, setForm] = useState({ name: '', phone: '', attending: 'yes' as 'yes' | 'no', paxCount: 1, wishes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [closing, setClosing] = useState(false);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 250);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(`/api/couple/rsvp?coupleId=${coupleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setDone(true);
    } finally { setSubmitting(false); }
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
          <h3>{t.rsvpHeader}</h3>
          <button className="popup-close" onClick={handleClose}>✕</button>
        </div>
        <div className="popup-body">
          {done ? (
            <div style={{ textAlign: 'center', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ fontSize: '3rem' }}>🎉</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>{currentLang === 'en' ? 'Thank You!' : 'Terima Kasih!'}</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>{currentLang === 'en' ? 'Your RSVP has been submitted. We look forward to seeing you!' : 'Kehadiran anda telah direkodkan. Kami menantikan kehadiran anda!'}</p>
              <button type="button" className="btn btn-primary" onClick={handleClose}>{currentLang === 'en' ? 'Close' : 'Tutup'}</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama Penuh *</label>
                <input className="form-control" placeholder="Nama anda..." value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              
              <div className="form-group">
                <label>No. Telefon</label>
                <input className="form-control" type="tel" placeholder="0123456789" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.25rem 0' }}>
                <label style={{ alignSelf: 'flex-start', marginBottom: '0.5rem' }}>Kehadiran *</label>
                
                {/* Electric Toggle Switch */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--color-surface-2)', padding: '0.45rem 1.25rem', borderRadius: '30px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: form.attending === 'no' ? 'var(--color-primary)' : 'var(--color-text-muted)', transition: 'color 0.2s' }}>Tidak Hadir</span>
                  
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, attending: f.attending === 'yes' ? 'no' : 'yes' }))}
                    style={{
                      width: '74px',
                      height: '34px',
                      borderRadius: '17px',
                      background: form.attending === 'yes' ? 'var(--color-primary)' : '#cbd5e1',
                      border: 'none',
                      position: 'relative',
                      cursor: 'pointer',
                      outline: 'none',
                      padding: 0,
                      boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.15)',
                      transition: 'background 0.25s'
                    }}
                    aria-label="Tukar status kehadiran"
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      top: '3px',
                      left: form.attending === 'yes' ? '43px' : '3px',
                      transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: form.attending === 'yes' ? 'var(--color-primary)' : '#64748b'
                    }}>
                      {form.attending === 'yes' ? '✓' : '✗'}
                    </div>
                  </button>
                  
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: form.attending === 'yes' ? 'var(--color-primary)' : 'var(--color-text-muted)', transition: 'color 0.2s' }}>Hadir</span>
                </div>
              </div>

              {form.attending === 'yes' && (
                <div className="form-group" style={{ animation: 'fadeInUp 0.3s ease both' }}>
                  <label>Jumlah Yang Hadir (termasuk anda)</label>
                  <input className="form-control" type="number" min="1" max="20" value={form.paxCount} onChange={e => setForm(f => ({ ...f, paxCount: Number(e.target.value) }))} />
                </div>
              )}
              
              <div className="form-group">
                <label>Ucapan / Doa (Pilihan)</label>
                <textarea className="form-control" placeholder="Tulis ucapan untuk pengantin..." value={form.wishes} onChange={e => setForm(f => ({ ...f, wishes: e.target.value }))} />
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? 'Menghantar...' : '📤 Hantar RSVP'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
