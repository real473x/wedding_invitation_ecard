'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

import { ADMIN_DICT, Lang, formatPackageName } from '@/lib/i18n';

interface CoupleRow {
  id: string;
  loginId: string;
  isActive: boolean;
  createdAt: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  venue: string;
  theme: string;
  rsvpCount: number;
  packageName: string;
  expiresAt: string;
  daysRemaining: number;
  statusMode: 'on' | 'off' | 'auto';
  mustChangePassword: boolean;
}

interface PaymentRow {
  id: string;
  coupleId: string;
  coupleName: string;
  packageName: string;
  amount: number;
  paymentDate: string;
  notes: string;
}

const THEME_LABELS: Record<string, string> = {
  malay:'Melayu',chinese:'Cina',indian:'India',iban:'Iban',
  kadazan:'Kadazan Dusun',kayan:'Kayan',bidayuh:'Bidayuh',
  moden:'Moden',british:'British/American',orangasli:'Orang Asli',
};

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [couples, setCouples] = useState<CoupleRow[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [subTab, setSubTab] = useState<'couples' | 'accounting'>('couples');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showCredModal, setShowCredModal] = useState<{ loginId: string; password: string; id: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState<Lang>('ms');

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

  const fetchCouples = useCallback(async () => {
    const res = await fetch('/api/super-admin/couples');
    if (res.status === 401) { router.push('/super-admin/login'); return; }
    const data = await res.json();
    setCouples(data.couples || []);
    setLoading(false);
  }, [router]);

  const fetchPayments = useCallback(async () => {
    setPaymentLoading(true);
    const res = await fetch('/api/super-admin/payments');
    if (res.status === 401) { router.push('/super-admin/login'); return; }
    const data = await res.json();
    setPayments(data.payments || []);
    setPaymentLoading(false);
  }, [router]);

  useEffect(() => {
    fetchCouples();
  }, [fetchCouples]);

  useEffect(() => {
    if (subTab === 'accounting') {
      fetchPayments();
    }
  }, [subTab, fetchPayments]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function handleStatusModeChange(id: string, mode: 'on' | 'off' | 'auto') {
    await fetch(`/api/super-admin/couples/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statusMode: mode }),
    });
    setCouples(prev => prev.map(c => c.id === id ? { ...c, statusMode: mode } : c));
    showToast(`✅ Status mode dikemaskini: ${mode.toUpperCase()}`);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/super-admin/couples/${id}`, { method: 'DELETE' });
    setCouples(prev => prev.filter(c => c.id !== id));
    setDeleteConfirm(null);
    showToast('🗑️ Data pasangan telah dipadam');
  }

  async function handleEditCouple(id: string) {
    try {
      const res = await fetch(`/api/super-admin/couples/${id}/login`, {
        method: 'POST',
      });
      if (res.ok) {
        window.open('/admin', '_blank');
      } else {
        showToast('❌ Gagal mengakses editor.');
      }
    } catch {
      showToast('❌ Ralat sambungan.');
    }
  }

  async function handleResetPassword(id: string) {
    const res = await fetch(`/api/super-admin/couples/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetPassword: true }),
    });
    const data = await res.json();
    const couple = couples.find(c => c.id === id);
    if (couple && data.newPassword) {
      setShowCredModal({ loginId: couple.loginId, password: data.newPassword, id });
      fetchCouples(); // refresh list to update mustChangePassword flag
    }
  }

  async function handleLogout() {
    await fetch('/api/super-admin/login', { method: 'DELETE' });
    router.push('/super-admin/login');
  }

  const filteredCouples = couples.filter(c =>
    `${c.groomName} ${c.brideName} ${c.loginId} ${c.venue}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPayments = payments.filter(p =>
    `${p.coupleName} ${p.packageName} ${p.notes}`.toLowerCase().includes(search.toLowerCase())
  );

  // Expiration calculations for helper displays
  const getActiveStatus = (c: CoupleRow) => {
    const mode = c.statusMode;
    if (mode === 'on') return 'active';
    if (mode === 'off') return 'expired';
    
    const expTime = new Date(c.expiresAt).getTime();
    if (expTime < Date.now()) return 'expired';
    if (expTime - Date.now() < 7 * 24 * 60 * 60 * 1000) return 'warn';
    return 'active';
  };

  const couplesWithoutDemo = couples.filter(c => c.loginId !== 'demo');
  const couplesCount = couplesWithoutDemo.length;

  const activeCount = couplesWithoutDemo.filter(c => {
    const status = getActiveStatus(c);
    return status === 'active' || status === 'warn';
  }).length;
  
  const totalRsvp = couplesWithoutDemo.reduce((s, c) => s + c.rsvpCount, 0);

  // Accounting metrics
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className={styles.layout} style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--admin-text)', fontSize: '1rem', fontWeight: 600 }}>Memuatkan Super Admin Panel...</p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerLogo}>💍</span>
          <div>
            <h1>eWedding</h1>
            <span>Super Admin</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button 
            onClick={toggleLang} 
            className={`btn btn-sm ${styles.accountBtn}`}
            title="Tukar Bahasa / Change Language"
          >
            🌐 {lang.toUpperCase()}
          </button>
          <button 
            onClick={toggleTheme} 
            className={`btn btn-sm ${styles.accountBtn}`}
            title={lang === 'en' ? "Toggle Theme (Light / Dark)" : "Tukar Tema (Terang / Gelap)"}
          >
            {theme === 'dark' ? t.lightMode : t.darkMode}
          </button>
          <button onClick={() => setShowAccountModal(true)} className={`btn btn-sm ${styles.accountBtn}`}>
            {t.manageAccount}
          </button>
          <button onClick={handleLogout} className={`btn btn-sm ${styles.logoutBtn}`}>
            {t.logout}
          </button>
        </div>
      </header>

      <div className={styles.content}>
        {/* Subheader Tabs */}
        <div className={styles.subHeaderTabs}>
          <button className={`${styles.subTabBtn} ${subTab === 'couples' ? styles.subTabActive : ''}`} onClick={() => { setSubTab('couples'); setSearch(''); }}>
            {t.couplesTab} ({couplesCount})
          </button>
          <button className={`${styles.subTabBtn} ${subTab === 'accounting' ? styles.subTabActive : ''}`} onClick={() => { setSubTab('accounting'); setSearch(''); }}>
            {t.accountingTab} (RM {totalRevenue.toFixed(2)})
          </button>
        </div>

        {subTab === 'couples' ? (
          <>
            {/* Stats */}
            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <span className={styles.statNum}>{couplesCount}</span>
                <span className={styles.statLabel}>{t.totalCouples}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>{activeCount}</span>
                <span className={styles.statLabel}>{t.activeCouples}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>{couplesCount - activeCount}</span>
                <span className={styles.statLabel}>{t.expiredOffCouples}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>{totalRsvp}</span>
                <span className={styles.statLabel}>{t.totalRsvp}</span>
              </div>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
              <input
                className={styles.searchInput}
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                {t.addCouple}
              </button>
            </div>

            {/* Table */}
            {loading ? (
              <div className={styles.loading}><span className={styles.spinner} />{lang === 'en' ? 'Loading data...' : 'Memuatkan data...'}</div>
            ) : filteredCouples.length === 0 ? (
              <div className={styles.empty}>
                <p>💍</p>
                <p>{t.noCouplesFound}</p>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>{t.addFirstCouple}</button>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t.coupleHeader}</th>
                      <th>{t.loginIdHeader}</th>
                      <th>{t.packageHeader}</th>
                      <th>{t.expiryHeader}</th>
                      <th>RSVP</th>
                      <th>{t.statusModeHeader}</th>
                      <th>{t.actionsHeader}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCouples.map(c => {
                      const activeStatus = getActiveStatus(c);
                      return (
                        <tr key={c.id} className={activeStatus === 'expired' ? styles.rowInactive : ''}>
                          <td>
                            <div className={styles.coupleName}>{c.groomName} &amp; {c.brideName}</div>
                            <div className={styles.coupleVenue}>{c.venue}</div>
                          </td>
                          <td>
                            <code className={styles.loginId}>{c.loginId}</code>
                            {c.mustChangePassword && <span style={{ display: 'block', fontSize: '0.62rem', color: '#f59e0b', marginTop: '3px', fontWeight: 600 }}>[{lang === 'en' ? 'Password Change Required' : 'Tukar Kata Laluan Wajib'}]</span>}
                          </td>
                          <td><span className={styles.themeBadge}>{formatPackageName(c.packageName, lang)}</span></td>
                          <td>
                            <div>
                              {activeStatus === 'active' && <span className={styles.expiryActive}>{t.statusActive}</span>}
                              {activeStatus === 'warn' && <span className={styles.expiryWarn}>{t.statusWarn}</span>}
                              {activeStatus === 'expired' && <span className={styles.expiryExpired}>{t.statusExpired}</span>}
                            </div>
                            <div className={styles.expiryInfo}>
                              {new Date(c.expiresAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'ms-MY', { day: 'numeric', month: 'short' })} ({c.daysRemaining} {t.daysLeft})
                            </div>
                          </td>
                          <td><span className={styles.rsvpBadge}>{c.rsvpCount}</span></td>
                          <td>
                            <div className={styles.statusPills}>
                              <button
                                className={`${styles.statusPill} ${c.statusMode === 'on' ? styles.statusPillActiveOn : ''}`}
                                onClick={() => handleStatusModeChange(c.id, 'on')}
                                title="Sentiasa Aktif (On)"
                              >
                                On
                              </button>
                              <button
                                className={`${styles.statusPill} ${c.statusMode === 'off' ? styles.statusPillActiveOff : ''}`}
                                onClick={() => handleStatusModeChange(c.id, 'off')}
                                title="Sentiasa Tutup (Off)"
                              >
                                Off
                              </button>
                              <button
                                className={`${styles.statusPill} ${c.statusMode === 'auto' ? styles.statusPillActiveAuto : ''}`}
                                onClick={() => handleStatusModeChange(c.id, 'auto')}
                                title="Auto Nyahaktif apabila tamat tempoh pakej"
                              >
                                Auto
                              </button>
                            </div>
                          </td>
                          <td>
                            <div className={styles.actions}>
                              <a href={c.loginId === 'demo' ? '/demo' : `/${c.loginId}`} target="_blank" className={`btn btn-sm ${styles.btnView}`} title="Lihat jemputan">👁</a>
                              <button onClick={() => handleEditCouple(c.id)} className={`btn btn-sm ${styles.btnReset}`} style={{ color: '#4ade80', borderColor: 'rgba(74,222,128,.2)' }} title="Ubah Tetapan Laman Web">📝</button>
                              {c.loginId !== 'demo' && (
                                <>
                                  <button onClick={() => setShowCredModal({ id: c.id, loginId: c.loginId, password: '' })} className={`btn btn-sm ${styles.btnReset}`} title="Papar Kelayakan Akses">🔑</button>
                                  <button onClick={() => setDeleteConfirm(c.id)} className={`btn btn-sm btn-danger`} title="Padam">🗑</button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Accounting dashboard */}
            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <span className={`${styles.statNum} ${styles.accountingTotal}`}>RM {totalRevenue.toFixed(2)}</span>
                <span className={styles.statLabel}>Jumlah Pendapatan</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>{payments.length}</span>
                <span className={styles.statLabel}>Jumlah Transaksi Bayaran</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>
                  RM {payments.length ? (totalRevenue / payments.length).toFixed(2) : '0.00'}
                </span>
                <span className={styles.statLabel}>Purata Setiap Bayaran</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>
                  RM {couples.length ? (totalRevenue / couples.length).toFixed(2) : '0.00'}
                </span>
                <span className={styles.statLabel}>Purata Pendapatan / Pasangan</span>
              </div>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
              <input
                className={styles.searchInput}
                placeholder="🔍  Cari rekod bayaran..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className={`btn btn-primary ${styles.btnManualPayment}`} onClick={() => setShowAddPaymentModal(true)}>
                ＋ Log Bayaran Manual
              </button>
            </div>

            {/* Payments Table */}
            {paymentLoading ? (
              <div className={styles.loading}><span className={styles.spinner} />Memuatkan data kewangan...</div>
            ) : filteredPayments.length === 0 ? (
              <div className={styles.empty}>
                <p>💰</p>
                <p>Tiada rekod bayaran dijumpai.</p>
                <button className="btn btn-primary" onClick={() => setShowAddPaymentModal(true)}>Log Bayaran Pertama</button>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Tarikh</th>
                      <th>Pasangan</th>
                      <th>Pakej</th>
                      <th>Jumlah Bayaran</th>
                      <th>Catatan / Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map(p => (
                      <tr key={p.id}>
                        <td>{new Date(p.paymentDate).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        <td><strong>{p.coupleName}</strong></td>
                        <td><span className={styles.themeBadge}>{formatPackageName(p.packageName, lang)}</span></td>
                        <td style={{ color: '#4ade80', fontWeight: 'bold' }}>RM {p.amount.toFixed(2)}</td>
                        <td><div className={styles.tableNote} title={p.notes}>{p.notes || '—'}</div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Couple Modal */}
      {showAddModal && <AddCoupleModal onClose={() => setShowAddModal(false)} onCreated={(cred) => { setShowAddModal(false); setShowCredModal(cred); fetchCouples(); }} />}

      {/* Credentials Modal */}
      {showCredModal && (() => {
        const coupleInList = couples.find(c => c.id === showCredModal.id);
        const mustChange = coupleInList ? coupleInList.mustChangePassword : true;
        const hasPassword = !!showCredModal.password;

        return (
          <div className="popup-overlay" onClick={() => setShowCredModal(null)}>
            <div className={styles.credModal} onClick={e => e.stopPropagation()}>
              <h3>🎉 Kelayakan Akses</h3>
              <p>Simpan maklumat ini dan kongsikan kepada pasangan.</p>
              <div className={styles.credBox}>
                <div className={styles.credRow}>
                  <span>Login ID</span>
                  <strong>{showCredModal.loginId}</strong>
                  <button onClick={() => { navigator.clipboard.writeText(showCredModal.loginId); showToast('Disalin!'); }} className={styles.copyBtn}>📋</button>
                </div>
                <div className={styles.credRow}>
                  <span>Kata Laluan</span>
                  {hasPassword ? (
                    <>
                      <strong>{showCredModal.password}</strong>
                      <button onClick={() => { navigator.clipboard.writeText(showCredModal.password || ''); showToast('Disalin!'); }} className={styles.copyBtn}>📋</button>
                    </>
                  ) : (
                    <strong style={{ color: mustChange ? '#94a3b8' : '#e87c6f', fontStyle: 'italic', fontWeight: 'normal' }}>
                      {mustChange ? '[Kata Laluan Sementara - Belum Ditukar]' : '[Kata Laluan Telah Ditukar Oleh Pengguna]'}
                    </strong>
                  )}
                </div>
                <div className={styles.credRow}>
                  <span>URL Jemputan</span>
                  <strong>{typeof window !== 'undefined' ? `${window.location.origin}/${showCredModal.loginId}` : ''}</strong>
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/${showCredModal.loginId}`); showToast('Disalin!'); }} className={styles.copyBtn}>📋</button>
                </div>
                <div className={styles.credRow}>
                  <span>URL Admin</span>
                  <strong>{typeof window !== 'undefined' ? `${window.location.origin}/admin` : ''}</strong>
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/admin`); showToast('Disalin!'); }} className={styles.copyBtn}>📋</button>
                </div>
              </div>
              
              {!hasPassword && (
                <button 
                  className="btn btn-danger" 
                  style={{ width: '100%', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} 
                  onClick={async () => {
                    if (confirm('Adakah anda pasti mahu menjana kata laluan baru untuk pasangan ini? Ini akan memaksa pasangan menukar kata laluan sekali lagi pada log masuk seterusnya.')) {
                      await handleResetPassword(showCredModal.id);
                    }
                  }}
                >
                  🔑 Jana Kata Laluan Baru
                </button>
              )}

              <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setShowCredModal(null)}>Tutup</button>
            </div>
          </div>
        );
      })()}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="popup-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <h3>⚠️ Padam Pasangan?</h3>
            <p>Tindakan ini akan memadam <strong>semua data</strong> pasangan ini termasuk RSVP, ucapan, dan tetapan laman. Tindakan ini tidak boleh dibuat asal.</p>
            <div className={styles.confirmBtns}>
              <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)}>Batal</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Ya, Padam</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddPaymentModal && (
        <AddPaymentModal
          couples={couples}
          onClose={() => setShowAddPaymentModal(false)}
          onCreated={() => {
            setShowAddPaymentModal(false);
            fetchPayments();
            showToast('✅ Bayaran manual direkodkan!');
          }}
        />
      )}

      {/* Account Modal */}
      {showAccountModal && (
        <AccountModal
          onClose={() => setShowAccountModal(false)}
          onSuccess={() => {
            setShowAccountModal(false);
            showToast('✅ Kata laluan berjaya ditukar!');
          }}
        />
      )}

      {/* Toast */}
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}

function AddCoupleModal({ onClose, onCreated }: {
  onClose: () => void;
  onCreated: (cred: { loginId: string; password: string; id: string }) => void;
}) {
  const [form, setForm] = useState({
    groomName: '',
    brideName: '',
    weddingDate: new Date().toISOString().split('T')[0],
    theme: 'malay',
    customLoginId: '',
    customPassword: '',
    packageKey: '1month',
    customDays: '30',
    amountPaid: '50',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/super-admin/couples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      onCreated({ loginId: data.couple.loginId, password: data.couple.plainPassword, id: data.couple.id });
    } catch { setError('Ralat. Cuba semula.'); }
    finally { setLoading(false); }
  }

  const themes = [
    { key: 'malay', label: '🌙 Melayu' }, { key: 'chinese', label: '🏮 Cina' },
    { key: 'indian', label: '🪷 India' }, { key: 'iban', label: '🦅 Iban' },
    { key: 'kadazan', label: '🌿 Kadazan Dusun' }, { key: 'kayan', label: '🔴 Kayan' },
    { key: 'bidayuh', label: '🏺 Bidayuh' }, { key: 'moden', label: '🖤 Moden' },
    { key: 'british', label: '🌹 British/American' }, { key: 'orangasli', label: '🌳 Orang Asli' },
  ];

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className={styles.addModal} onClick={e => e.stopPropagation()}>
        <div className={styles.addModalHeader}>
          <h3>➕ Tambah Pasangan Baru</h3>
          <button className="popup-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.addForm}>
          <div className={styles.formRow}>
            <div className="form-group">
              <label>Nama Pengantin Lelaki *</label>
              <input className="form-control" placeholder="cth: Adam" value={form.groomName} onChange={e => setForm(f => ({ ...f, groomName: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Nama Pengantin Perempuan *</label>
              <input className="form-control" placeholder="cth: Hawa" value={form.brideName} onChange={e => setForm(f => ({ ...f, brideName: e.target.value }))} required />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className="form-group">
              <label>Tarikh Perkahwinan *</label>
              <input className="form-control" type="date" value={form.weddingDate} onChange={e => setForm(f => ({ ...f, weddingDate: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Tema Asal</label>
              <select className="form-control" value={form.theme} onChange={e => setForm(f => ({ ...f, theme: e.target.value }))}>
                {themes.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className="form-group">
              <label>Pakej Langganan *</label>
              <select 
                className="form-control" 
                value={form.packageKey} 
                onChange={e => {
                  const val = e.target.value;
                  let days = '30';
                  if (val === '3month') days = '90';
                  else if (val === '6month') days = '180';
                  else if (val === '1year') days = '365';
                  else if (val === 'unlimited') days = '36500';
                  
                  setForm(f => ({ ...f, packageKey: val, customDays: days }));
                }} 
                required
              >
                <option value="1month">1 Month</option>
                <option value="3month">3 Month</option>
                <option value="6month">6 Month</option>
                <option value="1year">1 Year</option>
                <option value="unlimited">Unlimited (Selamanya)</option>
                <option value="custom">Custom (Hari Kustom)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tempoh Aktif (Hari)</label>
              <input
                className="form-control"
                type="number"
                min="1"
                value={form.customDays}
                onChange={e => setForm(f => ({ ...f, customDays: e.target.value }))}
                disabled={form.packageKey !== 'custom'}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className="form-group">
              <label>Bayaran Pendaftaran (RM)</label>
              <input className="form-control" type="number" min="0" placeholder="0.00" value={form.amountPaid} onChange={e => setForm(f => ({ ...f, amountPaid: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Kata Laluan (pilihan)</label>
              <input className="form-control" placeholder="Jana Rawak" value={form.customPassword} onChange={e => setForm(f => ({ ...f, customPassword: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label>Login ID (pilihan — kosongkan untuk jana automatik)</label>
            <input className="form-control" placeholder="cth: adam-hawa-2026" value={form.customLoginId} onChange={e => setForm(f => ({ ...f, customLoginId: e.target.value.toLowerCase().replace(/\s/g, '-') }))} />
          </div>
          {error && <div style={{ color: '#e87c6f', fontSize: '0.85rem', background: 'rgba(192,57,43,.1)', padding: '0.6rem', borderRadius: '8px' }}>{error}</div>}
          <div className={styles.addModalFooter}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Mencipta...' : '✓ Cipta Pasangan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddPaymentModal({ couples, onClose, onCreated }: {
  couples: CoupleRow[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    coupleId: '',
    amount: '',
    packageName: 'Pembaharuan Pakej',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/super-admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      onCreated();
    } catch { setError('Ralat. Cuba semula.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className={styles.addModal} style={{ maxWidth: '460px' }} onClick={e => e.stopPropagation()}>
        <div className={styles.addModalHeader}>
          <h3>➕ Log Rekod Bayaran Manual</h3>
          <button className="popup-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.addForm}>
          <div className="form-group">
            <label>Pasangan Pengantin</label>
            <select className="form-control" value={form.coupleId} onChange={e => setForm(f => ({ ...f, coupleId: e.target.value }))}>
              <option value="">— Kegunaan Am / Bayaran Offline —</option>
              {couples.map(c => (
                <option key={c.id} value={c.id}>{c.groomName} &amp; {c.brideName} ({c.loginId})</option>
              ))}
            </select>
          </div>
          <div className={styles.formRow}>
            <div className="form-group">
              <label>Jumlah Bayaran (RM) *</label>
              <input className="form-control" type="number" step="0.01" min="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Perihalan Pakej / Nama</label>
              <input className="form-control" placeholder="cth: Pembaharuan 30 Hari" value={form.packageName} onChange={e => setForm(f => ({ ...f, packageName: e.target.value }))} required />
            </div>
          </div>
          <div className="form-group">
            <label>Catatan (Pilihan)</label>
            <textarea className="form-control" rows={3} placeholder="Catatan bayaran cth: Resit bank-in, bayaran tunai..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          {error && <div style={{ color: '#e87c6f', fontSize: '0.85rem', background: 'rgba(192,57,43,.1)', padding: '0.6rem', borderRadius: '8px' }}>{error}</div>}
          <div className={styles.addModalFooter}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Merekod...' : '✓ Rekod Bayaran'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AccountModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
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
      const res = await fetch('/api/super-admin/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Ralat berlaku.');
        return;
      }
      onSuccess();
    } catch {
      setError('Ralat sambungan. Cuba semula.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className={styles.confirmModal} style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
        <div className={styles.addModalHeader} style={{ padding: '0 0 1rem', borderBottom: '1px solid rgba(255,255,255,.08)', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0 }}>⚙️ Urus Akaun</h3>
          <button className="popup-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Kata Laluan Semasa *</label>
            <input
              type="password"
              className="form-control"
              placeholder="Masukkan kata laluan semasa..."
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Kata Laluan Baru *</label>
            <input
              type="password"
              className="form-control"
              placeholder="Masukkan kata laluan baru..."
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Sahkan Kata Laluan Baru *</label>
            <input
              type="password"
              className="form-control"
              placeholder="Masukkan semula kata laluan baru..."
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <div style={{ color: '#e87c6f', fontSize: '0.85rem', background: 'rgba(192,57,43,.1)', padding: '0.65rem 0.9rem', borderRadius: '8px' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Menukar...' : '✓ Tukar Kata Laluan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

