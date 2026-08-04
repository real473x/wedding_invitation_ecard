'use client';
import React, { useState } from 'react';
import { WeddingConfig, SectionStyle, PageStyles } from '@/lib/db';
import { TRANSITION_PRESETS } from '@/lib/transitions';
import { BORDER_PRESETS, CORNER_PRESETS } from '@/lib/decorations';
import { FONT_PAIRINGS, HEADING_FONTS, BODY_FONTS, SCRIPT_FONTS } from '@/lib/typography';
import styles from '@/app/admin/admin.module.css';

interface DesignBuilderTabProps {
  config: WeddingConfig;
  update: (fields: Partial<WeddingConfig>) => void;
  lang: 'ms' | 'en';
  t: Record<string, string>;
}

const SECTION_LABELS: Record<string, { labelMs: string; labelEn: string; icon: string }> = {
  gate: { labelMs: 'Skrin Pembuka (Gate)', labelEn: 'Gate Screen', icon: '🚪' },
  invitation: { labelMs: 'Jemputan Utama (Hero)', labelEn: 'Invitation Hero', icon: '💍' },
  parents: { labelMs: 'Hormat Keluarga', labelEn: 'Parents & Family', icon: '👨‍👩‍👧' },
  countdown: { labelMs: 'Tarikh & Masa (Countdown)', labelEn: 'Date & Countdown', icon: '⏳' },
  programme: { labelMs: 'Aturcara Majlis', labelEn: 'Programme', icon: '📋' },
  gallery: { labelMs: 'Galeri & Ucapan', labelEn: 'Gallery & Wishes', icon: '🖼️' },
  message: { labelMs: 'Mesej Pengantin', labelEn: 'Couple Message', icon: '💬' },
  closing: { labelMs: 'Penutup (Closing)', labelEn: 'Closing Screen', icon: '🌸' },
};

export default function DesignBuilderTab({ config, update, lang, t }: DesignBuilderTabProps) {
  const [activeSection, setActiveSection] = useState<string>('invitation');

  const pageStyles: PageStyles = config.pageStyles || {};
  const currentSectionStyle: SectionStyle = pageStyles[activeSection as keyof PageStyles] || {};

  function updateSectionStyle(updates: Partial<SectionStyle>) {
    const updatedPageStyles: PageStyles = {
      ...pageStyles,
      [activeSection]: {
        ...currentSectionStyle,
        ...updates,
      },
    };
    update({ pageStyles: updatedPageStyles });
  }

  function resetCurrentSection() {
    const updatedPageStyles: PageStyles = {
      ...pageStyles,
      [activeSection]: {
        transition: 'fade',
        borderStyle: 'none',
        borderColor: '#C9A84C',
        borderWidth: 1,
        headingStyle: undefined,
        bodyStyle: undefined,
        accentStyle: undefined,
        overlayOpacity: 50,
        overlayColor: '#000000',
      },
    };
    update({ pageStyles: updatedPageStyles });
    clearHoverPreview();
  }

  function resetAllSections() {
    if (window.confirm(lang === 'en' ? 'Reset all section design styles back to standard theme defaults?' : 'Set semula SEMUA skrin reka bentuk ke tetapan asal tema standard?')) {
      update({ pageStyles: {} });
      clearHoverPreview();
    }
  }

  function applyFontPairing(pairingKey: string) {
    const pairing = FONT_PAIRINGS.find((p) => p.key === pairingKey);
    if (!pairing) return;

    updateSectionStyle({
      headingStyle: { ...(currentSectionStyle.headingStyle || {}), fontFamily: pairing.heading },
      bodyStyle: { ...(currentSectionStyle.bodyStyle || {}), fontFamily: pairing.body },
      accentStyle: { ...(currentSectionStyle.accentStyle || {}), fontFamily: pairing.script },
    });
  }

  function sendSelectSection(secKey: string) {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        {
          type: 'PREVIEW_SELECT_SECTION',
          sectionId: secKey,
        },
        '*'
      );
    }
  }

  function sendHoverPreview(opts?: {
    transitionKey?: string;
    borderStyle?: string;
    headingFont?: string;
    bodyFont?: string;
    accentFont?: string;
    overlayOpacity?: number;
    overlayColor?: string;
  }) {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        {
          type: 'PREVIEW_HOVER_STYLE',
          sectionId: activeSection,
          ...opts,
        },
        '*'
      );
    }
  }

  function clearHoverPreview() {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'PREVIEW_CLEAR_HOVER' }, '*');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginTop: '-0.5rem' }}>
        {lang === 'en'
          ? 'Customize individual page styles: transition effects, ornate borders, custom Google fonts, background overlays, and card colors. Hover over options to preview live!'
          : 'Suaikan gaya setiap skrin individu: animasi peralihan (transitions), bingkai ukiran, tipografi Google Fonts, dan kejelasan latar belakang. Halakan tetikus untuk lihat pratonton langsung!'}
      </p>

      {/* Section selector tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid var(--admin-border)',
        }}
      >
        {Object.entries(SECTION_LABELS).map(([secKey, secMeta]) => {
          const isActive = activeSection === secKey;
          return (
            <button
              key={secKey}
              onClick={() => {
                setActiveSection(secKey);
                sendSelectSection(secKey);
              }}
              style={{
                background: isActive ? 'rgba(201,168,76,0.15)' : 'var(--admin-stat-bg)',
                border: `1px solid ${isActive ? '#C9A84C' : 'var(--admin-border)'}`,
                color: isActive ? '#C9A84C' : 'var(--admin-text)',
                padding: '0.5rem 0.85rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              <span>{secMeta.icon}</span>
              <span>{lang === 'en' ? secMeta.labelEn : secMeta.labelMs}</span>
            </button>
          );
        })}
      </div>

      {/* Top action bar: Section reset & All section reset */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.6rem 0.85rem', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--admin-text)', fontWeight: 600 }}>
          {SECTION_LABELS[activeSection]?.icon} {lang === 'en' ? SECTION_LABELS[activeSection]?.labelEn : SECTION_LABELS[activeSection]?.labelMs}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={resetCurrentSection}
            style={{
              background: 'rgba(128,128,128,0.1)',
              border: '1px solid var(--admin-border)',
              color: 'var(--admin-text-muted)',
              fontSize: '0.74rem',
              padding: '0.3rem 0.65rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
            title={t.resetScreenSettingsTooltip}
          >
            ↺ {lang === 'en' ? 'Reset Current Section' : 'Set Semula Skrin Ini'}
          </button>
          <button
            onClick={resetAllSections}
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#f87171',
              fontSize: '0.74rem',
              padding: '0.3rem 0.65rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
            title={t.resetAllScreensTooltip}
          >
            🗑️ {lang === 'en' ? 'Reset All Sections' : 'Set Semula Semua Skrin'}
          </button>
        </div>
      </div>

      {/* Current section editor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* 🎬 TRANSITION EFFECTS */}
        <div style={{ background: 'var(--admin-stat-bg)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ color: '#C9A84C', fontSize: '0.92rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🎬 {lang === 'en' ? 'Page Transition Effect' : 'Kesan Peralihan Skrin (Transition)'}
              </h4>
              <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(234,179,8,0.15)', color: '#eab308', border: '1px solid rgba(234,179,8,0.3)', fontWeight: 700 }}>
                🧪 Experimental
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--admin-text-muted)', cursor: 'pointer', margin: 0 }}>
                <span>{currentSectionStyle.transition === 'none' ? 'OFF (Nyahaktif)' : 'ON (Aktif)'}</span>
                <label className="toggle-switch" style={{ transform: 'scale(0.75)', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={currentSectionStyle.transition !== 'none'}
                    onChange={(e) => updateSectionStyle({ transition: e.target.checked ? 'fade' : 'none' })}
                  />
                  <span className="toggle-slider" />
                </label>
              </label>
              <button
                onClick={() => updateSectionStyle({ transition: 'fade' })}
                style={{
                  background: 'none',
                  border: '1px solid var(--admin-border)',
                  color: 'var(--admin-text-muted)',
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                ↺ Default (Pudar)
              </button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.6rem', opacity: currentSectionStyle.transition === 'none' ? 0.45 : 1, pointerEvents: currentSectionStyle.transition === 'none' ? 'none' : 'auto' }}>
            {TRANSITION_PRESETS.map((tr) => {
              const selected = (currentSectionStyle.transition || 'fade') === tr.key;
              return (
                <button
                  key={tr.key}
                  onClick={() => updateSectionStyle({ transition: tr.key })}
                  onMouseEnter={() => sendHoverPreview({ transitionKey: tr.key })}
                  onMouseLeave={clearHoverPreview}
                  style={{
                    background: selected ? 'rgba(201,168,76,0.18)' : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${selected ? '#C9A84C' : 'var(--admin-border)'}`,
                    borderRadius: '12px',
                    padding: '0.75rem 0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{tr.icon}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: selected ? '#C9A84C' : 'var(--admin-text)' }}>
                    {lang === 'en' ? tr.labelEn : tr.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 🎨 BORDER & FRAMES */}
        <div style={{ background: 'var(--admin-stat-bg)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ color: '#C9A84C', fontSize: '0.92rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🖼️ {lang === 'en' ? 'Decorative Frame & Borders' : 'Bingkai Hiasan & Ukiran'}
              </h4>
              <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(234,179,8,0.15)', color: '#eab308', border: '1px solid rgba(234,179,8,0.3)', fontWeight: 700 }}>
                🧪 Experimental
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--admin-text-muted)', cursor: 'pointer', margin: 0 }}>
                <span>{currentSectionStyle.borderStyle && currentSectionStyle.borderStyle !== 'none' ? 'ON (Aktif)' : 'OFF (Nyahaktif)'}</span>
                <label className="toggle-switch" style={{ transform: 'scale(0.75)', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={Boolean(currentSectionStyle.borderStyle && currentSectionStyle.borderStyle !== 'none')}
                    onChange={(e) => updateSectionStyle({ borderStyle: e.target.checked ? 'ornate-gold' : 'none' })}
                  />
                  <span className="toggle-slider" />
                </label>
              </label>
              <button
                onClick={() => updateSectionStyle({ borderStyle: 'none', borderColor: undefined, borderWidth: 1 })}
                style={{
                  background: 'none',
                  border: '1px solid var(--admin-border)',
                  color: 'var(--admin-text-muted)',
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                ↺ Default (Tiada Bingkai)
              </button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.6rem', marginBottom: '1rem', opacity: (!currentSectionStyle.borderStyle || currentSectionStyle.borderStyle === 'none') ? 0.45 : 1, pointerEvents: (!currentSectionStyle.borderStyle || currentSectionStyle.borderStyle === 'none') ? 'none' : 'auto' }}>
            {BORDER_PRESETS.map((bd) => {
              const selected = (currentSectionStyle.borderStyle || 'none') === bd.key;
              return (
                <button
                  key={bd.key}
                  onClick={() => updateSectionStyle({ borderStyle: bd.key })}
                  onMouseEnter={() => sendHoverPreview({ borderStyle: bd.key })}
                  onMouseLeave={clearHoverPreview}
                  style={{
                    background: selected ? 'rgba(201,168,76,0.18)' : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${selected ? '#C9A84C' : 'var(--admin-border)'}`,
                    borderRadius: '12px',
                    padding: '0.75rem 0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '1.3rem' }}>{bd.icon}</span>
                  <span style={{ fontSize: '0.76rem', fontWeight: 600, color: selected ? '#C9A84C' : 'var(--admin-text)' }}>
                    {lang === 'en' ? bd.labelEn : bd.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Border color & thickness */}
          {currentSectionStyle.borderStyle && currentSectionStyle.borderStyle !== 'none' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--admin-border)' }}>
              <div className="form-group">
                <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                  {lang === 'en' ? 'Border Color' : 'Warna Garisan Bingkai'}
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={currentSectionStyle.borderColor || '#C9A84C'}
                    onChange={(e) => updateSectionStyle({ borderColor: e.target.value })}
                    style={{ width: '36px', height: '36px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'none' }}
                  />
                  <input
                    className="form-control"
                    type="text"
                    value={currentSectionStyle.borderColor || '#C9A84C'}
                    onChange={(e) => updateSectionStyle({ borderColor: e.target.value })}
                    style={{ fontSize: '0.82rem' }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                  {lang === 'en' ? `Border Thickness (${currentSectionStyle.borderWidth || 1}px)` : `Ketebalan Garisan (${currentSectionStyle.borderWidth || 1}px)`}
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={currentSectionStyle.borderWidth || 1}
                  onChange={(e) => updateSectionStyle({ borderWidth: parseInt(e.target.value, 10) })}
                  style={{ width: '100%', accentColor: '#C9A84C' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 🖋️ TYPOGRAPHY & FONTS */}
        <div style={{ background: 'var(--admin-stat-bg)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ color: '#C9A84C', fontSize: '0.92rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🖋️ {lang === 'en' ? 'Typography & Custom Google Fonts' : 'Tipografi & Pilihan Font Google'}
              </h4>
              <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(234,179,8,0.15)', color: '#eab308', border: '1px solid rgba(234,179,8,0.3)', fontWeight: 700 }}>
                🧪 Experimental
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--admin-text-muted)', cursor: 'pointer', margin: 0 }}>
                <span>{Boolean(currentSectionStyle.headingStyle || currentSectionStyle.bodyStyle || currentSectionStyle.accentStyle) ? 'ON (Aktif)' : 'OFF (Nyahaktif)'}</span>
                <label className="toggle-switch" style={{ transform: 'scale(0.75)', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={Boolean(currentSectionStyle.headingStyle || currentSectionStyle.bodyStyle || currentSectionStyle.accentStyle)}
                    onChange={(e) => {
                      if (!e.target.checked) {
                        updateSectionStyle({ headingStyle: undefined, bodyStyle: undefined, accentStyle: undefined });
                      } else {
                        applyFontPairing('classic');
                      }
                    }}
                  />
                  <span className="toggle-slider" />
                </label>
              </label>
              <button
                onClick={() => updateSectionStyle({ headingStyle: undefined, bodyStyle: undefined, accentStyle: undefined })}
                style={{
                  background: 'none',
                  border: '1px solid var(--admin-border)',
                  color: 'var(--admin-text-muted)',
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                ↺ Default (Font Tema)
              </button>
            </div>
          </div>

          <div style={{ opacity: !Boolean(currentSectionStyle.headingStyle || currentSectionStyle.bodyStyle || currentSectionStyle.accentStyle) ? 0.45 : 1, pointerEvents: !Boolean(currentSectionStyle.headingStyle || currentSectionStyle.bodyStyle || currentSectionStyle.accentStyle) ? 'none' : 'auto' }}>
            {/* Quick Font Pairings */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--admin-text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>
                ⚡ {lang === 'en' ? 'Quick Font Pairings' : 'Set Gabungan Font Segera (Preset)'}
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {FONT_PAIRINGS.map((fp) => (
                  <button
                    key={fp.key}
                    onClick={() => applyFontPairing(fp.key)}
                    onMouseEnter={() => sendHoverPreview({ headingFont: fp.heading, bodyFont: fp.body, accentFont: fp.script })}
                    onMouseLeave={clearHoverPreview}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--admin-border)',
                      color: 'var(--admin-text)',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {fp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Individual font pickers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {/* Heading Font */}
              <div className="form-group">
                <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                  {lang === 'en' ? 'Heading Font' : 'Font Tajuk (Heading)'}
                </label>
                <select
                  className="form-control"
                  value={currentSectionStyle.headingStyle?.fontFamily || ''}
                  onChange={(e) =>
                    updateSectionStyle({
                      headingStyle: { ...(currentSectionStyle.headingStyle || {}), fontFamily: e.target.value },
                    })
                  }
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="">-- {lang === 'en' ? 'Default Theme Font' : 'Ikut Font Tema Standard'} --</option>
                  {HEADING_FONTS.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Script Accent Font */}
              <div className="form-group">
                <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                  {lang === 'en' ? 'Script / Accent Font' : 'Font Tulisan Tangan (Script)'}
                </label>
                <select
                  className="form-control"
                  value={currentSectionStyle.accentStyle?.fontFamily || ''}
                  onChange={(e) =>
                    updateSectionStyle({
                      accentStyle: { ...(currentSectionStyle.accentStyle || {}), fontFamily: e.target.value },
                    })
                  }
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="">-- {lang === 'en' ? 'Default Theme Font' : 'Ikut Font Tema Standard'} --</option>
                  {SCRIPT_FONTS.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Body Font */}
              <div className="form-group">
                <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                  {lang === 'en' ? 'Body Text Font' : 'Font Teks Kandungan (Body)'}
                </label>
                <select
                  className="form-control"
                  value={currentSectionStyle.bodyStyle?.fontFamily || ''}
                  onChange={(e) =>
                    updateSectionStyle({
                      bodyStyle: { ...(currentSectionStyle.bodyStyle || {}), fontFamily: e.target.value },
                    })
                  }
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="">-- {lang === 'en' ? 'Default Theme Font' : 'Ikut Font Tema Standard'} --</option>
                  {BODY_FONTS.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 🖼️ OVERLAY & BACKGROUND DARKNESS */}
        <div style={{ background: 'var(--admin-stat-bg)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ color: '#C9A84C', fontSize: '0.92rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🖼️ {lang === 'en' ? 'Background Darkness & Overlay' : 'Kejelapan Latar Belakang (Overlay Darkness)'}
              </h4>
              <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(234,179,8,0.15)', color: '#eab308', border: '1px solid rgba(234,179,8,0.3)', fontWeight: 700 }}>
                🧪 Experimental
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--admin-text-muted)', cursor: 'pointer', margin: 0 }}>
                <span>{(currentSectionStyle.overlayOpacity ?? 50) > 0 ? 'ON (Aktif)' : 'OFF (Nyahaktif)'}</span>
                <label className="toggle-switch" style={{ transform: 'scale(0.75)', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={(currentSectionStyle.overlayOpacity ?? 50) > 0}
                    onChange={(e) => updateSectionStyle({ overlayOpacity: e.target.checked ? 50 : 0 })}
                  />
                  <span className="toggle-slider" />
                </label>
              </label>
              <button
                onClick={() => updateSectionStyle({ overlayOpacity: 50, overlayColor: '#000000' })}
                style={{
                  background: 'none',
                  border: '1px solid var(--admin-border)',
                  color: 'var(--admin-text-muted)',
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                ↺ Default (50% Hitam)
              </button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                {lang === 'en'
                  ? `Overlay Opacity (${currentSectionStyle.overlayOpacity ?? 50}%)`
                  : `Kejelasan Lapisan Latar (${currentSectionStyle.overlayOpacity ?? 50}%)`}
              </label>
              <input
                type="range"
                min="0"
                max="90"
                value={currentSectionStyle.overlayOpacity ?? 50}
                onChange={(e) => updateSectionStyle({ overlayOpacity: parseInt(e.target.value, 10) })}
                style={{ width: '100%', accentColor: '#C9A84C' }}
              />
            </div>
            <div className="form-group">
              <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                {lang === 'en' ? 'Overlay Tint Color' : 'Warna Ton Overlay'}
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={currentSectionStyle.overlayColor || '#000000'}
                  onChange={(e) => updateSectionStyle({ overlayColor: e.target.value })}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'none' }}
                />
                <input
                  className="form-control"
                  type="text"
                  value={currentSectionStyle.overlayColor || '#000000'}
                  onChange={(e) => updateSectionStyle({ overlayColor: e.target.value })}
                  style={{ fontSize: '0.82rem' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
