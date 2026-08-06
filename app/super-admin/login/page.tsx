'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lang, getAdminText } from '@/lib/i18n';
import styles from './login.module.css';

export default function SuperAdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [setupRequired, setSetupRequired] = useState<boolean | null>(null);
  const [registeredUsername, setRegisteredUsername] = useState('');
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState<Lang>('ms');
  const [globalTextOverrides, setGlobalTextOverrides] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme') || 'dark';
    const savedLang = (localStorage.getItem('admin-lang') as Lang) || 'ms';
    setTheme(savedTheme);
    setLang(savedLang);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    fetch('/api/config/global').then(res => res.json()).then(data => {
      if (data.globalTextOverrides) setGlobalTextOverrides(data.globalTextOverrides);
    }).catch(console.error);

    fetch('/api/super-admin/login').then(res => res.json()).then(data => {
      setSetupRequired(!!data.setupRequired);
      if (data.username) setUsername(data.username);
    }).catch(() => {
      setSetupRequired(false);
    });
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

  const t = getAdminText(lang, globalTextOverrides);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (setupRequired) {
      if (password !== confirmPassword) {
        setError(t.passwordsDoNotMatch || 'Kata laluan dan pengesahan kata laluan tidak sepadan.');
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/super-admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error || t.usernameOrPasswordInvalid || 'Nama pengguna atau kata laluan tidak sah.');
        return;
      }

      if (data?.firstTime || setupRequired) {
        const adminUser = data?.username || username;
        setRegisteredUsername(adminUser);
        setTimeout(() => {
          router.push('/super-admin');
        }, 1800);
      } else {
        router.push('/super-admin');
      }
    } catch (err) {
      console.error('Super admin login submit error:', err);
      setError(t.connError);
    } finally {
      setLoading(false);
    }
  }

  const successBanner = registeredUsername ? (
    t.superAdminSetupSuccess
      ? t.superAdminSetupSuccess.replace('{username}', registeredUsername)
      : `✅ Nama pengguna ${registeredUsername} telah didaftarkan sebagai Super Admin untuk sistem ini!`
  ) : '';

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
            padding: '0.45rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {lang === 'ms' ? '🇬🇧 EN' : '🇲🇾 BM'}
        </button>
        <button 
          onClick={toggleTheme}
          style={{
            background: 'rgba(128,128,128,0.15)',
            border: '1px solid var(--admin-border)',
            color: 'var(--admin-text)',
            borderRadius: '50px',
            padding: '0.45rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title={t.toggleThemeTooltip}
        >
          {theme === 'dark' ? t.lightMode : t.darkMode}
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>👑</span>
          <h1>eWedding</h1>
          <p>{setupRequired ? (t.superAdminSetupTitle || '👑 Tetapan Pertama Super Admin') : t.superAdminTitle}</p>
        </div>

        {registeredUsername ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div className={styles.notice} style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10b981', padding: '1.25rem', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {successBanner}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
              Memuatkan Dashboard Super Admin... ⌛
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {setupRequired && (
              <div className={styles.notice} style={{ background: 'rgba(201, 168, 76, 0.15)', border: '1px solid rgba(201, 168, 76, 0.3)', color: '#C9A84C', padding: '0.85rem', borderRadius: '10px', fontSize: '0.82rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                👋 {t.superAdminLoginHint || 'Sila daftarkan Nama Pengguna dan Kata Laluan Super Admin anda untuk memulakan sistem.'}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>{t.superAdminUsernameLabel || 'Nama Pengguna Super Admin *'}</label>
              <input
                type="text"
                className="form-control"
                placeholder={t.enterSuperAdminUsername || 'Masukkan nama pengguna super admin...'}
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>{t.password}</label>
              <input
                type="password"
                className="form-control"
                placeholder={t.enterPassword}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {setupRequired && (
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>{t.confirmPasswordLabel || 'Sahkan Kata Laluan *'}</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder={t.enterConfirmPassword || 'Masukkan semula kata laluan...'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : null}
              {loading
                ? (setupRequired ? (t.settingUp || 'Menetapkan...') : t.loggingIn)
                : (setupRequired ? (t.setupSuperAdminBtn || '🚀 Cipta Akaun Super Admin') : t.loginBtn)
              }
            </button>
          </form>
        )}
      </div>
      <div className={styles.bg} />
    </div>
  );
}
