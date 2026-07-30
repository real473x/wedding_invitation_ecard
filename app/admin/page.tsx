'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WeddingConfig, ProgrammeItem, Gift, Contact, RSVP, Wish } from '@/lib/db';
import styles from './admin.module.css';
import { v4 as uuidv4 } from 'uuid';
import { ADMIN_DICT, Lang, formatPackageName, INVITATION_DICT, INVITATION_TEXT_KEYS, getAdminText } from '@/lib/i18n';

const getTabs = (t: Record<string, string>) => [
  { key: 'tema', label: t.tabTema },
  { key: 'latar', label: t.tabLatar },
  { key: 'skrin', label: t.tabSkrin },
  { key: 'teks', label: t.tabTeks },
  { key: 'maklumat', label: t.tabMaklumat },
  { key: 'media', label: t.tabMedia },
  { key: 'aturcara', label: t.tabAturcara },
  { key: 'kenalan', label: t.tabKenalan },
  { key: 'lokasi', label: t.tabLokasi },
  { key: 'kewangan', label: t.tabKewangan },
  { key: 'hadiah', label: t.tabHadiah },
  { key: 'rsvp', label: t.tabRsvp },
  { key: 'akaun', label: t.tabAkaun },
];

const THEMES = [
  { key: 'malay', label: 'Melayu', emoji: '🌙', colors: ['#8B6914', '#1B4332'] },
  { key: 'chinese', label: 'Cina', emoji: '🏮', colors: ['#C0392B', '#D4AF37'] },
  { key: 'indian', label: 'India', emoji: '🪷', colors: ['#E07B00', '#9B1B6E'] },
  { key: 'iban', label: 'Iban', emoji: '🦅', colors: ['#A0320A', '#1A1A1A'] },
  { key: 'kadazan', label: 'Kadazan Dusun', emoji: '🌿', colors: ['#2E6B3E', '#8B6914'] },
  { key: 'kayan', label: 'Kayan', emoji: '🔴', colors: ['#B01020', '#0A0A0A'] },
  { key: 'bidayuh', label: 'Bidayuh', emoji: '🏺', colors: ['#B5541A', '#8B7355'] },
  { key: 'moden', label: 'Moden', emoji: '🖤', colors: ['#1A1A1A', '#D4A0B0'] },
  { key: 'british', label: 'British/American', emoji: '🌹', colors: ['#1B3A6B', '#C08080'] },
  { key: 'orangasli', label: 'Orang Asli', emoji: '🌳', colors: ['#A07020', '#3D2B1F'] },
];

const SECTION_LABELS: Record<string, string> = {
  gate: 'Skrin Selamat Datang (Gate)',
  invitation: 'Jemputan Rasmi',
  parents: 'Ibu Bapa & Jemputan',
  countdown: 'Tarikh & Kiraan Mundur',
  programme: 'Aturcara Majlis',
  gallery: 'Galeri & Ucapan',
  message: 'Mesej Pasangan',
  closing: 'Skrin Penutup',
};

// Curated Unsplash background presets grouped by section type
const THEME_BG_PRESETS: Record<string, { label: string; url: string }[]> = {
  gate: [
    { label: 'Bunga Ros Putih', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Bunga Paras Bokeh', url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5b?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Kelopak Merah Jambu', url: 'https://images.unsplash.com/photo-1559181567-c3190b7c7cdb?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Lantern Emas', url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Kain Sutera Emas', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Senja Mewah', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&auto=format&fit=crop&q=80' },
  ],
  invitation: [
    { label: 'Bunga Spring Putih', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Pelamin Taman', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Meja Perkahwinan', url: 'https://images.unsplash.com/photo-1473673645735-b5c9d1b39f44?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Bunga Mekar Hijau', url: 'https://images.unsplash.com/photo-1444840535719-195841cb6e2b?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Taman Mawar', url: 'https://images.unsplash.com/photo-1455189379566-0ce77c32ab35?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Kain Lace Putih', url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&auto=format&fit=crop&q=80' },
  ],
  parents: [
    { label: 'Hutan Malam', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Rimba Tropika', url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Bukit Berlembah', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Bayang Daun', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Sungai Hutan', url: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Cahaya Hutan', url: 'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=1200&auto=format&fit=crop&q=80' },
  ],
  countdown: [
    { label: 'Langit Biru', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Pantai Matahari', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Fajar Senja', url: 'https://images.unsplash.com/photo-1549477521-e34d82bca08a?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Galaksi Malam', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Bunga Matahari', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Laut Biru', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&auto=format&fit=crop&q=80' },
  ],
  programme: [
    { label: 'Taman Bunga', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Bunga Lavender', url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Hiasan Majlis', url: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Meja Bunga', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Sirih Junjung', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Kain Batik', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80' },
  ],
  gallery: [
    { label: 'Bokeh Cahaya', url: 'https://images.unsplash.com/photo-1514825894082-0e79b8df1e8a?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Latar Putih Bersih', url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Krim Pastel', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Tekstur Marmar', url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Bunga Putih', url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5b?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Hijau Daun', url: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1200&auto=format&fit=crop&q=80' },
  ],
  message: [
    { label: 'Malam Bintang', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Kabut Senja', url: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Cahaya Malam', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Langit Gelap', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Matahari Terbenam', url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Permata Gelap', url: 'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=1200&auto=format&fit=crop&q=80' },
  ],
  closing: [
    { label: 'Lampu Bokeh Emas', url: 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Confetti Warna', url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Pentas Malam', url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Cahaya Lilin', url: 'https://images.unsplash.com/photo-1516972810927-80185027ca84?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Fireworks Malam', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Bintang Malam', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&auto=format&fit=crop&q=80' },
  ],
};

export default function CoupleAdminPage() {
  const router = useRouter();
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [loginId, setLoginId] = useState('');
  const [coupleId, setCoupleId] = useState('');
  const [activeTab, setActiveTab] = useState('tema');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [dirty, setDirty] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState<Lang>('ms');
  const [uploadingQr, setUploadingQr] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme') || 'dark';
    const savedLang = (localStorage.getItem('admin-lang') as Lang) || 'ms';
    setTheme(savedTheme);
    setLang(savedLang);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const [globalTextOverrides, setGlobalTextOverrides] = useState<Record<string, string>>({});

  const fetchGlobalText = useCallback(async () => {
    try {
      const res = await fetch('/api/config/global');
      if (res.ok) {
        const data = await res.json();
        setGlobalTextOverrides(data.globalTextOverrides || {});
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchGlobalText();
  }, [fetchGlobalText]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('admin-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const toggleLang = () => {
    const next: Lang = lang === 'ms' ? 'en' : 'ms';
    setLang(next);
    localStorage.setItem('admin-lang', next);
  };

  const t = getAdminText(lang, globalTextOverrides);
  const TABS = getTabs(t);

  async function handleQrUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingQr(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/couple/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        update({ bankQrUrl: data.url });
      } else {
        alert(data.error || 'Ralat muat naik.');
      }
    } catch {
      alert('Gagal memuat naik gambar.');
    } finally {
      setUploadingQr(false);
      e.target.value = '';
    }
  }

  // Expiration & password force change state
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [packageName, setPackageName] = useState('');
  const [statusMode, setStatusMode] = useState('');

  const fetchConfig = useCallback(async () => {
    const res = await fetch('/api/couple/config');
    if (res.status === 401) { router.push('/admin/login'); return; }
    const data = await res.json();
    setConfig(data.config);
    setLoginId(data.loginId);
    setCoupleId(data.id);
    
    // Save metadata
    setMustChangePassword(data.mustChangePassword);
    setExpiresAt(data.expiresAt);
    setDaysRemaining(data.daysRemaining);
    setPackageName(data.packageName);
    setStatusMode(data.statusMode);
  }, [router]);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  function update(partial: Partial<WeddingConfig>) {
    setConfig(prev => prev ? { ...prev, ...partial } : prev);
    setDirty(true);
  }

  async function save() {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch('/api/couple/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) { setDirty(false); showToast('✅ Tetapan disimpan!'); }
      else showToast('❌ Ralat menyimpan');
    } finally { setSaving(false); }
  }

  async function handleLogout() {
    await fetch('/api/couple/login', { method: 'DELETE' });
    router.push('/admin/login');
  }

  if (!config) {
    return <div className={styles.loadingScreen}><span className={styles.spinner} /><p>Memuatkan...</p></div>;
  }

  const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/${loginId}` : '';

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span>💍</span>
          <div>
            <h1>{config.groomName} &amp; {config.brideName}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '3px' }}>
              <a href={inviteUrl} target="_blank" className={styles.inviteLink}>{inviteUrl} ↗</a>
              {daysRemaining !== null && (
                <span style={{
                  fontSize: '0.68rem',
                  padding: '1px 8px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  background: statusMode === 'off' || (statusMode === 'auto' && daysRemaining <= 0) ? 'rgba(239, 68, 68, 0.18)' : daysRemaining < 7 ? 'rgba(245, 158, 11, 0.18)' : 'rgba(82, 183, 136, 0.18)',
                  color: statusMode === 'off' || (statusMode === 'auto' && daysRemaining <= 0) ? '#fca5a5' : daysRemaining < 7 ? '#fcd34d' : '#52b788',
                  border: `1px solid ${statusMode === 'off' || (statusMode === 'auto' && daysRemaining <= 0) ? 'rgba(239, 68, 68, 0.25)' : daysRemaining < 7 ? 'rgba(245, 158, 11, 0.25)' : 'rgba(82, 183, 136, 0.25)'}`
                }}>
                  {statusMode === 'on' ? '♾️ Aktif Selamanya' : statusMode === 'off' ? '🔒 Dinyahaktifkan' : daysRemaining <= 0 ? '⚠️ Tamat Tempoh' : `⏱️ Baki: ${daysRemaining} Hari`}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>

          <button 
            onClick={toggleTheme} 
            className={`btn btn-sm ${styles.logoutBtn}`}
            style={{ marginRight: '0.25rem' }}
            title="Tukar Tema (Terang / Gelap)"
          >
            {theme === 'dark' ? t.lightMode : t.darkMode}
          </button>
          <a href={inviteUrl} target="_blank" className={`btn btn-sm ${styles.logoutBtn}`} style={{ textDecoration: 'none', marginRight: '0.25rem', color: '#4ade80' }} title="Buka laman jemputan langsung di tab baru (simpan dahulu untuk lihat perubahan)">
            🌐 Laman Langsung ↗
          </a>
          {dirty && <button onClick={save} disabled={saving} className={`btn btn-primary btn-sm ${styles.saveBtn}`}>{saving ? t.saving : `💾 ${t.saveChanges}`}</button>}
          <button onClick={handleLogout} className={`btn btn-sm ${styles.logoutBtn}`}>{t.logout}</button>
        </div>
      </header>

      <div className={styles.body}>
        {/* Sidebar Tabs */}
        <nav className={styles.sidebar}>
          {TABS.map(t => (
            <button key={t.key} className={`${styles.tabBtn} ${activeTab === t.key ? styles.tabActive : ''}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className={styles.main}>
          {/* ── TEMA ── */}
          {activeTab === 'tema' && (
            <Section title={t.themeSection}>
              <div className={styles.themeGrid}>
                {THEMES.map(t => (
                  <button key={t.key} onClick={() => update({ theme: t.key })} className={`${styles.themeCard} ${config.theme === t.key ? styles.themeActive : ''}`}>
                    <div className={styles.themeSwatches}>
                      {t.colors.map(c => <span key={c} style={{ background: c }} />)}
                    </div>
                    <span className={styles.themeEmoji}>{t.emoji}</span>
                    <span className={styles.themeLabel}>{t.label}</span>
                    {config.theme === t.key && <span className={styles.themeCheck}>✓</span>}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {/* ── SKRIN ── */}
          {/* ── LATAR BELAKANG ── */}
          {activeTab === 'latar' && (
            <Section title={t.backgroundSection}>
              <p className={styles.sectionHint}>{lang === 'en' ? 'Choose a background image for each section. Upload a file, enter a URL, or pick from theme presets.' : 'Pilih gambar latar belakang untuk setiap bahagian. Boleh muat naik fail, masukkan URL, atau pilih daripada koleksi tema yang tersedia.'}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--admin-border)', borderRadius: '14px' }}>
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <h4 style={{ color: 'var(--admin-text)', fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>{lang === 'en' ? 'Use 1 Background Image for All Sections' : 'Guna 1 Latar Belakang untuk Semua Skrin'}</h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>{lang === 'en' ? 'Enable this setting to display a single fixed image across all invitation sections (except gate screen).' : 'Aktifkan tetapan ini untuk memaparkan satu imej yang sama yang tidak bergerak (fixed) merentasi semua bahagian jemputan (kecuali skrin pembuka).'}</p>
                  </div>
                  <label className="toggle-switch" style={{ flexShrink: 0 }}>
                    <input type="checkbox" checked={!!config.useUnifiedBackground} onChange={e => update({ useUnifiedBackground: e.target.checked })} />
                    <span className="toggle-slider" />
                  </label>
                </div>

                {config.useUnifiedBackground && (
                  <div style={{ padding: '1.25rem', border: '1px dashed rgba(201,168,76,.3)', borderRadius: '14px', background: 'rgba(201,168,76,.03)' }}>
                    <h4 style={{ color: '#C9A84C', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: 0 }}>🖼️ {lang === 'en' ? 'Unified Background Image' : 'Imej Latar Belakang Unified'}</h4>
                    <BgImageRow
                      label={lang === 'en' ? 'Unified Background Image' : 'Imej Latar Belakang Unified'}
                      sectionKey="invitation"
                      currentUrl={config.unifiedBackgroundUrl || ''}
                      onChange={(url) => update({ unifiedBackgroundUrl: url })}
                    />
                  </div>
                )}

                <div style={{ opacity: config.useUnifiedBackground ? 0.45 : 1, pointerEvents: config.useUnifiedBackground ? 'none' : 'auto', transition: 'all .25s ease' }}>
                  <h4 style={{ color: 'var(--admin-text)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: 0 }}>
                    {lang === 'en' ? 'Individual Screen Backgrounds' : 'Latar Belakang Setiap Skrin Individu'}
                  </h4>
                  {config.useUnifiedBackground && (
                    <p style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 500, margin: '0 0 0.75rem 0' }}>
                      ⚠️ {lang === 'en' ? 'Disabled because Unified Background is active above.' : 'Ditutup kerana tetapan Latar Belakang Unified diaktifkan di atas.'}
                    </p>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {Object.entries(SECTION_LABELS).map(([key, label]) => (
                      <BgImageRow
                        key={key}
                        label={label}
                        sectionKey={key as keyof WeddingConfig['backgrounds']}
                        currentUrl={config.backgrounds?.[key as keyof WeddingConfig['backgrounds']] || ''}
                        onChange={(url) => update({ backgrounds: { ...config.backgrounds, [key]: url } })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Section>
          )}

          {activeTab === 'skrin' && (
            <Section title={t.sectionVisibility}>
              <p className={styles.sectionHint}>{t.sectionVisibilityDesc}</p>
              <div className={styles.toggleList}>
                {Object.entries(config.sections).map(([key, val]) => (
                  <div key={key} className={styles.toggleRow}>
                    <div>
                      <div className={styles.toggleLabel}>{SECTION_LABELS[key] || key}</div>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={val} onChange={e => update({ sections: { ...config.sections, [key]: e.target.checked } })} />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                ))}
              </div>
            </Section>
          )}
          {/* ── TEKS (Text Overrides) ── */}
          {activeTab === 'teks' && (
            <Section title={t.textOverridesSection}>
              <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.82rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>{t.textOverridesDesc}</p>
              {INVITATION_TEXT_KEYS.map(group => {
                const groupLabel = (t as Record<string, string>)[group.group] || group.group;
                return (
                  <div key={group.group} style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: 'var(--admin-text)', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem' }}>{groupLabel}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                      {group.group === 'textGroupGate' && (
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                          <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {lang === 'en' ? 'Date Text (Gate Screen)' : 'Teks Tarikh (Skrin Pembukaan)'}
                            <label className="toggle-switch" style={{ transform: 'scale(0.7)', margin: 0 }}>
                              <input type="checkbox" checked={config.textOverrides?.hasOwnProperty('gateDate')} onChange={e => {
                                const newOverrides = { ...(config.textOverrides || {}) };
                                if (e.target.checked) {
                                  newOverrides.gateDate = '';
                                } else {
                                  delete newOverrides.gateDate;
                                }
                                update({ textOverrides: newOverrides });
                              }} />
                              <span className="toggle-slider" />
                            </label>
                          </label>
                          {config.textOverrides?.hasOwnProperty('gateDate') ? (
                            <input
                              className="form-control"
                              placeholder={lang === 'en' ? "E.g. Saturday, 26 September 2026" : "Cth. Sabtu, 26 September 2026"}
                              value={config.textOverrides.gateDate || ''}
                              onChange={e => {
                                const newOverrides = { ...(config.textOverrides || {}) };
                                newOverrides.gateDate = e.target.value;
                                update({ textOverrides: newOverrides });
                              }}
                              style={{ background: 'var(--admin-input-bg)', borderColor: config.textOverrides.gateDate ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,.08)', color: 'var(--admin-text)', fontSize: '0.85rem' }}
                            />
                          ) : (
                            <div style={{ padding: '0.65rem 0.85rem', background: 'var(--admin-stat-bg)', borderRadius: '10px', color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                              {config.weddingDay}, {config.weddingDate ? new Date(config.weddingDate + 'T00:00:00').toLocaleDateString(lang === 'en' ? 'en-US' : 'ms-MY', { day: 'numeric', month: 'long', year: 'numeric' }) : ''} <span style={{ fontSize: '0.7rem', fontStyle: 'italic', marginLeft: '0.5rem' }}>(Auto)</span>
                            </div>
                          )}
                        </div>
                      )}
                      {group.group === 'textGroupHero' && (
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                          <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {lang === 'en' ? 'Date Text (Hero Screen)' : 'Teks Tarikh (Kad Jemputan)'}
                            <label className="toggle-switch" style={{ transform: 'scale(0.7)', margin: 0 }}>
                              <input type="checkbox" checked={config.textOverrides?.hasOwnProperty('heroDate')} onChange={e => {
                                const newOverrides = { ...(config.textOverrides || {}) };
                                if (e.target.checked) {
                                  newOverrides.heroDate = '';
                                } else {
                                  delete newOverrides.heroDate;
                                }
                                update({ textOverrides: newOverrides });
                              }} />
                              <span className="toggle-slider" />
                            </label>
                          </label>
                          {config.textOverrides?.hasOwnProperty('heroDate') ? (
                            <input
                              className="form-control"
                              placeholder={lang === 'en' ? "E.g. Saturday, 26 September 2026" : "Cth. Sabtu, 26 September 2026"}
                              value={config.textOverrides.heroDate || ''}
                              onChange={e => {
                                const newOverrides = { ...(config.textOverrides || {}) };
                                newOverrides.heroDate = e.target.value;
                                update({ textOverrides: newOverrides });
                              }}
                              style={{ background: 'var(--admin-input-bg)', borderColor: config.textOverrides.heroDate ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,.08)', color: 'var(--admin-text)', fontSize: '0.85rem' }}
                            />
                          ) : (
                            <div style={{ padding: '0.65rem 0.85rem', background: 'var(--admin-stat-bg)', borderRadius: '10px', color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                              {config.weddingDate ? new Date(config.weddingDate + 'T00:00:00').toLocaleDateString(lang === 'en' ? 'en-US' : 'ms-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''} <span style={{ fontSize: '0.7rem', fontStyle: 'italic', marginLeft: '0.5rem' }}>(Auto)</span>
                            </div>
                          )}
                        </div>
                      )}
                      {group.keys.map(key => {
                        const defaultVal = INVITATION_DICT[config.language || 'ms'][key as keyof typeof INVITATION_DICT['ms']] || '';
                        const currentVal = config.textOverrides?.[key] || '';
                        return (
                          <div key={key} className="form-group">
                            <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{key}</label>
                            <input
                              className="form-control"
                              placeholder={String(defaultVal)}
                              value={currentVal}
                              onChange={e => {
                                const val = e.target.value;
                                const newOverrides = { ...(config.textOverrides || {}) };
                                if (val) {
                                  newOverrides[key] = val;
                                } else {
                                  delete newOverrides[key];
                                }
                                update({ textOverrides: newOverrides });
                              }}
                              style={{ background: 'var(--admin-input-bg)', borderColor: currentVal ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,.08)', color: 'var(--admin-text)', fontSize: '0.85rem' }}
                            />
                            {currentVal && (
                              <span style={{ fontSize: '0.65rem', color: '#C9A84C', marginTop: '2px', display: 'block' }}>✎ {lang === 'en' ? 'Custom' : 'Kustom'}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </Section>
          )}

          {/* ── MAKLUMAT ── */}
          {activeTab === 'maklumat' && (
            <Section title={t.weddingDetails}>
              <div className={styles.formGrid}>
                <div style={{ gridColumn: 'span 2', background: 'rgba(201,168,76,0.08)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(201,168,76,0.2)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#C9A84C', fontWeight: 700 }}>🌐 {t.websiteLang}</h4>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>{lang === 'en' ? 'Select default primary language for guest invitation card (Bahasa Melayu / English).' : 'Pilih bahasa utama untuk paparan kad jemputan tetamu (Bahasa Melayu / English).'}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className={`btn btn-sm ${config.language !== 'en' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => update({ language: 'ms' })}
                      style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', fontWeight: 700 }}
                    >
                      🇲🇾 Bahasa Melayu
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${config.language === 'en' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => update({ language: 'en' })}
                      style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', fontWeight: 700 }}
                    >
                      🇬🇧 English
                    </button>
                  </div>
                </div>
                <Field label={lang === 'en' ? 'Groom Name' : 'Nama Pengantin Lelaki'} value={config.groomName} onChange={v => update({ groomName: v })} />
                <Field label={lang === 'en' ? 'Groom Full Name' : 'Nama Penuh Pengantin Lelaki'} value={config.groomFullName} onChange={v => update({ groomFullName: v })} />
                <Field label={lang === 'en' ? 'Bride Name' : 'Nama Pengantin Perempuan'} value={config.brideName} onChange={v => update({ brideName: v })} />
                <Field label={lang === 'en' ? 'Bride Full Name' : 'Nama Penuh Pengantin Perempuan'} value={config.brideFullName} onChange={v => update({ brideFullName: v })} />
                <Field label={lang === 'en' ? 'Groom Father\'s Name' : 'Nama Bapa Pengantin Lelaki'} value={config.groomFatherName} onChange={v => update({ groomFatherName: v })} />
                <Field label={lang === 'en' ? 'Groom Mother\'s Name' : 'Nama Ibu Pengantin Lelaki'} value={config.groomMotherName} onChange={v => update({ groomMotherName: v })} />
                <Field label={lang === 'en' ? 'Bride Father\'s Name' : 'Nama Bapa Pengantin Perempuan'} value={config.brideFatherName} onChange={v => update({ brideFatherName: v })} />
                <Field label={lang === 'en' ? 'Bride Mother\'s Name' : 'Nama Ibu Pengantin Perempuan'} value={config.brideMotherName} onChange={v => update({ brideMotherName: v })} />
                <Field label={lang === 'en' ? 'Wedding Date (YYYY-MM-DD)' : 'Tarikh Perkahwinan (YYYY-MM-DD)'} value={config.weddingDate} onChange={v => update({ weddingDate: v })} type="date" />
                <Field label={lang === 'en' ? 'Wedding Day (e.g. Saturday)' : 'Hari Perkahwinan (cth: Sabtu)'} value={config.weddingDay} onChange={v => update({ weddingDay: v })} />
                <Field label={lang === 'en' ? 'Wedding Time (e.g. 11:00 AM – 10:00 PM)' : 'Masa Majlis (cth: 11:00 AM – 10:00 PM)'} value={config.weddingTime} onChange={v => update({ weddingTime: v })} />
                <Field label={lang === 'en' ? 'Reception Time (e.g. 11:00 AM)' : 'Masa Penerimaan (cth: 11:00 AM)'} value={config.receptionTime} onChange={v => update({ receptionTime: v })} />
                <Field label={lang === 'en' ? 'Venue / Hall Name' : 'Nama Tempat / Dewan'} value={config.venue} onChange={v => update({ venue: v })} />
                <Field label={lang === 'en' ? 'Full Address' : 'Alamat Lengkap'} value={config.venueAddress} onChange={v => update({ venueAddress: v })} />
                <Field label={lang === 'en' ? 'Quote / Verse' : 'Petikan / Ayat (Quote)'} value={config.quote} onChange={v => update({ quote: v })} textarea />
                <Field label={lang === 'en' ? 'Quote Source' : 'Sumber Petikan'} value={config.quoteSource} onChange={v => update({ quoteSource: v })} />
                <Field label={lang === 'en' ? 'Couple Message Title' : 'Tajuk Mesej Pasangan'} value={config.coupleMessageTitle} onChange={v => update({ coupleMessageTitle: v })} />
                <Field label={lang === 'en' ? 'Couple Message' : 'Mesej Pasangan'} value={config.coupleMessage} onChange={v => update({ coupleMessage: v })} textarea />
                <Field label={lang === 'en' ? 'Closing Screen Title' : 'Tajuk Skrin Penutup'} value={config.closingTitle} onChange={v => update({ closingTitle: v })} />
                <Field label={lang === 'en' ? 'Closing Text' : 'Teks Penutup'} value={config.closingText} onChange={v => update({ closingText: v })} textarea />
                
                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
                  <label className="checkbox-container" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}>
                    <input
                      type="checkbox"
                      checked={config.showClosingPhoto !== false}
                      onChange={e => update({ showClosingPhoto: e.target.checked })}
                    />
                    <span style={{ fontSize: '0.85rem', color: 'var(--admin-text)', fontWeight: 600 }}>{lang === 'en' ? 'Display Couple Photo on Closing Screen' : 'Tampilkan Gambar Pasangan di Skrin Penutup'}</span>
                  </label>
                  
                  {config.showClosingPhoto !== false && (
                    <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '10px', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '0.25rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{lang === 'en' ? 'Couple Photo' : 'Gambar Pasangan'}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                          {config.closingPhotoUrl ? `✓ ${lang === 'en' ? 'File' : 'Fail'}: ${config.closingPhotoUrl.split('/').pop()}` : (lang === 'en' ? 'Using Default Placeholder' : 'Menggunakan Placeholder Lalai')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                        {config.closingPhotoUrl && (
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }}
                            onClick={() => update({ closingPhotoUrl: '' })}
                          >
                            ✕ {lang === 'en' ? 'Default' : 'Lalai'}
                          </button>
                        )}
                        <label className="btn btn-sm btn-primary" style={{ cursor: 'pointer', margin: 0, padding: '0.3rem 0.6rem', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center' }}>
                          📁 {lang === 'en' ? 'Upload Image' : 'Muat Naik Gambar'}
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append('file', file);
                              try {
                                const res = await fetch('/api/couple/upload', { method: 'POST', body: formData });
                                const data = await res.json();
                                if (res.ok && data.url) {
                                  update({ closingPhotoUrl: data.url });
                                } else {
                                  alert(data.error || (lang === 'en' ? 'Upload error.' : 'Ralat muat naik.'));
                                }
                              } catch {
                                alert(lang === 'en' ? 'Failed to upload image.' : 'Gagal memuat naik gambar.');
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Section>
          )}

          {/* ── MEDIA ── */}
          {activeTab === 'media' && (
            <Section title={t.mediaSection}>
              <Field label={lang === 'en' ? 'YouTube Video URL (Background Music)' : 'URL Video YouTube (untuk muzik/lagu)'} value={config.youtubeUrl} onChange={v => update({ youtubeUrl: v })} placeholder="https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1&loop=1..." />
              <p className={styles.hint}>{lang === 'en' ? '💡 Go to YouTube → Share → Embed → Copy URL.' : '💡 Pergi ke YouTube → Kongsi → Benam → Salin URL. Tambah '}<code>?autoplay=1&mute=1&loop=1&playlist=VIDEO_ID</code></p>
              <div className={styles.divider} />
              <h4 className={styles.subheading}>{lang === 'en' ? 'Gallery Photos (URLs)' : 'Foto Galeri (URL)'}</h4>
              <p className={styles.hint}>{lang === 'en' ? 'Enter photo URLs (Google Drive, Imgur, etc). One URL per line.' : 'Masukkan URL gambar (Google Drive, Imgur, dll). Satu URL setiap baris.'}</p>
              <PhotoUrlManager photos={config.photos} onChange={photos => update({ photos })} />
            </Section>
          )}

          {/* ── ATURCARA ── */}
          {activeTab === 'aturcara' && (
            <Section title={t.programmeSection}>
              <ProgrammeManager items={config.programme} onChange={p => update({ programme: p })} />
            </Section>
          )}

          {/* ── KENALAN ── */}
          {activeTab === 'kenalan' && (
            <Section title={t.contactSection}>
              <ContactManager contacts={config.contacts} onChange={c => update({ contacts: c })} />
            </Section>
          )}

          {/* ── LOKASI ── */}
          {activeTab === 'lokasi' && (
            <Section title={t.locationSection}>
              <div className={styles.toggleRow} style={{ marginBottom: '1.5rem' }}>
                <div><div className={styles.toggleLabel}>{lang === 'en' ? 'Display Map' : 'Paparkan Peta'}</div></div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={config.showMap} onChange={e => update({ showMap: e.target.checked })} />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className={styles.formGrid}>
                <Field label={lang === 'en' ? 'Google Maps Embed URL' : 'URL Benam Google Maps'} value={config.mapEmbedUrl} onChange={v => update({ mapEmbedUrl: v })} placeholder="https://maps.google.com/maps?q=...&output=embed" />
                <Field label={lang === 'en' ? 'Waze Link' : 'Link Waze'} value={config.wazeLink} onChange={v => update({ wazeLink: v })} placeholder="https://waze.com/ul?q=..." />
                <Field label={lang === 'en' ? 'Google Maps Link' : 'Link Google Maps'} value={config.googleMapsLink} onChange={v => update({ googleMapsLink: v })} placeholder="https://maps.google.com/?q=..." />
              </div>
            </Section>
          )}

          {/* ── KEWANGAN ── */}
          {activeTab === 'kewangan' && (
            <Section title={t.moneySection}>
              <div className={styles.formGrid}>
                <Field label={lang === 'en' ? 'Bank Name' : 'Nama Bank'} value={config.bankName} onChange={v => update({ bankName: v })} />
                <Field label={lang === 'en' ? 'Account Holder Name' : 'Nama Pemilik Akaun'} value={config.bankAccountName} onChange={v => update({ bankAccountName: v })} />
                <Field label={lang === 'en' ? 'Account Number' : 'Nombor Akaun'} value={config.bankAccountNo} onChange={v => update({ bankAccountNo: v })} />
                
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label>{lang === 'en' ? 'Banking QR Code (URL or Upload)' : 'Kod QR Perbankan (URL atau Muat Naik)'}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={config.bankQrUrl || ''}
                    onChange={e => update({ bankQrUrl: e.target.value })}
                    placeholder="https://..."
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.15)', padding: '0.65rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                    {config.bankQrUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={config.bankQrUrl} alt="QR Code" style={{ width: 44, height: 44, borderRadius: '6px', objectFit: 'contain', border: '1px solid rgba(255,255,255,0.1)' }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: '6px', background: 'var(--admin-input-bg)', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        📷
                      </div>
                    )}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label className="btn btn-sm" style={{ cursor: 'pointer', margin: 0, padding: '0.35rem 0.75rem', fontSize: '0.7rem', display: 'inline-flex', background: 'var(--color-primary)', color: 'var(--admin-text)', border: 'none' }}>
                        {uploadingQr ? 'Memuat naik...' : '📁 Pilih Fail Gambar'}
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleQrUpload} disabled={uploadingQr} />
                      </label>
                      {config.bankQrUrl && (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem' }}
                          onClick={() => update({ bankQrUrl: '' })}
                        >
                          Nyahaktif Gambar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          )}

          {/* ── HADIAH ── */}
          {activeTab === 'hadiah' && (
            <Section title="🎁 Senarai Hadiah">
              <GiftManager gifts={config.gifts} onChange={g => update({ gifts: g })} />
            </Section>
          )}

          {/* ── AKAUN ── */}
          {activeTab === 'akaun' && (
            <Section title="⚙️ Maklumat Akaun & Langganan">
              <CoupleAccountTab
                packageName={packageName}
                expiresAt={expiresAt}
                daysRemaining={daysRemaining}
                statusMode={statusMode}
              />
            </Section>
          )}

          <div className={styles.saveBar}>
            {activeTab !== 'akaun' && (
              <button onClick={save} disabled={saving || !dirty} className="btn btn-primary">
                {saving ? 'Menyimpan...' : dirty ? '💾 Simpan Perubahan' : '✓ Tersimpan'}
              </button>
            )}
          </div>
        </main>
      </div>

      {/* Mandatory password change popup */}
      {mustChangePassword && (
        <div className="popup-overlay" style={{ zIndex: 10000, background: 'rgba(15, 17, 23, 0.94)' }}>
          <div style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,.12)', borderRadius: '20px', width: '100%', maxWidth: '440px', padding: '2rem', boxShadow: '0 24px 64px rgba(0,0,0,.6)', margin: '1rem', textAlign: 'left' }}>
            <h3 style={{ color: '#C9A84C', fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 800 }}>🔐 Wajib Tukar Kata Laluan Semasa</h3>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Bagi menjamin keselamatan laman web anda, sila tukar kata laluan sementara yang diberikan oleh pentadbir sebelum memulakan tetapan.
            </p>
            <CouplePasswordChangeForm
              onSuccess={() => {
                setMustChangePassword(false);
                showToast('✅ Kata laluan anda berjaya ditukar! Anda boleh mula membuat tetapan.');
                fetchConfig();
              }}
            />
          </div>
        </div>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}

function CoupleAccountTab({ packageName, expiresAt, daysRemaining, statusMode }: {
  packageName: string; expiresAt: string; daysRemaining: number | null; statusMode: string;
}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Kata laluan baru dan pengesahan kata laluan tidak sepadan.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/couple/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Ralat berlaku.'); return; }
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setError('Ralat sambungan. Cuba semula.');
    } finally {
      setLoading(false);
    }
  }

  // Calculate status mode class/text
  const isExpired = statusMode === 'off' || (statusMode === 'auto' && daysRemaining !== null && daysRemaining <= 0);
  const statusText = statusMode === 'on' ? '♾️ Aktif Selamanya' : statusMode === 'off' ? '🔒 Dinyahaktifkan' : isExpired ? '⚠️ Tamat Tempoh' : '🟢 Aktif';

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--admin-border)', borderRadius: '14px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pakej Langganan</span>
          <strong style={{ fontSize: '1.15rem', color: '#C9A84C', display: 'block', marginTop: '0.25rem' }}>{packageName || '30 Hari'}</strong>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--admin-border)', borderRadius: '14px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tarikh Tamat Tempoh</span>
          <strong style={{ fontSize: '1.1rem', color: 'var(--admin-text)', display: 'block', marginTop: '0.25rem' }}>
            {expiresAt ? new Date(expiresAt).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
          </strong>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--admin-border)', borderRadius: '14px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status Laman Web</span>
          <strong style={{ fontSize: '1.1rem', color: isExpired ? '#ef4444' : '#4ade80', display: 'block', marginTop: '0.25rem' }}>
            {statusText} {statusMode === 'auto' && daysRemaining !== null && daysRemaining > 0 && `(${daysRemaining} hari baki)`}
          </strong>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--admin-border)', borderRadius: '16px', padding: '1.5rem', maxWidth: '480px', margin: '0 auto 0 0', textAlign: 'left' }}>
        <h3 style={{ fontSize: '0.95rem', color: 'var(--admin-text)', marginBottom: '1.25rem', fontWeight: 700 }}>🔐 Tukar Kata Laluan Panel</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label style={{ color: 'var(--admin-text-muted)' }}>Kata Laluan Semasa *</label>
            <input type="password" className="form-control" style={{ background: 'var(--admin-input-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label style={{ color: 'var(--admin-text-muted)' }}>Kata Laluan Baru *</label>
            <input type="password" className="form-control" style={{ background: 'var(--admin-input-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }} value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label style={{ color: 'var(--admin-text-muted)' }}>Sahkan Kata Laluan Baru *</label>
            <input type="password" className="form-control" style={{ background: 'var(--admin-input-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>

          {error && <div style={{ color: '#e87c6f', fontSize: '0.85rem', background: 'rgba(192,57,43,.1)', padding: '0.65rem 0.9rem', borderRadius: '8px' }}>{error}</div>}
          {success && <div style={{ color: '#4ade80', fontSize: '0.85rem', background: 'rgba(46,107,62,.15)', padding: '0.65rem 0.9rem', borderRadius: '8px' }}>✅ Kata laluan berjaya ditukar!</div>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Mengemaskini...' : '✓ Tukar Kata Laluan'}
          </button>
        </form>
      </div>
    </div>
  );
}

function CouplePasswordChangeForm({ onSuccess }: { onSuccess: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Kata laluan baru dan pengesahan kata laluan tidak sepadan.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/couple/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Ralat berlaku.'); return; }
      onSuccess();
    } catch {
      setError('Ralat sambungan. Cuba semula.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="form-group">
        <label style={{ color: 'var(--admin-text-muted)' }}>Kata Laluan Sementara *</label>
        <input type="password" className="form-control" style={{ background: 'var(--admin-input-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
      </div>
      <div className="form-group">
        <label style={{ color: 'var(--admin-text-muted)' }}>Kata Laluan Baru *</label>
        <input type="password" className="form-control" style={{ background: 'var(--admin-input-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }} value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
      </div>
      <div className="form-group">
        <label style={{ color: 'var(--admin-text-muted)' }}>Sahkan Kata Laluan Baru *</label>
        <input type="password" className="form-control" style={{ background: 'var(--admin-input-bg)', borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
      </div>

      {error && <div style={{ color: '#e87c6f', fontSize: '0.85rem', background: 'rgba(192,57,43,.1)', padding: '0.65rem 0.9rem', borderRadius: '8px' }}>{error}</div>}

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
        {loading ? 'Menukar...' : '✓ Tukar & Mula Setup'}
      </button>
    </form>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type, textarea, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; textarea?: boolean; placeholder?: string;
}) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {textarea
        ? <textarea className="form-control" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        : <input type={type || 'text'} className="form-control" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      }
    </div>
  );
}

function PhotoUrlManager({ photos, onChange }: { photos: string[]; onChange: (p: string[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const [rawText, setRawText] = useState(photos.join('\n'));

  // Sync raw text when photos change externally
  useEffect(() => {
    setRawText(photos.join('\n'));
  }, [photos]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/couple/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          uploadedUrls.push(data.url);
        } else {
          alert(data.error || `Ralat muat naik ${file.name}`);
        }
      } catch {
        alert(`Gagal memuat naik gambar: ${file.name}`);
      }
    }
    if (uploadedUrls.length > 0) {
      onChange([...photos, ...uploadedUrls]);
    }
    setUploading(false);
    // Reset file input
    e.target.value = '';
  }

  function handleRawChange(val: string) {
    setRawText(val);
    onChange(val.split('\n').map(s => s.trim()).filter(Boolean));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Photo previews grid */}
      {photos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.75rem' }}>
          {photos.map((url, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--admin-stat-bg)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Galeri ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                type="button" 
                onClick={() => onChange(photos.filter((_, idx) => idx !== i))}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(239, 68, 68, 0.85)',
                  color: 'var(--admin-text)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  lineHeight: '18px',
                  padding: 0
                }}
                title="Padam Gambar"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button wrapper */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <label className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          📁 Muat Naik Gambar Galeri
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            disabled={uploading} 
          />
        </label>
        {uploading && <span style={{ fontSize: '0.85rem', color: '#4ade80' }}>⏳ Memuat naik...</span>}
      </div>

      {/* Raw URLs input */}
      <div className="form-group" style={{ marginTop: '0.5rem' }}>
        <label style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Atau masukkan pautan URL gambar secara manual (satu pautan setiap baris):</label>
        <textarea 
          className="form-control" 
          rows={4} 
          value={rawText}
          onChange={e => handleRawChange(e.target.value)}
          placeholder={"https://i.imgur.com/photo1.jpg\nhttps://i.imgur.com/photo2.jpg"} 
        />
      </div>
    </div>
  );
}

function ProgrammeManager({ items, onChange }: { items: ProgrammeItem[]; onChange: (p: ProgrammeItem[]) => void }) {
  function add() { onChange([...items, { time: '', event: '' }]); }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }
  function upd(i: number, field: keyof ProgrammeItem, val: string) {
    onChange(items.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  }
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className={styles.listRow}>
          <input className="form-control" style={{ width: '130px', flexShrink: 0 }} placeholder="11:00 AM" value={item.time} onChange={e => upd(i, 'time', e.target.value)} />
          <input className="form-control" style={{ flex: 1 }} placeholder="Perkara berlaku..." value={item.event} onChange={e => upd(i, 'event', e.target.value)} />
          <button className="btn btn-danger btn-sm btn-icon" onClick={() => remove(i)}>✕</button>
        </div>
      ))}
      <button className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem' }} onClick={add}>＋ Tambah Aturcara</button>
    </div>
  );
}

function ContactManager({ contacts, onChange }: { contacts: Contact[]; onChange: (c: Contact[]) => void }) {
  function add() { onChange([...contacts, { name: '', phone: '' }]); }
  function remove(i: number) { onChange(contacts.filter((_, idx) => idx !== i)); }
  function upd(i: number, field: keyof Contact, val: string) {
    onChange(contacts.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  }
  return (
    <div>
      {contacts.map((c, i) => (
        <div key={i} className={styles.listRow}>
          <input className="form-control" style={{ flex: 1 }} placeholder="Nama (cth: Adam)" value={c.name} onChange={e => upd(i, 'name', e.target.value)} />
          <input className="form-control" style={{ width: '170px', flexShrink: 0 }} placeholder="No. Telefon" value={c.phone} onChange={e => upd(i, 'phone', e.target.value)} />
          <button className="btn btn-danger btn-sm btn-icon" onClick={() => remove(i)}>✕</button>
        </div>
      ))}
      <button className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem' }} onClick={add}>＋ Tambah Kenalan</button>
    </div>
  );
}

function GiftManager({ gifts, onChange }: { gifts: Gift[]; onChange: (g: Gift[]) => void }) {
  function add() { onChange([...gifts, { id: uuidv4(), item: '', link: '', imageUrl: '' }]); }
  function remove(id: string) { onChange(gifts.filter(g => g.id !== id)); }
  function upd(id: string, field: keyof Gift, val: string) {
    onChange(gifts.map(g => g.id === id ? { ...g, [field]: val } : g));
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {gifts.map((g, idx) => (
        <GiftItemCard
          key={g.id}
          gift={g}
          index={idx}
          onUpdate={(field, val) => upd(g.id, field, val)}
          onRemove={() => remove(g.id)}
        />
      ))}
      <button className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }} onClick={add}>＋ Tambah Hadiah Baru</button>
    </div>
  );
}

function GiftItemCard({ gift, index, onUpdate, onRemove }: {
  gift: Gift;
  index: number;
  onUpdate: (field: keyof Gift, val: string) => void;
  onRemove: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [useFallback, setUseFallback] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const [scrapePriceStatus, setScrapePriceStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [usePriceFallback, setUsePriceFallback] = useState(true);
  const [showPriceSettings, setShowPriceSettings] = useState(false);

  async function handleFetchImage() {
    if (!gift.link) return;
    setScrapeStatus('loading');
    try {
      const res = await fetch(`/api/scrape-link?url=${encodeURIComponent(gift.link)}`);
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        onUpdate('imageUrl', data.imageUrl);
        setScrapeStatus('success');
        setTimeout(() => setScrapeStatus('idle'), 4000);
      } else {
        if (useFallback) {
          // Fallback: Ask user if they want to search publicly
          const query = gift.item || 'Hadiah';
          const proceed = window.confirm(
            `Error Getting Image, Proceed to public search result for "${query}"?\n\n⚠️ May display inaccurate product image.`
          );
          if (!proceed) {
            setScrapeStatus('error');
            setTimeout(() => setScrapeStatus('idle'), 6000);
            return;
          }
          
          // Search public web
          setScrapeStatus('loading');
          const searchRes = await fetch(`/api/search-image?q=${encodeURIComponent(query)}`);
          const searchData = await searchRes.json();
          if (searchRes.ok && searchData.imageUrl) {
            onUpdate('imageUrl', searchData.imageUrl);
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
    if (!gift.link) return;
    setScrapePriceStatus('loading');
    try {
      const res = await fetch(`/api/scrape-price?url=${encodeURIComponent(gift.link)}`);
      const data = await res.json();
      if (res.ok && data.price) {
        onUpdate('price', data.price);
        setScrapePriceStatus('success');
        setTimeout(() => setScrapePriceStatus('idle'), 4000);
      } else {
        if (usePriceFallback) {
          // Fallback: Ask user if they want to search publicly
          const query = gift.item || 'Hadiah';
          const proceed = window.confirm(
            `Error Getting Price, Proceed to public search result for "${query}"?\n\n⚠️ May display inaccurate product price.`
          );
          if (!proceed) {
            setScrapePriceStatus('error');
            setTimeout(() => setScrapePriceStatus('idle'), 6000);
            return;
          }
          
          // Search public web
          setScrapePriceStatus('loading');
          const searchRes = await fetch(`/api/search-price?q=${encodeURIComponent(query)}`);
          const searchData = await searchRes.json();
          if (searchRes.ok && searchData.price) {
            onUpdate('price', searchData.price);
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
        onUpdate('imageUrl', data.url);
      } else {
        alert(data.error || 'Ralat muat naik.');
      }
    } catch {
      alert('Gagal memuat naik gambar.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--admin-border)',
      borderRadius: '12px',
      padding: '1rem',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h5 style={{ margin: 0, color: '#C9A84C', fontSize: '0.85rem', fontWeight: 700 }}>Hadiah #{index + 1}</h5>
        <button type="button" className="btn btn-sm btn-danger" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }} onClick={onRemove}>✕ Padam</button>
      </div>

      {/* Name input (Full Width) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <label style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>Nama Hadiah *</label>
        <input
          className="form-control"
          placeholder="cth: Khind Air Fryer"
          value={gift.item}
          onChange={e => onUpdate('item', e.target.value)}
          required
        />
      </div>

      {/* Link and Price inputs side-by-side on the row below */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
        {/* Link input with gear settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>Link Kedai (Pilihan)</label>
            {gift.link && gift.link.startsWith('http') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  type="button"
                  className="btn btn-link btn-xs"
                  style={{
                    padding: 0,
                    fontSize: '0.68rem',
                    color: scrapeStatus === 'error' ? '#ef4444' : scrapeStatus === 'success' ? '#10b981' : '#C9A84C',
                    textDecoration: 'none',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontWeight: scrapeStatus !== 'idle' ? 'bold' : 'normal'
                  }}
                  onClick={handleFetchImage}
                  disabled={scrapeStatus !== 'idle'}
                >
                  {scrapeStatus === 'idle' && '🔄 Dapatkan Gambar'}
                  {scrapeStatus === 'loading' && '⏳...'}
                  {scrapeStatus === 'success' && '✅'}
                  {scrapeStatus === 'error' && '❌'}
                </button>
                <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>|</span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.85rem' }}
                  onClick={() => setShowSettings(!showSettings)}
                  title="Konfigurasi Carian Gambar"
                >
                  ⚙️
                </button>
              </div>
            )}
          </div>
          <input
            className="form-control"
            placeholder="https://shopee.com.my/..."
            value={gift.link || ''}
            onChange={e => onUpdate('link', e.target.value)}
          />
          {showSettings && gift.link && gift.link.startsWith('http') && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.15rem' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.65rem', color: 'var(--admin-text-muted)', cursor: 'pointer', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={useFallback}
                  onChange={e => setUseFallback(e.target.checked)}
                  style={{ width: '12px', height: '12px', cursor: 'pointer' }}
                />
                Carian Awam
              </label>
            </div>
          )}
        </div>

        {/* Price input with gear settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>Harga (RM / Pilihan)</label>
            {gift.link && gift.link.startsWith('http') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  type="button"
                  className="btn btn-link btn-xs"
                  style={{
                    padding: 0,
                    fontSize: '0.68rem',
                    color: scrapePriceStatus === 'error' ? '#ef4444' : scrapePriceStatus === 'success' ? '#10b981' : '#C9A84C',
                    textDecoration: 'none',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontWeight: scrapePriceStatus !== 'idle' ? 'bold' : 'normal'
                  }}
                  onClick={handleFetchPrice}
                  disabled={scrapePriceStatus !== 'idle'}
                >
                  {scrapePriceStatus === 'idle' && '🔄 Harga'}
                  {scrapePriceStatus === 'loading' && '⏳...'}
                  {scrapePriceStatus === 'success' && '✅'}
                  {scrapePriceStatus === 'error' && '❌'}
                </button>
                <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>|</span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.85rem' }}
                  onClick={() => setShowPriceSettings(!showPriceSettings)}
                  title="Konfigurasi Carian Harga"
                >
                  ⚙️
                </button>
              </div>
            )}
          </div>
          <input
            className="form-control"
            placeholder="cth: RM 150.00"
            value={gift.price || ''}
            onChange={e => onUpdate('price', e.target.value)}
          />
          {showPriceSettings && gift.link && gift.link.startsWith('http') && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.15rem' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.65rem', color: 'var(--admin-text-muted)', cursor: 'pointer', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={usePriceFallback}
                  onChange={e => setUsePriceFallback(e.target.checked)}
                  style={{ width: '12px', height: '12px', cursor: 'pointer' }}
                />
                Carian Awam
              </label>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.15)', padding: '0.65rem', borderRadius: '8px' }}>
        {gift.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={gift.imageUrl} alt={gift.item || 'Hadiah'} style={{ width: 44, height: 44, borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
        ) : (
          <div style={{ width: 44, height: 44, borderRadius: '6px', background: 'var(--admin-input-bg)', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
            🎁
          </div>
        )}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label className="btn btn-sm" style={{ cursor: 'pointer', margin: 0, padding: '0.35rem 0.75rem', fontSize: '0.7rem', display: 'inline-flex', background: 'var(--color-primary)', color: 'var(--admin-text)', border: 'none' }}>
            {uploading ? 'Memuat naik...' : '📁 Pilih Fail Gambar'}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} disabled={uploading} />
          </label>
          {gift.imageUrl && (
            <button
              type="button"
              className="btn btn-sm btn-danger"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem' }}
              onClick={() => onUpdate('imageUrl', '')}
            >
              Nyahaktif Gambar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RsvpViewer({ rsvps, wishes, coupleId, onRefresh }: { rsvps: RSVP[]; wishes: Wish[]; coupleId: string; onRefresh: () => void }) {
  const [tab, setTab] = useState<'rsvp' | 'wish'>('rsvp');
  const yes = rsvps.filter(r => r.attending === 'yes');
  const no = rsvps.filter(r => r.attending === 'no');
  const totalPax = yes.reduce((s, r) => s + r.paxCount, 0);

  return (
    <div>
      <div className={styles.rsvpStats}>
        <div className={styles.rsvpStat}><span>{rsvps.length}</span><label>Jumlah RSVP</label></div>
        <div className={styles.rsvpStat}><span style={{ color: '#4ade80' }}>{yes.length}</span><label>Hadir</label></div>
        <div className={styles.rsvpStat}><span style={{ color: '#f87171' }}>{no.length}</span><label>Tidak Hadir</label></div>
        <div className={styles.rsvpStat}><span style={{ color: '#C9A84C' }}>{totalPax}</span><label>Jangkaan Tetamu</label></div>
        <div className={styles.rsvpStat}><span>{wishes.length}</span><label>Ucapan</label></div>
      </div>
      <div className={styles.rsvpTabs}>
        <button className={`${styles.rsvpTab} ${tab === 'rsvp' ? styles.rsvpTabActive : ''}`} onClick={() => setTab('rsvp')}>RSVP ({rsvps.length})</button>
        <button className={`${styles.rsvpTab} ${tab === 'wish' ? styles.rsvpTabActive : ''}`} onClick={() => setTab('wish')}>Ucapan ({wishes.length})</button>
        <button className={`btn btn-sm ${styles.refreshBtn}`} onClick={onRefresh}>🔄 Muat Semula</button>
      </div>
      {tab === 'rsvp' && (
        <div className={styles.rsvpList}>
          {rsvps.length === 0 ? <p className={styles.hint}>Tiada RSVP lagi.</p> : rsvps.map(r => (
            <div key={r.id} className={styles.rsvpCard}>
              <div className={styles.rsvpCardTop}>
                <strong>{r.name}</strong>
                <span className={r.attending === 'yes' ? styles.attendYes : styles.attendNo}>{r.attending === 'yes' ? '✓ Hadir' : '✗ Tidak Hadir'}</span>
              </div>
              <div className={styles.rsvpCardMeta}>
                {r.phone && <span>📞 {r.phone}</span>}
                {r.attending === 'yes' && <span>👥 {r.paxCount} orang</span>}
                <span>🕐 {new Date(r.createdAt).toLocaleDateString('ms-MY')}</span>
              </div>
              {r.wishes && <p className={styles.rsvpWish}>"{r.wishes}"</p>}
            </div>
          ))}
        </div>
      )}
      {tab === 'wish' && (
        <div className={styles.rsvpList}>
          {wishes.length === 0 ? <p className={styles.hint}>Tiada ucapan lagi.</p> : wishes.map(w => (
            <div key={w.id} className={styles.rsvpCard}>
              <strong>{w.name}</strong>
              <p className={styles.rsvpWish}>"{w.message}"</p>
              <span className={styles.rsvpDate}>{new Date(w.createdAt).toLocaleDateString('ms-MY')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BgImageRow({ label, sectionKey, currentUrl, onChange }: {
  label: string;
  sectionKey: keyof WeddingConfig['backgrounds'];
  currentUrl: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<'upload' | 'url' | 'preset'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [expanded, setExpanded] = useState(false);
  const presets = THEME_BG_PRESETS[sectionKey] || THEME_BG_PRESETS['gate'];

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/couple/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) { onChange(data.url); setExpanded(false); }
      else alert(data.error || 'Ralat memuat naik.');
    } catch { alert('Gagal memuat naik fail.'); }
    finally { setUploading(false); }
  }

  function applyUrl() {
    const u = urlInput.trim();
    if (!u) return;
    onChange(u);
    setUrlInput('');
    setExpanded(false);
  }

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    background: active ? 'rgba(201,168,76,.18)' : 'transparent',
    border: `1px solid ${active ? '#C9A84C' : 'rgba(255,255,255,.12)'}`,
    color: active ? '#C9A84C' : '#94a3b8',
    borderRadius: '6px',
    padding: '0.25rem 0.65rem',
    fontSize: '0.72rem',
    cursor: 'pointer',
    transition: 'all .2s',
    fontFamily: 'inherit',
  });

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--admin-border)', borderRadius: '14px', overflow: 'hidden' }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.85rem 1rem' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {currentUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentUrl} alt={label} style={{ width: 36, height: 36, borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }} />
          )}
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--admin-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUrl ? `✓ Latar ditetapkan` : 'Menggunakan Lalai Tema'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {currentUrl && (
            <button type="button" className="btn btn-sm btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }} onClick={() => { onChange(''); setExpanded(false); }} title="Pulihkan ke lalai tema">✕ Lalai</button>
          )}
          <button type="button" style={{ background: expanded ? 'rgba(201,168,76,.18)' : 'rgba(255,255,255,.06)', border: `1px solid ${expanded ? '#C9A84C' : 'rgba(255,255,255,.12)'}`, color: expanded ? '#C9A84C' : '#cbd5e1', borderRadius: '8px', padding: '0.3rem 0.7rem', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit' }} onClick={() => setExpanded(v => !v)}>
            {expanded ? '▲ Tutup' : '🖼️ Tukar'}
          </button>
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '1rem' }}>
          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.85rem' }}>
            <button style={tabBtnStyle(tab === 'upload')} onClick={() => setTab('upload')}>📁 Muat Naik</button>
            <button style={tabBtnStyle(tab === 'url')} onClick={() => setTab('url')}>🔗 URL</button>
            <button style={tabBtnStyle(tab === 'preset')} onClick={() => setTab('preset')}>✨ Koleksi Tema</button>
          </div>

          {/* Upload tab */}
          {tab === 'upload' && (
            <label className="btn btn-primary" style={{ cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', fontSize: '0.82rem' }}>
              {uploading ? '⏳ Memuat naik...' : '📁 Pilih Fail Gambar'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} disabled={uploading} />
            </label>
          )}

          {/* URL tab */}
          {tab === 'url' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className="form-control"
                style={{ flex: 1, background: 'rgba(255,255,255,.07)', borderColor: 'rgba(255,255,255,.15)', color: 'var(--admin-text)' }}
                placeholder="https://images.unsplash.com/..."
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') applyUrl(); }}
              />
              <button className="btn btn-primary" onClick={applyUrl} style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', flexShrink: 0 }}>Guna ↵</button>
            </div>
          )}

          {/* Presets tab */}
          {tab === 'preset' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
              {presets.map(p => (
                <button
                  key={p.url}
                  onClick={() => { onChange(p.url); setExpanded(false); }}
                  style={{ background: 'none', border: `2px solid ${currentUrl === p.url ? '#C9A84C' : 'transparent'}`, borderRadius: '10px', padding: '2px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                  title={p.label}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.label} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '8px', display: 'block' }} loading="lazy" />
                  <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: 'var(--admin-text)', fontSize: '0.6rem', padding: '0.2rem 0.4rem', borderRadius: '0 0 8px 8px', textAlign: 'center' }}>{p.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
