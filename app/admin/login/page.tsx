'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_DICT, Lang } from '@/lib/i18n';
import styles from './login.module.css';

export default function CoupleAdminLogin() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState<Lang>('ms');
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme') || 'dark';
    const savedLang = (localStorage.getItem('admin-lang') as Lang) || 'ms';
    setTheme(savedTheme);
    setLang(savedLang);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

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

  const t = ADMIN_DICT[lang];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/couple/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push('/admin');
    } catch { setError('Ralat sambungan. Cuba semula.'); }
    finally { setLoading(false); }
  }

  return (
    <div className={styles.page}>
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.5rem', zIndex: 1000 }}>
        <button 
          onClick={toggleLang}
          style={{
            background: 'rgba(128,128,128,0.15)',
            border: '1px solid var(--admin-border)',
            color: 'var(--admin-text)',
            borderRadius: '50px',
            padding: '0.35rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title="Tukar Bahasa / Change Language"
        >
          🌐 {lang.toUpperCase()}
        </button>
        <button 
          onClick={toggleTheme}
          style={{
            background: 'rgba(128,128,128,0.15)',
            border: '1px solid var(--admin-border)',
            color: 'var(--admin-text)',
            borderRadius: '50px',
            padding: '0.35rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title="Tukar Tema (Terang / Gelap)"
        >
          {theme === 'dark' ? t.lightMode : t.darkMode}
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>💍</span>
          <h1>eWedding</h1>
          <p>{t.weddingTitle}</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label>Login ID</label>
            <input type="text" className="form-control" placeholder="Masukkan Login ID anda..." value={loginId} onChange={e => setLoginId(e.target.value)} required autoFocus />
          </div>
          <div className="form-group">
            <label>{t.password}</label>
            <input type="password" className="form-control" placeholder="Masukkan kata laluan..." value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : null}
            {loading ? t.loggingIn : t.loginBtn}
          </button>
          <p className={styles.hint}>ID Login dan kata laluan diberikan oleh pentadbir.</p>
        </form>
      </div>
      <div className={styles.bg} />
    </div>
  );
}
