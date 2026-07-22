'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('admin-theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('admin-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--landing-bg)',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: 'var(--landing-text)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background-color 0.25s ease, color 0.25s ease'
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 20% 30%, rgba(201,168,76,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(27,67,50,0.15) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        background: 'var(--landing-card-bg)',
        border: '1px solid var(--landing-border)',
        borderRadius: '24px',
        padding: '3rem 2rem',
        width: '100%',
        maxWidth: '460px',
        textAlign: 'center',
        boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
        position: 'relative',
        zIndex: 1,
        transition: 'background-color 0.25s ease, border-color 0.25s ease'
      } as React.CSSProperties}>
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem', animation: 'float 3s ease-in-out infinite' }}>💍</span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#C9A84C', letterSpacing: '-0.02em', margin: 0 }}>eWedding</h1>
          <p style={{ color: 'var(--landing-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>Kad Jemputan Digital &amp; Pengurusan Perkahwinan</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/demo" target="_blank" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '1rem',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #8B6914, #C9A84C)',
            color: '#fff',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s'
          }}>
            👁️ Lihat Laman Contoh (Demo)
          </Link>

          <Link href="/admin" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '1rem',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: 600,
            background: 'rgba(255,255,255,0.06)',
            color: 'var(--landing-text)',
            border: '1px solid var(--landing-border)',
            textDecoration: 'none',
            transition: 'background 0.2s, color 0.2s'
          }}>
            ⚙️ Urus Akaun Pengantin (Couple Admin)
          </Link>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setWidgetOpen(!widgetOpen)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #8B6914, #C9A84C)',
          border: 'none',
          color: '#fff',
          fontSize: '1.4rem',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        title="Aksesibiliti & Bantuan"
      >
        ⚙️
      </button>

      {/* Accessibility & Help Popover */}
      {widgetOpen && (
        <div style={{
          position: 'fixed',
          bottom: '5.5rem',
          right: '1.5rem',
          width: '300px',
          background: 'var(--landing-card-bg)',
          border: '1px solid var(--landing-border)',
          borderRadius: '16px',
          padding: '1.25rem',
          boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
          zIndex: 1000,
          color: 'var(--landing-text)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          animation: 'scaleIn 0.2s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--landing-border)', paddingBottom: '0.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#C9A84C', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              ⚙️ Aksesibiliti &amp; Bantuan
            </h3>
            <button onClick={() => setWidgetOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--landing-text-muted)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
          </div>

          {/* Theme Selector */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem', color: 'var(--landing-text-muted)' }}>Pilihan Tema</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => toggleTheme('light')}
                style={{
                  flex: 1,
                  padding: '0.4rem',
                  borderRadius: '8px',
                  border: theme === 'light' ? '2px solid #C9A84C' : '1px solid var(--landing-border)',
                  background: theme === 'light' ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.02)',
                  color: 'var(--landing-text)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ☀️ Terang
              </button>
              <button 
                onClick={() => toggleTheme('dark')}
                style={{
                  flex: 1,
                  padding: '0.4rem',
                  borderRadius: '8px',
                  border: theme === 'dark' ? '2px solid #C9A84C' : '1px solid var(--landing-border)',
                  background: theme === 'dark' ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.02)',
                  color: 'var(--landing-text)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                🌙 Gelap
              </button>
            </div>
          </div>

          {/* Help Instructions */}
          <div style={{ fontSize: '0.75rem', borderTop: '1px solid var(--landing-border)', paddingTop: '0.65rem' }}>
            <p style={{ fontWeight: 600, color: 'var(--landing-text-muted)', marginBottom: '0.2rem' }}>Cara Log Masuk Pasangan:</p>
            <p style={{ margin: 0, lineHeight: 1.4, color: 'var(--landing-text-muted)' }}>Gunakan ID Pengguna &amp; Kata Laluan yang diberikan oleh pentadbir untuk mengakses Panel Pengantin.</p>
          </div>

          {/* Hidden Super Admin link */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            borderTop: '1px solid var(--landing-border)', 
            paddingTop: '0.65rem',
            marginTop: '0.15rem'
          }}>
            <Link href="/super-admin" style={{
              fontSize: '0.72rem',
              color: 'var(--landing-text-muted)',
              textDecoration: 'none',
              opacity: 0.35,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.35'; }}
            >
              Super Admin Portal ➡️
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

