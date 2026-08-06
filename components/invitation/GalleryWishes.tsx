'use client';
import { useState, useEffect, useRef } from 'react';
import { WeddingConfig } from '@/lib/db';
import styles from './GalleryWishes.module.css';
import { INVITATION_DICT, Lang, getInvitationText } from '@/lib/i18n';

const PLACEHOLDER_PHOTOS = [
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=500&fit=crop',
];

import { getElementStyle } from '@/lib/element-styles';

interface Props { config: WeddingConfig; coupleId: string; style?: React.CSSProperties; lang?: Lang; textOverrides?: Record<string, string>; }

export default function GalleryWishes({ config, coupleId, style, lang, textOverrides }: Props) {
  const currentLang: Lang = lang || config.language || 'ms';
  const t = getInvitationText(currentLang, textOverrides);
  const photos = config.photos?.length ? config.photos : PLACEHOLDER_PHOTOS;
  const secStyle = config.pageStyles?.gallery;
  const [current, setCurrent] = useState(0);
  const [showWishForm, setShowWishForm] = useState(false);
  const [wishes, setWishes] = useState(config.wishes || []);
  const [wishName, setWishName] = useState('');
  const [wishMsg, setWishMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const sectionRef = useRef<HTMLElement>(null);
  const wishesListRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % photos.length);
    }, 3500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [photos.length]);

  async function submitWish(e: React.FormEvent) {
    e.preventDefault();
    if (!wishName || !wishMsg) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/couple/rsvp?coupleId=${coupleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'wish', name: wishName, message: wishMsg }),
      });
      if (res.ok) {
        setSubmitted(true);
        setWishes(w => [...w, { id: String(Date.now()), name: wishName, message: wishMsg, createdAt: new Date().toISOString() }]);
        setWishName('');
        setWishMsg('');
        setTimeout(() => { setShowWishForm(false); setSubmitted(false); }, 2000);
      }
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  }

  return (
    <section className={`invitation-section ${styles.section}`} style={style} ref={sectionRef}>
      <div className={styles.container}>
        {/* Photo Carousel */}
        <div className={styles.carousel}>
          <div className={styles.carouselTrack} style={{ transform: `translateX(-${current * 100}%)` }}>
            {photos.map((src, i) => (
              <div key={i} className={styles.slide} onClick={() => setLightboxUrl(src)} style={{ cursor: 'zoom-in' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Foto ${i + 1}`} className={styles.photo} />
                <div className={styles.photoOverlay} />
              </div>
            ))}
          </div>
          <div className={styles.dots}>
            {photos.map((_, i) => (
              <button key={i} className={`${styles.dot} ${i === current ? styles.dotActive : ''}`} onClick={() => setCurrent(i)} />
            ))}
          </div>
        </div>

        {/* Wishes */}
        <div className={styles.wishesWrap}>
          <p className={`font-script ${styles.wishTitle}`} style={getElementStyle(secStyle, 'galleryTitle', 'headingStyle')}>{t.wishesTitle}</p>
          <div className={styles.wishesList} ref={wishesListRef}>
            {wishes.filter(w => !w.isHidden).length === 0 ? (
              <p className={styles.noWish} style={getElementStyle(secStyle, 'galleryText', 'bodyStyle')}>{t.galleryNoWishes}</p>
            ) : (
              wishes.filter(w => !w.isHidden).slice().reverse().map(w => (
                <div key={w.id} className={styles.wishCard} style={getElementStyle(secStyle, 'galleryWishCard', 'bodyStyle')}>
                  <div className={styles.wishAvatar}>{w.name.charAt(0).toUpperCase()}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <p className={styles.wishName}>{w.name}</p>
                    <p className={styles.wishMsg}>"{w.message}"</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className={`btn btn-primary ${styles.wishBtn}`} onClick={() => setShowWishForm(true)} style={getElementStyle(secStyle, 'galleryWishBtn', 'headingStyle')}>
            💌 {t.sendWish}
          </button>
        </div>
      </div>

      {/* Floating Action Button for Desktop */}
      {isInView && (
        <button className={`btn btn-primary ${styles.floatingWishBtn}`} onClick={() => setShowWishForm(true)}>
          💌 {t.sendWish}
        </button>
      )}

      {/* Lightbox Modal */}
      {lightboxUrl && (
        <div className="popup-overlay" style={{ zIndex: 10000, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLightboxUrl(null)}>
          <button 
            type="button" 
            className="popup-close" 
            style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '20px', 
              fontSize: '1.5rem', 
              color: '#fff', 
              background: 'rgba(255,255,255,0.15)', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer',
              border: 'none'
            }}
            onClick={() => setLightboxUrl(null)}
          >
            ✕
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', width: '100%', height: '100%' }} onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightboxUrl} alt="Paparan Penuh Gambar" style={{ maxWidth: '95vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }} />
          </div>
        </div>
      )}

      {/* Wish Form Popup */}
      {showWishForm && (
        <div className="popup-overlay" onClick={() => setShowWishForm(false)}>
          <div className="popup-sheet" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <h3>💌 {t.sendWish}</h3>
              <button className="popup-close" onClick={() => setShowWishForm(false)}>✕</button>
            </div>
            <div className="popup-body">
              {submitted ? (
                <div className={styles.submitSuccess}>
                  <div style={{ fontSize: '2.5rem' }}>🎉</div>
                  <p>{t.galleryWishThanks}</p>
                </div>
              ) : (
                <form onSubmit={submitWish}>
                  <div className="form-group">
                    <label>{t.yourName}</label>
                    <input className="form-control" placeholder={t.galleryWishNamePlaceholder} value={wishName} onChange={e => setWishName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>{t.galleryWishLabel}</label>
                    <textarea className="form-control" placeholder={t.yourWish} value={wishMsg} onChange={e => setWishMsg(e.target.value)} required rows={4} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                    {submitting ? t.sending : `📤 ${t.submitWish}`}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
