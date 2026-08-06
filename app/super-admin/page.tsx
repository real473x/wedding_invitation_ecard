'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

import { ADMIN_DICT, INVITATION_DICT, Lang, formatPackageName, getAdminText, ADMIN_TEXT_KEYS, AVAILABLE_PACKAGES } from '@/lib/i18n';

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
  featureToggles?: Record<string, boolean>;
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
  const [subTab, setSubTab] = useState<'couples' | 'accounting' | 'text'>('couples');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showCredModal, setShowCredModal] = useState<{ loginId: string; password: string; id: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editCouple, setEditCouple] = useState<CoupleRow | null>(null);
  const [toggleCouple, setToggleCouple] = useState<CoupleRow | null>(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState<Lang>('en');
  
  const [globalTextOverrides, setGlobalTextOverrides] = useState<Record<string, string>>({});
  const [importedJsonBase, setImportedJsonBase] = useState<Record<string, string>>({});
  const [isImportedPending, setIsImportedPending] = useState(false);
  const [hasUnsavedGlobalText, setHasUnsavedGlobalText] = useState(false);
  const [savingGlobalText, setSavingGlobalText] = useState(false);

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

  const t = getAdminText(lang, globalTextOverrides);

  const fetchGlobalText = useCallback(async () => {
    try {
      const res = await fetch('/api/config/global');
      if (res.ok) {
        const data = await res.json();
        setGlobalTextOverrides(data.globalTextOverrides || {});
        setImportedJsonBase(data.importedJsonBase || {});
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  function handleExportLang() {
    const dataStr = JSON.stringify(globalTextOverrides, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ewedding-lang-export-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleExportTemplate() {
    const allDefaults = { ...INVITATION_DICT[lang], ...ADMIN_DICT[lang] };
    const template = { ...allDefaults, ...globalTextOverrides };
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ewedding-lang-template-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleImportLang(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (typeof json === 'object' && json !== null) {
          setGlobalTextOverrides(json);
          setIsImportedPending(true);
          setHasUnsavedGlobalText(true);
          showToast(t.jsonImportPromptToast);
        } else {
          alert(t.jsonInvalidFormatToast);
        }
      } catch (err) {
        alert(t.jsonReadErrorToast);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  }

  useEffect(() => {
    fetchGlobalText();
  }, [fetchGlobalText]);

  const saveGlobalText = async () => {
    setSavingGlobalText(true);
    try {
      const nextBase = isImportedPending ? globalTextOverrides : importedJsonBase;
      const res = await fetch('/api/super-admin/config/global', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          globalTextOverrides,
          importedJsonBase: nextBase
        }),
      });
      if (res.ok) {
        setHasUnsavedGlobalText(false);
        setImportedJsonBase(nextBase);
        setIsImportedPending(false);
        showToast(isImportedPending ? t.jsonImportSuccessToast : t.globalTextSavedToast);
      } else {
        showToast(t.globalTextSaveErrorToast);
      }
    } catch (err) {
      console.error(err);
      showToast(t.globalTextSaveErrorToast);
    } finally {
      setSavingGlobalText(false);
    }
  };

  const [deletePaymentConfirm, setDeletePaymentConfirm] = useState<string | null>(null);
  const [editPayment, setEditPayment] = useState<PaymentRow | null>(null);

  const fetchCouples = useCallback(async () => {
    const res = await fetch('/api/super-admin/couples');
    if (res.status === 401) { router.push('/super-admin/login'); return; }
    const data = await res.json();
    setCouples(data.couples || []);
    setLoading(false);
  }, [router]);

  const fetchPayments = useCallback(async () => {
    const res = await fetch('/api/super-admin/payments');
    const data = await res.json();
    setPayments(data.payments || []);
    setPaymentLoading(false);
  }, []);

  useEffect(() => {
    fetchCouples();
  }, [fetchCouples]);

  useEffect(() => {
    if (subTab === 'accounting' && payments.length === 0) {
      fetchPayments();
    }
  }, [subTab, fetchPayments, payments.length]);

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

  async function handleDeletePayment(id: string) {
    const res = await fetch(`/api/super-admin/payments/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPayments(prev => prev.filter(p => p.id !== id));
      setDeletePaymentConfirm(null);
      showToast('🗑️ Rekod bayaran telah dipadam');
    } else {
      showToast('❌ Ralat memadam rekod bayaran');
    }
  }

  async function handleEditCouple(id: string) {
    // Open the window BEFORE any await — browsers block popups after async breaks
    const adminWindow = window.open('', '_blank');
    try {
      const res = await fetch(`/api/super-admin/couples/${id}/login`, {
        method: 'POST',
      });
      if (res.ok) {
        if (adminWindow) adminWindow.location.href = '/admin';
        else window.open('/admin', '_blank'); // fallback if opener was blocked
      } else {
        adminWindow?.close();
        showToast('❌ Gagal mengakses editor.');
      }
    } catch {
      adminWindow?.close();
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
          {hasUnsavedGlobalText && (
            <button
              onClick={saveGlobalText}
              className={`btn btn-sm`}
              style={{ background: 'var(--admin-accent)', color: 'var(--admin-text)' }}
              disabled={savingGlobalText}
            >
              {savingGlobalText ? t.saving : t.saveChanges}
            </button>
          )}

          <button 
            onClick={toggleTheme} 
            className={`btn btn-sm ${styles.accountBtn}`}
            title={t.toggleThemeTooltip}
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
          <button className={`${styles.subTabBtn} ${subTab === 'text' ? styles.subTabActive : ''}`} onClick={() => { setSubTab('text'); }}>
            {t.textTabLabel}
          </button>
        </div>

        {subTab === 'couples' && (
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
              <div className={styles.loading}><span className={styles.spinner} />{t.loadingData}</div>
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
                            {c.mustChangePassword && <span style={{ display: 'block', fontSize: '0.62rem', color: '#f59e0b', marginTop: '3px', fontWeight: 600 }}>[{t.mustChangePassBadge}]</span>}
                          </td>
                          <td><span className={styles.themeBadge}>{formatPackageName(c.packageName, lang)}</span></td>
                          <td>
                            <div>
                              {activeStatus === 'active' && <span className={styles.expiryActive}>{t.statusActive}</span>}
                              {activeStatus === 'warn' && <span className={styles.expiryWarn}>{t.statusWarn}</span>}
                              {activeStatus === 'expired' && <span className={styles.expiryExpired}>{t.statusExpired}</span>}
                            </div>
                            <div className={styles.expiryInfo}>
                              {new Date(c.expiresAt).toLocaleDateString(t.dateLocale || (lang === 'en' ? 'en-US' : 'ms-MY'), { day: 'numeric', month: 'short' })} ({c.daysRemaining} {t.daysLeft})
                            </div>
                          </td>
                          <td><span className={styles.rsvpBadge}>{c.rsvpCount}</span></td>
                          <td>
                            <div className={styles.statusPills}>
                              <button
                                className={`${styles.statusPill} ${c.statusMode === 'on' ? styles.statusPillActiveOn : ''}`}
                                onClick={() => handleStatusModeChange(c.id, 'on')}
                                title={t.statusOnTooltip}
                              >
                                On
                              </button>
                              <button
                                className={`${styles.statusPill} ${c.statusMode === 'off' ? styles.statusPillActiveOff : ''}`}
                                onClick={() => handleStatusModeChange(c.id, 'off')}
                                title={t.statusOffTooltip}
                              >
                                Off
                              </button>
                              <button
                                className={`${styles.statusPill} ${c.statusMode === 'auto' ? styles.statusPillActiveAuto : ''}`}
                                onClick={() => handleStatusModeChange(c.id, 'auto')}
                                title={t.statusAutoTooltip}
                              >
                                Auto
                              </button>
                            </div>
                          </td>
                          <td>
                            <div className={styles.actions}>
                              <a href={c.loginId === 'demo' ? '/demo' : `/${c.loginId}`} target="_blank" className={`btn btn-sm ${styles.btnView}`} title={t.viewInviteTooltip}>👁️</a>
                              <button onClick={() => setEditCouple(c)} className={`btn btn-sm ${styles.btnReset}`} style={{ color: '#fbbf24', borderColor: 'rgba(251,191,36,.2)' }} title={t.editPkgTooltip}>✏️</button>
                              <button onClick={() => setToggleCouple(c)} className={`btn btn-sm ${styles.btnReset}`} style={{ color: '#a855f7', borderColor: 'rgba(168,85,247,.2)' }} title={t.featureTogglesModalTitle || '⚙️ Urus Ciri & Kebenaran Laman'}>⚙️</button>
                              <button onClick={() => handleEditCouple(c.id)} className={`btn btn-sm ${styles.btnReset}`} style={{ color: '#4ade80', borderColor: 'rgba(74,222,128,.2)' }} title={t.editSiteTooltip}>📝</button>
                              {c.loginId !== 'demo' && (
                                <>
                                  <button onClick={() => setShowCredModal({ id: c.id, loginId: c.loginId, password: '' })} className={`btn btn-sm ${styles.btnReset}`} title={t.viewCredTooltip}>🔑</button>
                                  <button onClick={() => setDeleteConfirm(c.id)} className={`btn btn-sm btn-danger`} title={t.deleteTooltip}>🗑</button>
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
        )}

        {subTab === 'accounting' && (
          <>
            {/* Accounting dashboard */}
            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <span className={`${styles.statNum} ${styles.accountingTotal}`}>RM {totalRevenue.toFixed(2)}</span>
                <span className={styles.statLabel}>{t.totalRevenueTitle}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>{payments.length}</span>
                <span className={styles.statLabel}>{t.totalTransactionsTitle}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>
                  RM {payments.length ? (totalRevenue / payments.length).toFixed(2) : '0.00'}
                </span>
                <span className={styles.statLabel}>{t.avgPerPaymentTitle}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>
                  RM {couples.length ? (totalRevenue / couples.length).toFixed(2) : '0.00'}
                </span>
                <span className={styles.statLabel}>{t.avgPerCoupleTitle}</span>
              </div>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
              <input
                className={styles.searchInput}
                placeholder={t.searchPaymentsPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className={`btn btn-primary ${styles.btnManualPayment}`} onClick={() => setShowAddPaymentModal(true)}>
                {t.manualLogBtn}
              </button>
            </div>

            {/* Payments Table */}
            {paymentLoading ? (
              <div className={styles.loading}><span className={styles.spinner} />{t.financialLoading}</div>
            ) : filteredPayments.length === 0 ? (
              <div className={styles.empty}>
                <p>💰</p>
                <p>{t.financialNoData}</p>
                <button className="btn btn-primary" onClick={() => setShowAddPaymentModal(true)}>{t.financialFirstLog}</button>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t.dateLabel}</th>
                      <th>{t.coupleLabel}</th>
                      <th>{t.packageLabel}</th>
                      <th>{t.amountLabel}</th>
                      <th>{t.notesLabel}</th>
                      <th>{t.actionLabel}</th>
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
                        <td>
                          <div className={styles.actions}>
                            <button className={`btn btn-sm ${styles.editBtn}`} onClick={() => setEditPayment(p)} title={t.updatePaymentTooltip}>
                              {t.updateBtn}
                            </button>
                            <button className={`btn btn-sm ${styles.deleteBtn}`} onClick={() => setDeletePaymentConfirm(p.id)} title={t.deletePaymentTooltip}>
                              {t.deleteBtn}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {subTab === 'text' && (
          <div className={styles.configSection}>
            <div className={styles.sectionHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>{t.textOverridesSection}</h3>
                <p>{t.textOverridesDesc}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-sm" 
                  style={{ background: 'var(--admin-stat-bg)', color: 'var(--admin-text)', border: '1px solid var(--admin-border)' }}
                  onClick={handleExportTemplate}
                >
                  {t.exportAllBtn}
                </button>
                <button 
                  className="btn btn-sm" 
                  style={{ background: 'var(--admin-stat-bg)', color: 'var(--admin-text)', border: '1px solid var(--admin-border)' }}
                  onClick={handleExportLang}
                >
                  {t.exportJson}
                </button>
                <label className="btn btn-sm" style={{ background: 'var(--admin-stat-bg)', color: 'var(--admin-text)', border: '1px solid var(--admin-border)', margin: 0, cursor: 'pointer' }}>
                  {t.importJson}
                  <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportLang} />
                </label>
              </div>
            </div>
            
            <div className={styles.textGroups}>
              {ADMIN_TEXT_KEYS.map((groupObj, i) => {
                const groupTitle = t[groupObj.group as keyof typeof t] || groupObj.group;
                // Prepend group title key to keys list if not already present
                const keysToRender = groupObj.keys.includes(groupObj.group)
                  ? groupObj.keys
                  : [groupObj.group, ...groupObj.keys];

                return (
                  <div key={i} className={styles.textGroup}>
                    <h4 className={styles.textGroupTitle}>
                      {groupTitle}
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem', padding: '0.5rem 0' }}>
                      {keysToRender.map(key => {
                        const systemDefaultVal = ADMIN_DICT[lang][key as keyof typeof ADMIN_DICT['ms']] || key;
                        const baselineVal = importedJsonBase[key] || systemDefaultVal;
                        const currentVal = globalTextOverrides[key] || '';
                        
                        // Toggle is ON if currentVal is set and differs from the baseline
                        // Or if a JSON was just imported and pending save
                        const isOverridden = isImportedPending 
                          ? globalTextOverrides.hasOwnProperty(key)
                          : (globalTextOverrides.hasOwnProperty(key) && globalTextOverrides[key] !== baselineVal);

                        const displayLabel = isOverridden && currentVal ? currentVal : baselineVal;

                        return (
                          <div 
                            key={key} 
                            style={{ 
                              background: isOverridden ? 'rgba(201,168,76,0.06)' : 'rgba(0,0,0,0.15)', 
                              padding: '1rem', 
                              borderRadius: '12px', 
                              border: isOverridden ? '1px solid rgba(201,168,76,0.4)' : '1px solid var(--admin-border)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {/* Card Header with Title and Toggle Switch */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.5rem' }}>
                              <label style={{ margin: 0, fontSize: '0.82rem', color: isOverridden ? '#C9A84C' : 'var(--admin-text-muted)', fontWeight: 600, wordBreak: 'break-word' }}>
                                {displayLabel}
                                {isOverridden && <span style={{ fontSize: '0.68rem', color: '#C9A84C', opacity: 0.8, marginLeft: '0.4rem', fontWeight: 500 }}>(Custom)</span>}
                              </label>
                              <label className="toggle-switch" style={{ transform: 'scale(0.8)', margin: 0, flexShrink: 0 }} title="Aktifkan / Nyahaktifkan Suntingan Teks">
                                <input 
                                  type="checkbox" 
                                  checked={isOverridden} 
                                  onChange={e => {
                                    setHasUnsavedGlobalText(true);
                                    if (e.target.checked) {
                                      setGlobalTextOverrides(prev => ({ ...prev, [key]: currentVal || baselineVal }));
                                    } else {
                                      setGlobalTextOverrides(prev => {
                                        const next = { ...prev };
                                        delete next[key];
                                        return next;
                                      });
                                    }
                                  }} 
                                />
                                <span className="toggle-slider" />
                              </label>
                            </div>

                            {/* Card Body with always-visible input & stylish ↺ Default button */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {key === 'dateLocale' ? (
                                <select
                                  value={currentVal || baselineVal || (lang === 'en' ? 'en-US' : 'ms-MY')}
                                  onChange={e => {
                                    setHasUnsavedGlobalText(true);
                                    const val = e.target.value;
                                    setGlobalTextOverrides(prev => ({ ...prev, [key]: val }));
                                  }}
                                  style={{
                                    width: '100%',
                                    minHeight: '42px',
                                    padding: '0.65rem',
                                    background: 'var(--admin-input-bg)',
                                    border: isOverridden ? '1px solid rgba(201,168,76,0.4)' : '1px solid var(--admin-border)',
                                    color: 'var(--admin-text)',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    fontFamily: 'inherit',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <option value="ms-MY" style={{ background: '#1a1d27', color: '#fff' }}>🇲🇾 Bahasa Melayu (ms-MY) — cth: 15 Ogos 2026</option>
                                  <option value="en-US" style={{ background: '#1a1d27', color: '#fff' }}>🇺🇸 English US (en-US) — cth: Aug 15, 2026</option>
                                  <option value="en-GB" style={{ background: '#1a1d27', color: '#fff' }}>🇬🇧 English UK (en-GB) — cth: 15 Aug 2026</option>
                                  <option value="id-ID" style={{ background: '#1a1d27', color: '#fff' }}>🇮🇩 Bahasa Indonesia (id-ID) — cth: 15 Agt 2026</option>
                                  <option value="zh-CN" style={{ background: '#1a1d27', color: '#fff' }}>🇨🇳 Chinese (zh-CN) — cth: 2026年8月15日</option>
                                  <option value="ta-IN" style={{ background: '#1a1d27', color: '#fff' }}>🇮🇳 Tamil (ta-IN) — cth: 15 ஆக., 2026</option>
                                  <option value="ar-SA" style={{ background: '#1a1d27', color: '#fff' }}>🇸🇦 Arabic (ar-SA) — cth: ١٥ أغسطس ٢٠٢٦</option>
                                  <option value="ja-JP" style={{ background: '#1a1d27', color: '#fff' }}>🇯🇵 Japanese (ja-JP) — cth: 2026年8月15日</option>
                                  <option value="fr-FR" style={{ background: '#1a1d27', color: '#fff' }}>🇫🇷 French (fr-FR) — cth: 15 août 2026</option>
                                  <option value="de-DE" style={{ background: '#1a1d27', color: '#fff' }}>🇩🇪 German (de-DE) — cth: 15. Aug. 2026</option>
                                </select>
                              ) : (
                                <textarea
                                  value={currentVal}
                                  placeholder={baselineVal}
                                  onChange={e => {
                                    setHasUnsavedGlobalText(true);
                                    const val = e.target.value;
                                    if (!val) {
                                      setGlobalTextOverrides(prev => {
                                        const next = { ...prev };
                                        delete next[key];
                                        return next;
                                      });
                                    } else {
                                      setGlobalTextOverrides(prev => ({ ...prev, [key]: val }));
                                    }
                                  }}
                                  style={{ 
                                    width: '100%', 
                                    minHeight: '42px',
                                    padding: '0.65rem',
                                    background: 'var(--admin-input-bg)',
                                    border: isOverridden ? '1px solid rgba(201,168,76,0.4)' : '1px solid var(--admin-border)',
                                    color: 'var(--admin-text)',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    resize: 'vertical',
                                    fontFamily: 'inherit',
                                    lineHeight: '1.4'
                                  }}
                                />
                              )}
                              {isOverridden && (
                                <button 
                                  className="btn btn-sm"
                                  style={{ alignSelf: 'flex-end', padding: '0.35rem 0.65rem', fontSize: '0.7rem', background: 'var(--admin-input-bg)', color: 'var(--admin-text-muted)', border: 'none' }}
                                  onClick={() => {
                                    setGlobalTextOverrides(prev => {
                                      const next = { ...prev };
                                      delete next[key];
                                      return next;
                                    });
                                    setHasUnsavedGlobalText(true);
                                  }}
                                  title={t.resetToDefaultTooltip}
                                >
                                  ↺ Default
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Couple Modal */}
      {showAddModal && <AddCoupleModal t={t} onClose={() => setShowAddModal(false)} onCreated={(cred) => { setShowAddModal(false); setShowCredModal(cred); fetchCouples(); }} />}

      {/* Edit Couple Modal */}
      {editCouple && (
        <EditCoupleModal
          t={t}
          couple={editCouple}
          onClose={() => setEditCouple(null)}
          onUpdated={() => {
            setEditCouple(null);
            fetchCouples();
            showToast(t.coupleUpdatedToast);
          }}
        />
      )}

      {/* Feature Toggles Modal */}
      {toggleCouple && (
        <FeatureTogglesModal
          t={t}
          couple={toggleCouple}
          onClose={() => setToggleCouple(null)}
          onUpdated={() => {
            setToggleCouple(null);
            fetchCouples();
            showToast('✅ Tetapan ciri laman berjaya dikemaskini!');
          }}
        />
      )}

      {/* Credentials Modal */}
      {showCredModal && (() => {
        const coupleInList = couples.find(c => c.id === showCredModal.id);
        const mustChange = coupleInList ? coupleInList.mustChangePassword : true;
        const hasPassword = !!showCredModal.password;

        return (
          <div className="popup-overlay" onClick={() => setShowCredModal(null)}>
            <div className={styles.credModal} onClick={e => e.stopPropagation()}>
              <h3>{t.accessQualTitle}</h3>
              <p>{t.accessQualDesc}</p>
              <div className={styles.credBox}>
                <div className={styles.credRow}>
                  <span>{t.loginIdLabel}</span>
                  <strong>{showCredModal.loginId}</strong>
                  <button onClick={() => { navigator.clipboard.writeText(showCredModal.loginId); showToast(t.copiedToast); }} className={styles.copyBtn}>📋</button>
                </div>
                <div className={styles.credRow}>
                  <span>{t.passwordLabel}</span>
                  {hasPassword ? (
                    <>
                      <strong>{showCredModal.password}</strong>
                      <button onClick={() => { navigator.clipboard.writeText(showCredModal.password || ''); showToast(t.copiedToast); }} className={styles.copyBtn}>📋</button>
                    </>
                  ) : (
                    <strong style={{ color: mustChange ? '#94a3b8' : '#e87c6f', fontStyle: 'italic', fontWeight: 'normal' }}>
                      {mustChange ? t.tempPassNotChanged : t.passChangedByUser}
                    </strong>
                  )}
                </div>
                <div className={styles.credRow}>
                  <span>{t.inviteUrlLabel}</span>
                  <strong>{typeof window !== 'undefined' ? `${window.location.origin}/${showCredModal.loginId}` : ''}</strong>
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/${showCredModal.loginId}`); showToast(t.copiedToast); }} className={styles.copyBtn}>📋</button>
                </div>
                <div className={styles.credRow}>
                  <span>{t.adminUrlLabel}</span>
                  <strong>{typeof window !== 'undefined' ? `${window.location.origin}/admin` : ''}</strong>
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/admin`); showToast(t.copiedToast); }} className={styles.copyBtn}>📋</button>
                </div>
              </div>
              
              {!hasPassword && (
                <button 
                  className="btn btn-danger" 
                  style={{ width: '100%', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} 
                  onClick={async () => {
                    if (confirm(t.confirmResetPassPrompt)) {
                      await handleResetPassword(showCredModal.id);
                    }
                  }}
                >
                  {t.genNewPassBtn}
                </button>
              )}

              <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setShowCredModal(null)}>{t.closeBtn}</button>
            </div>
          </div>
        );
      })()}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="popup-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <h3>{t.delCoupleTitle}</h3>
            <p>{t.delCoupleDesc1} <strong>{t.delCoupleDesc2}</strong> {t.delCoupleDesc3}</p>
            <div className={styles.confirmBtns}>
              <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)}>{t.cancelBtn}</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>{t.confirmDeleteBtn}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Payment Confirm Modal */}
      {deletePaymentConfirm && (
        <div className="popup-overlay" onClick={() => setDeletePaymentConfirm(null)}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <h3>{t.delPaymentTitle}</h3>
            <p>{t.delPaymentDesc}</p>
            <div className={styles.confirmBtns}>
              <button className="btn btn-outline" onClick={() => setDeletePaymentConfirm(null)}>{t.cancelBtn}</button>
              <button className="btn btn-danger" onClick={() => handleDeletePayment(deletePaymentConfirm)}>{t.confirmDeleteBtn}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {editPayment && (
        <EditPaymentModal
          t={t}
          payment={editPayment}
          onClose={() => setEditPayment(null)}
          onUpdated={() => {
            setEditPayment(null);
            fetchPayments();
            showToast(t.paymentUpdatedToast);
          }}
        />
      )}

      {/* Add Payment Modal */}
      {showAddPaymentModal && (
        <AddPaymentModal
          t={t}
          couples={couples}
          onClose={() => setShowAddPaymentModal(false)}
          onCreated={() => {
            setShowAddPaymentModal(false);
            fetchPayments();
            showToast(t.paymentRecordedToast);
          }}
        />
      )}

      {/* Account Modal */}
      {showAccountModal && (
        <AccountModal
          t={t}
          onClose={() => setShowAccountModal(false)}
          onSuccess={() => {
            setShowAccountModal(false);
            showToast(t.passChangedSuccessToast);
          }}
        />
      )}

      {/* Toast */}
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}

function AddCoupleModal({ onClose, onCreated, t }: {
  onClose: () => void;
  onCreated: (cred: { loginId: string; password: string; id: string }) => void;
  t: Record<string, string>;
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
          <h3>{t.addCoupleModalTitle}</h3>
          <button className="popup-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.addForm}>
          <div className={styles.formRow}>
            <div className="form-group">
              <label>{t.groomNameLabel}</label>
              <input className="form-control" placeholder={t.groomPlaceholder} value={form.groomName} onChange={e => setForm(f => ({ ...f, groomName: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>{t.brideNameLabel}</label>
              <input className="form-control" placeholder={t.bridePlaceholder} value={form.brideName} onChange={e => setForm(f => ({ ...f, brideName: e.target.value }))} required />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className="form-group">
              <label>{t.weddingDateLabel}</label>
              <input className="form-control" type="date" value={form.weddingDate} onChange={e => setForm(f => ({ ...f, weddingDate: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>{t.themeLabel}</label>
              <select className="form-control" value={form.theme} onChange={e => setForm(f => ({ ...f, theme: e.target.value }))}>
                {themes.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className="form-group">
              <label>{t.pkgSubLabel2}</label>
              <select 
                className="form-control" 
                value={form.packageKey} 
                onChange={e => {
                  const val = e.target.value;
                  const pkg = AVAILABLE_PACKAGES.find(p => p.key === val);
                  setForm(f => ({ ...f, packageKey: val, customDays: pkg ? pkg.days : '30' }));
                }} 
                required
              >
                {AVAILABLE_PACKAGES.map(p => (
                  <option key={p.key} value={p.key}>{t['pkg_' + p.key] || p.key}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t.activeDaysLabel}</label>
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
              <label>{t.regFeeLabel}</label>
              <input className="form-control" type="number" min="0" placeholder="0.00" value={form.amountPaid} onChange={e => setForm(f => ({ ...f, amountPaid: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>{t.customPassLabel}</label>
              <input className="form-control" placeholder={t.randPassPlaceholder} value={form.customPassword} onChange={e => setForm(f => ({ ...f, customPassword: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label>{t.customLoginIdLabel}</label>
            <input className="form-control" placeholder={t.loginIdPlaceholder} value={form.customLoginId} onChange={e => setForm(f => ({ ...f, customLoginId: e.target.value.toLowerCase().replace(/\s/g, '-') }))} />
          </div>
          {error && <div style={{ color: '#e87c6f', fontSize: '0.85rem', background: 'rgba(192,57,43,.1)', padding: '0.6rem', borderRadius: '8px' }}>{error}</div>}
          <div className={styles.addModalFooter}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t.creatingStatus : t.createCoupleBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddPaymentModal({ couples, onClose, onCreated, t }: {
  couples: CoupleRow[];
  onClose: () => void;
  onCreated: () => void;
  t: Record<string, string>;
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
    } catch { setError(t.genericRetry); }
    finally { setLoading(false); }
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className={styles.addModal} style={{ maxWidth: '460px' }} onClick={e => e.stopPropagation()}>
        <div className={styles.addModalHeader}>
          <h3>{t.addPaymentModalTitle}</h3>
          <button className="popup-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.addForm}>
          <div className="form-group">
            <label>{t.coupleNameLabel2}</label>
            <select className="form-control" value={form.coupleId} onChange={e => setForm(f => ({ ...f, coupleId: e.target.value }))}>
              <option value="">{t.coupleSelectDefault}</option>
              {couples.map(c => (
                <option key={c.id} value={c.id}>{c.groomName} &amp; {c.brideName} ({c.loginId})</option>
              ))}
            </select>
          </div>
          <div className={styles.formRow}>
            <div className="form-group">
              <label>{t.amountLabelFull}</label>
              <input className="form-control" type="number" step="0.01" min="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Perihalan Pakej / Nama</label>
              <input className="form-control" placeholder="cth: Pembaharuan 30 Hari" value={form.packageName} onChange={e => setForm(f => ({ ...f, packageName: e.target.value }))} required />
            </div>
          </div>
          <div className="form-group">
            <label>{t.notesOptLabel}</label>
            <textarea className="form-control" rows={3} placeholder={t.notesPlaceholder} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          {error && <div style={{ color: '#e87c6f', fontSize: '0.85rem', background: 'rgba(192,57,43,.1)', padding: '0.6rem', borderRadius: '8px' }}>{error}</div>}
          <div className={styles.addModalFooter}>
            <button type="button" className="btn btn-outline" onClick={onClose}>{t.generalCancelBtn}</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t.recordingStatus : t.recordPaymentBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditPaymentModal({
  payment,
  onClose,
  onUpdated,
  t,
}: {
  payment: PaymentRow;
  onClose: () => void;
  onUpdated: () => void;
  t: Record<string, string>;
}) {
  const [form, setForm] = useState({
    amount: payment.amount.toString(),
    packageName: payment.packageName,
    notes: payment.notes,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/super-admin/payments/${payment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      onUpdated();
    } catch { setError(t.genericRetry); }
    finally { setLoading(false); }
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className={styles.addModal} style={{ maxWidth: '460px' }} onClick={e => e.stopPropagation()}>
        <div className={styles.addModalHeader}>
          <h3>{t.editPaymentModalTitle}</h3>
          <button className="popup-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.addForm}>
          <div className="form-group">
            <label>{t.coupleNameLockedLabel}</label>
            <input className="form-control" type="text" value={payment.coupleName} disabled style={{ opacity: 0.7 }} />
          </div>
          <div className={styles.formRow}>
            <div className="form-group">
              <label>{t.amountLabelFull}</label>
              <input className="form-control" type="number" step="0.01" min="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Perihalan Pakej / Nama</label>
              <input className="form-control" placeholder="cth: Pembaharuan 30 Hari" value={form.packageName} onChange={e => setForm(f => ({ ...f, packageName: e.target.value }))} required />
            </div>
          </div>
          <div className="form-group">
            <label>{t.notesOptLabel}</label>
            <textarea className="form-control" rows={3} placeholder={t.editNotesPlaceholder} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          {error && <div style={{ color: '#e87c6f', fontSize: '0.85rem', background: 'rgba(192,57,43,.1)', padding: '0.6rem', borderRadius: '8px' }}>{error}</div>}
          <div className={styles.addModalFooter}>
            <button type="button" className="btn btn-outline" onClick={onClose}>{t.generalCancelBtn}</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t.savingStatus : t.updateProfileBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditCoupleModal({ couple, onClose, onUpdated, t }: { couple: CoupleRow; onClose: () => void; onUpdated: () => void; t: Record<string, string>; }) {
  const [form, setForm] = useState({
    packageName: couple.packageName || '',
    expiresAt: couple.expiresAt ? new Date(couple.expiresAt).toISOString().split('T')[0] : '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/super-admin/couples/${couple.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageName: form.packageName,
          expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      onUpdated();
    } catch { setError(t.genericRetry); }
    finally { setLoading(false); }
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className={styles.addModal} style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
        <div className={styles.addModalHeader}>
          <h3>{t.editCoupleModalTitle}</h3>
          <button className="popup-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.addForm}>
          <div className="form-group">
            <label>{t.packageLabel || 'Pakej'}</label>
            <input className="form-control" type="text" placeholder={t.pkgNamePlaceholder} value={form.packageName} onChange={e => setForm(f => ({ ...f, packageName: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>{t.expDateLabel || 'Expiry'}</label>
            <input className="form-control" type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} required />
          </div>
          {error && <div style={{ color: '#e87c6f', fontSize: '0.85rem', background: 'rgba(192,57,43,.1)', padding: '0.6rem', borderRadius: '8px' }}>{error}</div>}
          <div className={styles.addModalFooter}>
            <button type="button" className="btn btn-outline" onClick={onClose}>{t.generalCancelBtn}</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t.savingStatus : t.updateProfileBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AccountModal({ onClose, onSuccess, t }: { onClose: () => void; onSuccess: () => void; t: Record<string, string> }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError(t.passMismatchError);
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
        setError(data.error || t.genericError);
        return;
      }
      onSuccess();
    } catch {
      setError(t.connErrorRetry);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className={styles.confirmModal} style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
        <div className={styles.addModalHeader} style={{ padding: '0 0 1rem', borderBottom: '1px solid rgba(255,255,255,.08)', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0 }}>{t.manageAccountModalTitle}</h3>
          <button className="popup-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>{t.currPassLabel}</label>
            <input
              type="password"
              className="form-control"
              placeholder={t.currPassPlaceholder}
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>{t.newPassLabel}</label>
            <input
              type="password"
              className="form-control"
              placeholder={t.newPassPlaceholder}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>{t.confirmPassLabel}</label>
            <input
              type="password"
              className="form-control"
              placeholder={t.confirmPassPlaceholder}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <div style={{ color: '#e87c6f', fontSize: '0.85rem', background: 'rgba(192,57,43,.1)', padding: '0.65rem 0.9rem', borderRadius: '8px' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>{t.generalCancelBtn}</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t.changingPassStatus : t.changePassBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FeatureTogglesModal({
  couple,
  onClose,
  onUpdated,
  t,
}: {
  couple: CoupleRow;
  onClose: () => void;
  onUpdated: () => void;
  t: Record<string, string>;
}) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    enableFloatingNav: couple.featureToggles?.enableFloatingNav ?? true,
    enableCalendar: couple.featureToggles?.enableCalendar ?? true,
    enableRsvp: couple.featureToggles?.enableRsvp ?? true,
    enableMoney: couple.featureToggles?.enableMoney ?? true,
    enableGift: couple.featureToggles?.enableGift ?? true,
    enableGallery: couple.featureToggles?.enableGallery ?? true,
    enableProgramme: couple.featureToggles?.enableProgramme ?? true,
    enableContact: couple.featureToggles?.enableContact ?? true,
    enableLocation: couple.featureToggles?.enableLocation ?? true,
    enableDesignBuilder: couple.featureToggles?.enableDesignBuilder ?? true,
    enableMusic: couple.featureToggles?.enableMusic ?? true,
    enableTextOverrides: couple.featureToggles?.enableTextOverrides ?? true,
    enableGateSection: couple.featureToggles?.enableGateSection ?? true,
    enableHeroSection: couple.featureToggles?.enableHeroSection ?? true,
    enableParentsSection: couple.featureToggles?.enableParentsSection ?? true,
    enableCountdownSection: couple.featureToggles?.enableCountdownSection ?? true,
    enableProgrammeSection: couple.featureToggles?.enableProgrammeSection ?? true,
    enableGallerySection: couple.featureToggles?.enableGallerySection ?? true,
    enableMessageSection: couple.featureToggles?.enableMessageSection ?? true,
    enableClosingSection: couple.featureToggles?.enableClosingSection ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/super-admin/couples/${couple.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureToggles: toggles }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Ralat berlaku.');
        return;
      }
      onUpdated();
    } catch {
      setError('Ralat sambungan.');
    } finally {
      setLoading(false);
    }
  }

  const moduleItems = [
    { key: 'enableFloatingNav', label: '🧭 Bar Navigasi Terapung (Floating Nav)' },
    { key: 'enableCalendar', label: '📅 Menu Kalendar' },
    { key: 'enableRsvp', label: t.toggleRsvp || '📨 Modul & Tab RSVP' },
    { key: 'enableMoney', label: t.toggleMoney || '💰 Modul Sumbangan Bank & QR' },
    { key: 'enableGift', label: t.toggleGift || '🎁 Modul Senarai Hadiah & Wishlist' },
    { key: 'enableGallery', label: t.toggleGallery || '📸 Modul Galeri Foto & Ucapan' },
    { key: 'enableProgramme', label: t.toggleProgramme || '📋 Modul Aturcara Majlis' },
    { key: 'enableContact', label: t.toggleContact || '📞 Modul Senarai Kenalan Keluarga' },
    { key: 'enableLocation', label: t.toggleLocation || '📍 Modul Lokasi & Peta Waze' },
    { key: 'enableDesignBuilder', label: t.toggleDesignBuilder || '✨ Tab Perekabentuk Visual Skrin' },
    { key: 'enableMusic', label: t.toggleMusic || '🎵 Modul Muzik Latar' },
    { key: 'enableTextOverrides', label: '✏️ Kebenaran Sunting Teks Global' },
  ];

  const sectionItems = [
    { key: 'enableGateSection', label: '🚪 Skrin Pintu Gerbang (Gate Screen)' },
    { key: 'enableHeroSection', label: '💌 Skrin Utama Kad Jemputan' },
    { key: 'enableParentsSection', label: '👨‍👩‍👧 Skrin Ibu Bapa & Keluarga' },
    { key: 'enableCountdownSection', label: '⏳ Skrin Pengiraan Masa (Countdown)' },
    { key: 'enableProgrammeSection', label: '📋 Skrin Aturcara Majlis' },
    { key: 'enableGallerySection', label: '🖼️ Skrin Galeri Foto & Ucapan' },
    { key: 'enableMessageSection', label: '✍️ Skrin Mesej Khas Pasangan' },
    { key: 'enableClosingSection', label: '🌸 Skrin Penutup Kad Jemputan' },
  ];

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className={styles.addModal} style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
        <div className={styles.addModalHeader}>
          <h3>{t.featureTogglesModalTitle || '⚙️ Urus Ciri & Kebenaran Laman'}</h3>
          <button className="popup-close" onClick={onClose}>✕</button>
        </div>
        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', margin: '0 0 1rem' }}>
          {t.featureTogglesDesc || 'Aktifkan atau nyahaktifkan modul dan alat khusus untuk pasangan ini.'} (<strong>{couple.groomName} &amp; {couple.brideName}</strong>)
        </p>
        <form onSubmit={handleSubmit} className={styles.addForm}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            <div>
              <h5 style={{ margin: '0 0 0.5rem', color: '#C9A84C', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                📦 Modul Ciri & Kebenaran Admin
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {moduleItems.map(item => (
                  <label key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0.8rem', background: 'var(--admin-stat-bg)', borderRadius: '8px', border: '1px solid var(--admin-border)', cursor: 'pointer' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--admin-text)', fontWeight: 500 }}>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={toggles[item.key] ?? true}
                      onChange={e => setToggles(prev => ({ ...prev, [item.key]: e.target.checked }))}
                      style={{ width: 17, height: 17, cursor: 'pointer', accentColor: 'var(--admin-accent)' }}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h5 style={{ margin: '0 0 0.5rem', color: '#C9A84C', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🖥️ Paparan Skrin Laman Web Live
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sectionItems.map(item => (
                  <label key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0.8rem', background: 'var(--admin-stat-bg)', borderRadius: '8px', border: '1px solid var(--admin-border)', cursor: 'pointer' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--admin-text)', fontWeight: 500 }}>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={toggles[item.key] ?? true}
                      onChange={e => setToggles(prev => ({ ...prev, [item.key]: e.target.checked }))}
                      style={{ width: 17, height: 17, cursor: 'pointer', accentColor: 'var(--admin-accent)' }}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {error && <div style={{ color: '#e87c6f', fontSize: '0.85rem', background: 'rgba(192,57,43,.1)', padding: '0.6rem', borderRadius: '8px', marginTop: '0.5rem' }}>{error}</div>}

          <div className={styles.addModalFooter} style={{ marginTop: '1rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>{t.generalCancelBtn}</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : '✓ Simpan Ciri'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


