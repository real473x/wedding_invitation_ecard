'use client';
import { useState } from 'react';
import { WeddingConfig, Gift } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

import { INVITATION_DICT, Lang, getInvitationText } from '@/lib/i18n';

interface Props { config: WeddingConfig; coupleId: string; onClose: () => void; onUpdateGifts?: (g: Gift[]) => void; lang?: Lang; textOverrides?: Record<string, string>; }

export default function GiftPopup({ config, coupleId, onClose, onUpdateGifts, lang, textOverrides }: Props) {
  const currentLang: Lang = lang || config.language || 'ms';
  const t = getInvitationText(currentLang, textOverrides);
  const [gifts, setGifts] = useState<Gift[]>(config.gifts || []);
  const [newItem, setNewItem] = useState('');
  const [newLink, setNewLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [closing, setClosing] = useState(false);

  const [scrapeStatus, setScrapeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [useFallback, setUseFallback] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const [scrapePriceStatus, setScrapePriceStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [usePriceFallback, setUsePriceFallback] = useState(true);
  const [showPriceSettings, setShowPriceSettings] = useState(false);

  const [activeLightboxUrl, setActiveLightboxUrl] = useState<string | null>(null);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 250);
  }

  async function handleFetchImage() {
    if (!newLink) return;
    setScrapeStatus('loading');
    try {
      const res = await fetch(`/api/scrape-link?url=${encodeURIComponent(newLink)}`);
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setImageUrl(data.imageUrl);
        setScrapeStatus('success');
        setTimeout(() => setScrapeStatus('idle'), 4000);
      } else {
        if (useFallback) {
          const query = newItem || 'Hadiah';
          const proceed = window.confirm(
            `Error Getting Image, Proceed to public search result for "${query}"?\n\n⚠️ May display inaccurate product image.`
          );
          if (!proceed) {
            setScrapeStatus('error');
            setTimeout(() => setScrapeStatus('idle'), 6000);
            return;
          }
          
          setScrapeStatus('loading');
          const searchRes = await fetch(`/api/search-image?q=${encodeURIComponent(query)}`);
          const searchData = await searchRes.json();
          if (searchRes.ok && searchData.imageUrl) {
            setImageUrl(searchData.imageUrl);
            setScrapeStatus('success');
            setTimeout(() => setScrapeStatus('idle'), 4000);
          } else {
            setScrapeStatus('error');
            setTimeout(() => setScrapeStatus('idle'), 6000);
          }
        } else {
          setScrapeStatus('error');
          setTimeout(() => setScrapeStatus('idle'), 6000);
        }
      }
    } catch {
      setScrapeStatus('error');
      setTimeout(() => setScrapeStatus('idle'), 6000);
    }
  }

  async function handleFetchPrice() {
    if (!newLink) return;
    setScrapePriceStatus('loading');
    try {
      const res = await fetch(`/api/scrape-price?url=${encodeURIComponent(newLink)}`);
      const data = await res.json();
      if (res.ok && data.price) {
        setNewPrice(data.price);
        setScrapePriceStatus('success');
        setTimeout(() => setScrapePriceStatus('idle'), 4000);
      } else {
        if (usePriceFallback) {
          const query = newItem || 'Hadiah';
          const proceed = window.confirm(
            `Error Getting Price, Proceed to public search result for "${query}"?\n\n⚠️ May display inaccurate product price.`
          );
          if (!proceed) {
            setScrapePriceStatus('error');
            setTimeout(() => setScrapePriceStatus('idle'), 6000);
            return;
          }
          
          setScrapePriceStatus('loading');
          const searchRes = await fetch(`/api/search-price?q=${encodeURIComponent(query)}`);
          const searchData = await searchRes.json();
          if (searchRes.ok && searchData.price) {
            setNewPrice(searchData.price);
            setScrapePriceStatus('success');
            setTimeout(() => setScrapePriceStatus('idle'), 4000);
          } else {
            setScrapePriceStatus('error');
            setTimeout(() => setScrapePriceStatus('idle'), 6000);
          }
        } else {
          setScrapePriceStatus('error');
          setTimeout(() => setScrapePriceStatus('idle'), 6000);
        }
      }
    } catch {
      setScrapePriceStatus('error');
      setTimeout(() => setScrapePriceStatus('idle'), 6000);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/couple/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
      } else {
        alert(data.error || 'Ralat muat naik.');
      }
    } catch {
      alert('Gagal memuat naik gambar.');
    } finally {
      setUploading(false);
    }
  }

  async function handleAddGift(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem) return;
    setAdding(true);
    
    const item: Gift = { id: uuidv4(), item: newItem, link: newLink, imageUrl, claimedBy: '', price: newPrice };
    const updated = [...gifts, item];
    try {
      const res = await fetch(`/api/couple/gift?coupleId=${coupleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gifts: updated }),
      });
      if (res.ok) {
        setGifts(updated);
        if (onUpdateGifts) onUpdateGifts(updated);
        setNewItem('');
        setNewLink('');
        setImageUrl('');
        setNewPrice('');
        setShowAdd(false);
      }
    } catch {
      alert('Gagal menyimpan hadiah.');
    }
    setAdding(false);
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
          <h3>{t.giftHeader}</h3>
          <button className="popup-close" onClick={handleClose}>✕</button>
        </div>
        <div className="popup-body">
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '1rem', lineHeight: 1.6 }}>
            {currentLang === 'en' ? 'Here is the gift wishlist suggested by the couple. Click "Buy ↗" if you wish to claim an item.' : 'Berikut adalah senarai hadiah yang dicadangkan oleh pasangan. Sila klik "Beli ↗" jika anda ingin menuntut barangan tersebut.'}
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {gifts.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '1rem' }}>{currentLang === 'en' ? 'No gifts listed yet.' : 'Tiada hadiah disenaraikan.'}</p>
            ) : gifts.map(g => (
              <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid rgba(201,168,76,.15)' }}>
                {g.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={g.imageUrl} 
                    alt={g.item} 
                    style={{ width: 48, height: 48, borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--color-border)', flexShrink: 0, cursor: 'pointer' }} 
                    onClick={() => setActiveLightboxUrl(g.imageUrl || null)}
                    title={t.viewLargeImageTooltip}
                  />
                ) : (
                  <div style={{ width: 48, height: 48, borderRadius: '8px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                    🎁
                  </div>
                )}
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.item}</p>
                  {g.price && <p style={{ fontSize: '0.78rem', color: 'var(--color-primary)', marginTop: '2px', fontWeight: 600 }}>{g.price}</p>}
                  {g.claimedBy && <p style={{ fontSize: '0.75rem', color: 'var(--color-primary)', marginTop: '2px', fontWeight: 600 }}>✓ Dituntut oleh {g.claimedBy}</p>}
                </div>
                
                {g.link && (
                  <a href={g.link} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline" style={{ flexShrink: 0, fontSize: '0.72rem', padding: '0.35rem 0.75rem' }}>
                    Beli ↗
                  </a>
                )}
              </div>
            ))}
          </div>

          {!showAdd ? (
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowAdd(true)}>
              ＋ Cadang Hadiah Baru
            </button>
          ) : (
            <form onSubmit={handleAddGift} style={{ background: 'var(--color-surface-2)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'fadeInUp 0.3s ease both' }}>
              <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text)', margin: 0 }}>Cadangkan hadiah baru:</p>
              
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Nama Hadiah *</label>
                <input className="form-control" placeholder="cth: Air Fryer" value={newItem} onChange={e => setNewItem(e.target.value)} required />
              </div>
              
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Link Kedai (optional)</label>
                  {newLink && newLink.startsWith('http') && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        className="btn btn-link btn-xs"
                        style={{ padding: 0, fontSize: '0.68rem', color: scrapeStatus === 'error' ? '#ef4444' : scrapeStatus === 'success' ? '#10b981' : 'var(--color-primary)', textDecoration: 'none', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={handleFetchImage}
                        disabled={scrapeStatus !== 'idle'}
                      >
                        {scrapeStatus === 'idle' && '🔄 Dapatkan Gambar dari Link'}
                        {scrapeStatus === 'loading' && '⏳ Mendapatkan...'}
                        {scrapeStatus === 'success' && '✅ Successful'}
                        {scrapeStatus === 'error' && '❌ Error (Upload file manually)'}
                      </button>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>|</span>
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.85rem' }}
                        onClick={() => setShowSettings(!showSettings)}
                        title={t.configSearchTooltip}
                      >
                        ⚙️
                      </button>
                    </div>
                  )}
                </div>
                <input className="form-control" placeholder="https://shopee.com.my/product-details..." value={newLink} onChange={e => setNewLink(e.target.value)} />
                {showSettings && newLink && newLink.startsWith('http') && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.15rem' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.65rem', color: 'var(--color-text-muted)', cursor: 'pointer', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={useFallback}
                        onChange={e => setUseFallback(e.target.checked)}
                        style={{ width: '12px', height: '12px', cursor: 'pointer' }}
                      />
                      Carian Awam (Mungkin tidak tepat)
                    </label>
                  </div>
                )}
              </div>

              {/* Price field layout */}
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Harga (RM / optional)</label>
                  {newLink && newLink.startsWith('http') && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        className="btn btn-link btn-xs"
                        style={{ padding: 0, fontSize: '0.68rem', color: scrapePriceStatus === 'error' ? '#ef4444' : scrapePriceStatus === 'success' ? '#10b981' : 'var(--color-primary)', textDecoration: 'none', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={handleFetchPrice}
                        disabled={scrapePriceStatus !== 'idle'}
                      >
                        {scrapePriceStatus === 'idle' && '🔄 Dapatkan Harga dari Link'}
                        {scrapePriceStatus === 'loading' && '⏳ Mendapatkan...'}
                        {scrapePriceStatus === 'success' && '✅ Successful'}
                        {scrapePriceStatus === 'error' && '❌ Error (Key in manually)'}
                      </button>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>|</span>
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.85rem' }}
                        onClick={() => setShowPriceSettings(!showPriceSettings)}
                        title={t.configPriceSearchTooltip}
                      >
                        ⚙️
                      </button>
                    </div>
                  )}
                </div>
                <input className="form-control" placeholder="cth: RM 150.00" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
                {showPriceSettings && newLink && newLink.startsWith('http') && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.15rem' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.65rem', color: 'var(--color-text-muted)', cursor: 'pointer', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={usePriceFallback}
                        onChange={e => setUsePriceFallback(e.target.checked)}
                        style={{ width: '12px', height: '12px', cursor: 'pointer' }}
                      />
                      Carian Awam (Mungkin tidak tepat)
                    </label>
                  </div>
                )}
              </div>

              {/* Directly prompt image file upload */}
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Muat Naik Gambar Hadiah</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--color-surface)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt="Pratinjau Hadiah" style={{ width: 44, height: 44, borderRadius: '6px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: '6px', background: 'var(--color-surface-2)', border: '1px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      🎁
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <label className="btn btn-sm" style={{ cursor: 'pointer', margin: 0, padding: '0.35rem 0.75rem', fontSize: '0.7rem', display: 'inline-flex', background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
                      {uploading ? 'Memuat naik...' : '📁 Pilih Fail Gambar'}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} disabled={uploading} />
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <button type="button" className="btn btn-sm btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowAdd(false)}>Batal</button>
                <button type="submit" className="btn btn-sm btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={adding || uploading}>
                  {adding ? 'Menghantar...' : 'Hantar'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Lightbox / Overlay Fullscreen Photo Viewer */}
      {activeLightboxUrl && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
          }}
          onClick={() => setActiveLightboxUrl(null)}
        >
          <button 
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '1.8rem',
              cursor: 'pointer',
              zIndex: 10000
            }}
            onClick={() => setActiveLightboxUrl(null)}
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={activeLightboxUrl} 
            alt="View" 
            style={{ 
              maxWidth: '90%', 
              maxHeight: '90%', 
              objectFit: 'contain', 
              borderRadius: '8px', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }} 
          />
        </div>
      )}
    </div>
  );
}
