'use client';
import React, { useState } from 'react';
import { WeddingConfig, SectionStyle, PageStyles, PageElementStyle } from '@/lib/db';
import { TRANSITION_PRESETS } from '@/lib/transitions';
import { BORDER_PRESETS, CORNER_PRESETS } from '@/lib/decorations';
import { FONT_PAIRINGS, HEADING_FONTS, BODY_FONTS, SCRIPT_FONTS } from '@/lib/typography';
import styles from '@/app/admin/admin.module.css';

interface DesignBuilderTabProps {
  config: WeddingConfig;
  update: (fields: Partial<WeddingConfig>) => void;
  lang: 'ms' | 'en';
  t: Record<string, string>;
  onSave?: () => void;
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

const SECTION_TEXT_TARGETS: Record<string, { headingTarget: string; accentTarget: string; bodyTarget: string }> = {
  gate: {
    headingTarget: 'Tajuk Buka Sampul / Kepada Tetamu (Walimatulurus / Dear Guest)',
    accentTarget: 'Simbol Hiasan & Sentuhan Seni Skrin Pembuka',
    bodyTarget: 'Teks Tarikh Pembuka & Arahan Klik',
  },
  invitation: {
    headingTarget: 'Nama Pengantin Lelaki & Perempuan (Groom & Bride Full Names)',
    accentTarget: 'Simbol Ampersand (&) & Sub-tajuk Walimatulurus',
    bodyTarget: 'Tarikh, Masa, Nama Lokasi & Petikan Ucapan (Quote)',
  },
  parents: {
    headingTarget: 'Nama Ibu Bapa & Nama Pengantin',
    accentTarget: 'Tajuk Undangan & Kata Hubung "dan"',
    bodyTarget: 'Peranan Ibu Bapa (Bapa/Ibu) & Teks Jemputan Rasmi',
  },
  countdown: {
    headingTarget: 'Tajuk Skrin Kiraan Mundur (Countdown Title)',
    accentTarget: 'Simbol & Angka Hari/Jam/Minit/Saat',
    bodyTarget: 'Label Masa & Teks Butang Tambah Kalendar',
  },
  programme: {
    headingTarget: 'Tajuk Skrin Aturcara Majlis',
    accentTarget: 'Masa Aturcara (e.g. 11:00 AM)',
    bodyTarget: 'Teks Acara & Peristiwa Majlis',
  },
  gallery: {
    headingTarget: 'Tajuk Galeri Foto & Tajuk Rekod Ucapan',
    accentTarget: 'Sub-tajuk Hiasan Galeri',
    bodyTarget: 'Teks Borang Ucapan, Label Input & Mesej Ucapan Tetamu',
  },
  message: {
    headingTarget: 'Tajuk Mesej Pengantin ("Dari Kami Berdua")',
    accentTarget: 'Simbol Petikan Pembuka Quote (“)',
    bodyTarget: 'Teks Perenggan Mesej & Ucapan Pengantin',
  },
  closing: {
    headingTarget: 'Tajuk Skrin Penutup ("Terima Kasih")',
    accentTarget: 'Nama Pasangan Penutup & Hiasan',
    bodyTarget: 'Teks Ucapan Penutup & Pengharapan',
  },
};

interface ElementConfig {
  key: string;
  labelMs: string;
  labelEn: string;
  category: 'headingStyle' | 'accentStyle' | 'bodyStyle';
  getSample: (config: WeddingConfig, t: Record<string, string>) => string;
}

const SECTION_ELEMENTS: Record<string, ElementConfig[]> = {
  gate: [
    { key: 'gateWalimatulurus', labelMs: 'Sub-tajuk Pembuka ("Walimatulurus")', labelEn: 'Gate Subtitle', category: 'accentStyle', getSample: (c, t) => c.textOverrides?.walimatulurus || t.walimatulurus || 'Walimatulurus' },
    { key: 'gateTitle', labelMs: 'Tajuk Utama Skrin Pembuka', labelEn: 'Gate Title', category: 'headingStyle', getSample: (c) => c.textOverrides?.gateTitle || `Perkahwinan ${c.groomName} & ${c.brideName}` },
    { key: 'gateDearGuest', labelMs: 'Teks Tarikh & Tetamu', labelEn: 'Gate Date & Guest Text', category: 'bodyStyle', getSample: (c, t) => c.textOverrides?.gateDate || (c.weddingDate ? `${c.weddingDay || ''}, ${c.weddingDate}` : (t.dearGuest || 'Ari Enam, 26 September 2026')) },
    { key: 'gateOpenBtn', labelMs: '🔘 Butang Buka Kad ("BUKA KAD UCAPAN")', labelEn: 'Open Card Button', category: 'headingStyle', getSample: (c, t) => c.textOverrides?.openInvitation || t.openInvitation || 'Buka Kad Undangan' },
  ],
  invitation: [
    { key: 'subtitle', labelMs: 'Sub-tajuk ("Walimatulurus")', labelEn: 'Subtitle', category: 'accentStyle', getSample: (c, t) => c.textOverrides?.walimatulurus || t.walimatulurus || 'Walimatulurus' },
    { key: 'groom', labelMs: 'Nama Pengantin Lelaki', labelEn: 'Groom Name', category: 'headingStyle', getSample: (c) => c.groomFullName || c.groomName || 'Velarie' },
    { key: 'ampersand', labelMs: 'Simbol Kata Hubung (&)', labelEn: 'Ampersand (&)', category: 'accentStyle', getSample: () => '&' },
    { key: 'bride', labelMs: 'Nama Pengantin Perempuan', labelEn: 'Bride Name', category: 'headingStyle', getSample: (c) => c.brideFullName || c.brideName || 'Nadia' },
    { key: 'dateLabel', labelMs: '📌 Label Header Tarikh ("TARIKH MAJLIS")', labelEn: 'Date Label Text', category: 'bodyStyle', getSample: (c, t) => c.textOverrides?.heroDateLabel || t.heroDateLabel || 'TARIKH MAJLIS' },
    { key: 'dateText', labelMs: 'Teks Tarikh Majlis', labelEn: 'Event Date Value Text', category: 'headingStyle', getSample: (c) => c.textOverrides?.heroDate || (c.weddingDate ? `${c.weddingDay || ''}, ${c.weddingDate}` : 'Ari Enam, September 26, 2026') },
    { key: 'venueLabel', labelMs: '📌 Label Header Tempat ("LOKASI MAJLIS")', labelEn: 'Venue Label Text', category: 'bodyStyle', getSample: (c, t) => c.textOverrides?.heroVenueLabel || t.heroVenueLabel || 'LOKASI MAJLIS' },
    { key: 'venueName', labelMs: 'Nama Tempat / Lokasi Majlis', labelEn: 'Venue Name', category: 'headingStyle', getSample: (c) => c.venue || 'Hotel Magrett' },
    { key: 'venueAddr', labelMs: 'Alamat Lokasi Majlis', labelEn: 'Venue Address', category: 'bodyStyle', getSample: (c) => c.venueAddress || 'Jalan Bukit Bintang...' },
    { key: 'quote', labelMs: 'Petikan Mesej (Quote Text)', labelEn: 'Quote Text', category: 'bodyStyle', getSample: (c) => c.quote || 'Dan di antara tanda-tanda kekuasaan-Nya...' },
    { key: 'quoteSource', labelMs: 'Sumber Petikan Quote', labelEn: 'Quote Source Text', category: 'accentStyle', getSample: (c) => c.quoteSource || 'Surah Ar-Rum: 21' },
    { key: 'heroFrame', labelMs: '🖼️ Bingkai Utama Hero (Hero Frame & Card)', labelEn: 'Hero Card Frame', category: 'headingStyle', getSample: () => '🖼️ Kad Bingkai Utama' },
  ],
  parents: [
    { key: 'syukur', labelMs: 'Tajuk Syukur & Pembuka Undangan', labelEn: 'Opening Title', category: 'headingStyle', getSample: (c, t) => c.textOverrides?.parentsInviting || t.parentsInviting || 'Dengan Penuh Rasa Syukur' },
    { key: 'parentRoleGroom', labelMs: '📌 Label Peranan Lelaki ("IBU BAPA PENGANTIN LELAKI")', labelEn: 'Groom Parents Label', category: 'bodyStyle', getSample: (c, t) => c.textOverrides?.parentsRoleGroom || t.parentsRoleGroom || 'IBU BAPA PENGANTIN LELAKI' },
    { key: 'parentRoleBride', labelMs: '📌 Label Peranan Perempuan ("IBU BAPA PENGANTIN PEREMPUAN")', labelEn: 'Bride Parents Label', category: 'bodyStyle', getSample: (c, t) => c.textOverrides?.parentsRoleBride || t.parentsRoleBride || 'IBU BAPA PENGANTIN PEREMPUAN' },
    { key: 'parentNames', labelMs: 'Nama Ibu Bapa Pengantin', labelEn: 'Parents Names', category: 'headingStyle', getSample: (c) => `${c.groomFatherName || 'Bapa Lelaki'} & ${c.groomMotherName || 'Ibu Lelaki'}` },
    { key: 'inviteText', labelMs: 'Teks Jemputan Rasmi', labelEn: 'Invitation Sentence', category: 'bodyStyle', getSample: (c, t) => c.textOverrides?.parentsInviteLine1 || t.parentsInviteLine1 || 'Memohon Rahmat Allah SWT...' },
    { key: 'coupleNames', labelMs: 'Nama Pasangan Pengantin', labelEn: 'Couple Names', category: 'headingStyle', getSample: (c) => `${c.groomName || 'Pengantin Lelaki'} & ${c.brideName || 'Pengantin Perempuan'}` },
    { key: 'parentsCard', labelMs: '🖼️ Kad Bingkai Ibu Bapa (Parents Section Card)', labelEn: 'Parents Card Frame', category: 'headingStyle', getSample: () => '🖼️ Kad Ibu Bapa' },
  ],
  countdown: [
    { key: 'countdownTitle', labelMs: 'Tajuk Skrin Kiraan Mundur', labelEn: 'Countdown Title', category: 'headingStyle', getSample: (c, t) => c.textOverrides?.countdownTitle || t.countdownTitle || 'Menghitung Hari' },
    { key: 'countdownCalendarCard', labelMs: '📅 Kad Kalendar Majlis (Calendar Card Box)', labelEn: 'Calendar Card Box', category: 'headingStyle', getSample: (c) => c.weddingDate ? `${c.weddingDay || ''}, ${c.weddingDate}` : '📅 Kad Kalendar' },
    { key: 'countdownCircles', labelMs: '⭕ Bulatan Angka Masa (Countdown Digit Circles)', labelEn: 'Countdown Circles', category: 'headingStyle', getSample: () => '26 Hari 12 Jam' },
    { key: 'countdownLabels', labelMs: '📌 Label Unit Masa ("HARI / JAM / MINIT / SAAT")', labelEn: 'Countdown Time Labels', category: 'bodyStyle', getSample: (_, t) => `${t.days || 'Hari'} • ${t.hours || 'Jam'} • ${t.minutes || 'Minit'} • ${t.seconds || 'Saat'}` },
    { key: 'countdownEventDetailsCard', labelMs: '🖼️ Kotak Butiran Masa & Tempat (Event Details Box)', labelEn: 'Event Details Card Box', category: 'headingStyle', getSample: (c) => `🕐 ${c.weddingTime || '04:00 PM'} | 📍 ${c.venue || 'Lokasi'}` },
    { key: 'countdownDetailLabel', labelMs: '📌 Label Header Butiran ("Masa" / "Tempat")', labelEn: 'Details Header Label', category: 'bodyStyle', getSample: () => 'Masa / Tempat' },
    { key: 'countdownDetailValue', labelMs: '⏰ Teks Nilai Masa & Nama Tempat', labelEn: 'Details Main Text Value', category: 'headingStyle', getSample: (c) => `${c.weddingTime || '04:00 PM – 12:00 AM'} | ${c.venue || 'Rh. Sawing'}` },
    { key: 'countdownDetailSub', labelMs: '📍 Teks Alamat Lokasi Tempat', labelEn: 'Details Sub Address Text', category: 'bodyStyle', getSample: (c) => c.venueAddress || 'Batu 23, Jalan Bintulu-Miri' },
  ],
  programme: [
    { key: 'programmeTitle', labelMs: 'Tajuk Aturcara Majlis', labelEn: 'Programme Title', category: 'headingStyle', getSample: (c, t) => c.textOverrides?.eventSchedule || t.eventSchedule || 'Aturcara Majlis' },
    { key: 'programmeTime', labelMs: '⏰ Teks Masa Acara ("11:00 AM")', labelEn: 'Programme Time Text', category: 'accentStyle', getSample: (c) => c.programme?.[0]?.time || '11:00 AM' },
    { key: 'programmeItem', labelMs: '📝 Teks Nama Acara ("Ketibaan Tetamu")', labelEn: 'Programme Event Name', category: 'bodyStyle', getSample: (c) => c.programme?.[0]?.event || 'Ketibaan Tetamu' },
    { key: 'programmeCard', labelMs: '🖼️ Kad Kotak Acara (Programme Event Card)', labelEn: 'Programme Event Card', category: 'headingStyle', getSample: () => '🖼️ Kad Acara' },
  ],
  gallery: [
    { key: 'galleryTitle', labelMs: 'Tajuk Galeri Foto', labelEn: 'Gallery Title', category: 'headingStyle', getSample: (c, t) => c.textOverrides?.galleryTitle || t.galleryTitle || 'Galeri Memori' },
    { key: 'wishesTitle', labelMs: 'Tajuk Rekod Ucapan', labelEn: 'Wishes Title', category: 'headingStyle', getSample: (c, t) => c.textOverrides?.wishesTitle || t.wishesTitle || 'Titipan Doa & Ucapan' },
    { key: 'galleryWishBtn', labelMs: '💌 Butang Hantar Ucapan ("HANTAR UCAPAN")', labelEn: 'Send Wish Button', category: 'headingStyle', getSample: (c, t) => c.textOverrides?.sendWish || t.sendWish || 'Hantar Ucapan' },
    { key: 'galleryWishCard', labelMs: '💬 Kad Item Ucapan Tetamu (Wish Card Box)', labelEn: 'Guest Wish Card Box', category: 'bodyStyle', getSample: () => '💬 Kad Ucapan Tetamu' },
  ],
  message: [
    { key: 'messageTitle', labelMs: 'Tajuk Mesej Pengantin', labelEn: 'Message Title', category: 'headingStyle', getSample: (c) => c.coupleMessageTitle || 'Dari Kami Berdua' },
    { key: 'coupleMessage', labelMs: 'Teks Perenggan Mesej Ucapan', labelEn: 'Couple Message Body', category: 'bodyStyle', getSample: (c) => c.coupleMessage || 'Dengan penuh kerendahan hati...' },
    { key: 'messageCard', labelMs: '🖼️ Kad Nota Kasih (Couple Message Card Box)', labelEn: 'Couple Message Card Box', category: 'headingStyle', getSample: () => '🖼️ Kad Nota Kasih' },
  ],
  closing: [
    { key: 'closingTitle', labelMs: 'Tajuk Skrin Penutup', labelEn: 'Closing Title', category: 'headingStyle', getSample: (c) => c.closingTitle || 'Terima Kasih' },
    { key: 'closingText', labelMs: 'Teks Ucapan Penutup', labelEn: 'Closing Text', category: 'bodyStyle', getSample: (c) => c.closingText || 'Kehadiran dan doa restu anda...' },
    { key: 'sigGroom', labelMs: 'Tanda Tangan Lelaki', labelEn: 'Groom Signature', category: 'accentStyle', getSample: (c) => c.groomName || 'Velarie' },
    { key: 'sigBride', labelMs: 'Tanda Tangan Perempuan', labelEn: 'Bride Signature', category: 'accentStyle', getSample: (c) => c.brideName || 'Nadia' },
  ],
};

const ALL_FONTS = Array.from(
  new Set([
    ...HEADING_FONTS.map((f) => f.name),
    ...SCRIPT_FONTS.map((f) => f.name),
    ...BODY_FONTS.map((f) => f.name),
  ])
).sort();

export default function DesignBuilderTab({ config, update, lang, t, onSave }: DesignBuilderTabProps) {
  const [activeSection, setActiveSection] = useState<string>('invitation');
  const [typoMode, setTypoMode] = useState<'categorized' | 'individual'>('individual');

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

  function updateElementStyle(elementKey: string, updates: Partial<PageElementStyle>) {
    const currentElements = currentSectionStyle.elements || {};
    const existing = currentElements[elementKey] || {};
    const updatedEl = { ...existing, ...updates };

    const updatedElements = {
      ...currentElements,
      [elementKey]: updatedEl,
    };

    updateSectionStyle({ elements: updatedElements });
  }

  function resetElementStyle(elementKey: string) {
    const currentElements = { ...(currentSectionStyle.elements || {}) };
    delete currentElements[elementKey];
    updateSectionStyle({ elements: currentElements });
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
        elements: {},
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

      {/* Top action bar: Section reset & All section reset & Save */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.6rem 0.85rem', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--admin-text)', fontWeight: 600 }}>
          {SECTION_LABELS[activeSection]?.icon} {lang === 'en' ? SECTION_LABELS[activeSection]?.labelEn : SECTION_LABELS[activeSection]?.labelMs}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {onSave && (
            <button
              onClick={onSave}
              style={{
                background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
                border: '1px solid #C9A84C',
                color: '#FFF8E7',
                fontSize: '0.76rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
              title={lang === 'en' ? 'Save design changes permanently' : 'Simpan perubahan reka bentuk secara kekal'}
            >
              💾 {lang === 'en' ? 'Save Design' : 'Simpan Reka Bentuk'}
            </button>
          )}
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
                <span>
                  {currentSectionStyle.borderStyle && currentSectionStyle.borderStyle !== 'none'
                    ? (lang === 'en' ? 'ON (Active)' : 'ON (Aktif)')
                    : (lang === 'en' ? 'OFF (Disabled)' : 'OFF (Nyahaktif)')}
                </span>
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
                ↺ {lang === 'en' ? 'Default (No Frame)' : 'Default (Tiada Bingkai)'}
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

        {/* 🖋️ TYPOGRAPHY & FONTS (FONT, COLOR, SIZE) */}
        <div style={{ background: 'var(--admin-stat-bg)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h4 style={{ color: '#C9A84C', fontSize: '0.92rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  🖋️ {SECTION_LABELS[activeSection]?.icon} {lang === 'en' ? SECTION_LABELS[activeSection]?.labelEn : SECTION_LABELS[activeSection]?.labelMs} — {lang === 'en' ? 'Typography, Color & Size' : 'Font, Warna & Saiz Teks'}
                </h4>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>
                {lang === 'en'
                  ? 'Choose how you want to customize text on this section: by individual specific text items or by general font categories.'
                  : 'Pilih mod suaian teks untuk skrin ini: mengikut item teks spesifik atau mengikut kategori umum.'}
              </span>
            </div>
            
            {/* Mode Switcher Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', padding: '3px', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>
                <button
                  type="button"
                  onClick={() => setTypoMode('individual')}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: typoMode === 'individual' ? '#C9A84C' : 'transparent',
                    color: typoMode === 'individual' ? '#000000' : 'var(--admin-text-muted)',
                    transition: 'all 0.2s',
                  }}
                >
                  🎯 {lang === 'en' ? 'Specific Text Items' : 'Teks Spesifik (Item)'}
                </button>
                <button
                  type="button"
                  onClick={() => setTypoMode('categorized')}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: typoMode === 'categorized' ? '#C9A84C' : 'transparent',
                    color: typoMode === 'categorized' ? '#000000' : 'var(--admin-text-muted)',
                    transition: 'all 0.2s',
                  }}
                >
                  👑 {lang === 'en' ? 'General Categories' : 'Kategori (Ringkas)'}
                </button>
              </div>

              <button
                onClick={() => updateSectionStyle({ headingStyle: undefined, bodyStyle: undefined, accentStyle: undefined, elements: {} })}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--admin-border)',
                  color: 'var(--admin-text-muted)',
                  fontSize: '0.7rem',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
                title={lang === 'en' ? 'Reset all typography settings for this section to default' : 'Kembalikan semua tetapan font, warna, dan saiz skrin ini ke tetapan asal'}
              >
                ↺ {lang === 'en' ? 'Reset All' : 'Set Semula'}
              </button>
            </div>
          </div>

          <div>
            {typoMode === 'categorized' ? (
              <>
                {/* Quick Font Pairings */}
                <div style={{ marginBottom: '1.25rem' }}>
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

                {/* Detailed Typography Customizers: Heading, Accent, Body */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* 1. HEADING STYLE (TAJUK) */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div>
                        <h5 style={{ margin: 0, color: '#C9A84C', fontSize: '0.85rem', fontWeight: 700 }}>
                          👑 {lang === 'en' ? 'Heading Text' : 'Tajuk Utama / Heading'}
                        </h5>
                        <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>
                          📌 {SECTION_TEXT_TARGETS[activeSection]?.headingTarget || 'Teks Tajuk Skrin'}
                        </span>
                      </div>
                      <button
                        onClick={() => updateSectionStyle({ headingStyle: undefined })}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--admin-border)',
                          color: 'var(--admin-text-muted)',
                          fontSize: '0.68rem',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        ↺ {lang === 'en' ? 'Reset Heading Default' : 'Default Tajuk'}
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginTop: '0.5rem' }}>
                      {/* Font Family */}
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontWeight: 600 }}>
                          {lang === 'en' ? 'Font Family' : 'Jenis Font'}
                        </label>
                        <select
                          className="form-control"
                          value={currentSectionStyle.headingStyle?.fontFamily || ''}
                          onChange={(e) =>
                            updateSectionStyle({
                              headingStyle: { ...(currentSectionStyle.headingStyle || {}), fontFamily: e.target.value || undefined },
                            })
                          }
                          style={{ fontSize: '0.82rem' }}
                        >
                          <option value="">-- {lang === 'en' ? 'Default Theme Font' : 'Ikut Font Tema Standard'} --</option>
                          {HEADING_FONTS.map((f) => (
                            <option key={f.name} value={f.name}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Font Color */}
                      <div className="form-group" style={{ margin: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontWeight: 600 }}>
                            {lang === 'en' ? 'Color' : 'Warna Tajuk'}
                          </label>
                          {currentSectionStyle.headingStyle?.color && (
                            <button
                              onClick={() => updateSectionStyle({ headingStyle: { ...(currentSectionStyle.headingStyle || {}), color: undefined } })}
                              style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.65rem', cursor: 'pointer', padding: 0 }}
                            >
                              ↺ Default
                            </button>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <input
                            type="color"
                            value={currentSectionStyle.headingStyle?.color || '#FFFFFF'}
                            onChange={(e) =>
                              updateSectionStyle({
                                headingStyle: { ...(currentSectionStyle.headingStyle || {}), color: e.target.value },
                              })
                            }
                            style={{ width: '34px', height: '34px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }}
                          />
                          <input
                            className="form-control"
                            type="text"
                            placeholder="#FFFFFF"
                            value={currentSectionStyle.headingStyle?.color || ''}
                            onChange={(e) =>
                              updateSectionStyle({
                                headingStyle: { ...(currentSectionStyle.headingStyle || {}), color: e.target.value || undefined },
                              })
                            }
                            style={{ fontSize: '0.8rem' }}
                          />
                        </div>
                      </div>
                      {/* Font Size */}
                      <div className="form-group" style={{ margin: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontWeight: 600 }}>
                            {lang === 'en'
                              ? `Font Size (${currentSectionStyle.headingStyle?.fontSize || 'Default'})`
                              : `Saiz Tajuk (${currentSectionStyle.headingStyle?.fontSize || 'Default'})`}
                          </label>
                          {currentSectionStyle.headingStyle?.fontSize && (
                            <button
                              onClick={() => updateSectionStyle({ headingStyle: { ...(currentSectionStyle.headingStyle || {}), fontSize: undefined } })}
                              style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.65rem', cursor: 'pointer', padding: 0 }}
                            >
                              ↺ Default
                            </button>
                          )}
                        </div>
                        <input
                          type="range"
                          min="14"
                          max="56"
                          value={parseInt(currentSectionStyle.headingStyle?.fontSize || '24', 10)}
                          onChange={(e) =>
                            updateSectionStyle({
                              headingStyle: { ...(currentSectionStyle.headingStyle || {}), fontSize: `${e.target.value}px` },
                            })
                          }
                          style={{ width: '100%', accentColor: '#C9A84C' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. SCRIPT ACCENT STYLE (TULISAN TANGAN) */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div>
                        <h5 style={{ margin: 0, color: '#C9A84C', fontSize: '0.85rem', fontWeight: 700 }}>
                          ✨ {lang === 'en' ? 'Script / Accent Text' : 'Tulisan Tangan / Script & Hiasan'}
                        </h5>
                        <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>
                          📌 {SECTION_TEXT_TARGETS[activeSection]?.accentTarget || 'Teks Hiasan Script'}
                        </span>
                      </div>
                      <button
                        onClick={() => updateSectionStyle({ accentStyle: undefined })}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--admin-border)',
                          color: 'var(--admin-text-muted)',
                          fontSize: '0.68rem',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        ↺ {lang === 'en' ? 'Reset Script Default' : 'Default Script'}
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginTop: '0.5rem' }}>
                      {/* Font Family */}
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontWeight: 600 }}>
                          {lang === 'en' ? 'Font Family' : 'Jenis Font'}
                        </label>
                        <select
                          className="form-control"
                          value={currentSectionStyle.accentStyle?.fontFamily || ''}
                          onChange={(e) =>
                            updateSectionStyle({
                              accentStyle: { ...(currentSectionStyle.accentStyle || {}), fontFamily: e.target.value || undefined },
                            })
                          }
                          style={{ fontSize: '0.82rem' }}
                        >
                          <option value="">-- {lang === 'en' ? 'Default Theme Font' : 'Ikut Font Tema Standard'} --</option>
                          {SCRIPT_FONTS.map((f) => (
                            <option key={f.name} value={f.name}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Font Color */}
                      <div className="form-group" style={{ margin: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontWeight: 600 }}>
                            {lang === 'en' ? 'Color' : 'Warna Script'}
                          </label>
                          {currentSectionStyle.accentStyle?.color && (
                            <button
                              onClick={() => updateSectionStyle({ accentStyle: { ...(currentSectionStyle.accentStyle || {}), color: undefined } })}
                              style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.65rem', cursor: 'pointer', padding: 0 }}
                            >
                              ↺ Default
                            </button>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <input
                            type="color"
                            value={currentSectionStyle.accentStyle?.color || '#C9A84C'}
                            onChange={(e) =>
                              updateSectionStyle({
                                accentStyle: { ...(currentSectionStyle.accentStyle || {}), color: e.target.value },
                              })
                            }
                            style={{ width: '34px', height: '34px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }}
                          />
                          <input
                            className="form-control"
                            type="text"
                            placeholder="#C9A84C"
                            value={currentSectionStyle.accentStyle?.color || ''}
                            onChange={(e) =>
                              updateSectionStyle({
                                accentStyle: { ...(currentSectionStyle.accentStyle || {}), color: e.target.value || undefined },
                              })
                            }
                            style={{ fontSize: '0.8rem' }}
                          />
                        </div>
                      </div>
                      {/* Font Size */}
                      <div className="form-group" style={{ margin: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontWeight: 600 }}>
                            {lang === 'en'
                              ? `Font Size (${currentSectionStyle.accentStyle?.fontSize || 'Default'})`
                              : `Saiz Script (${currentSectionStyle.accentStyle?.fontSize || 'Default'})`}
                          </label>
                          {currentSectionStyle.accentStyle?.fontSize && (
                            <button
                              onClick={() => updateSectionStyle({ accentStyle: { ...(currentSectionStyle.accentStyle || {}), fontSize: undefined } })}
                              style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.65rem', cursor: 'pointer', padding: 0 }}
                            >
                              ↺ Default
                            </button>
                          )}
                        </div>
                        <input
                          type="range"
                          min="14"
                          max="56"
                          value={parseInt(currentSectionStyle.accentStyle?.fontSize || '22', 10)}
                          onChange={(e) =>
                            updateSectionStyle({
                              accentStyle: { ...(currentSectionStyle.accentStyle || {}), fontSize: `${e.target.value}px` },
                            })
                          }
                          style={{ width: '100%', accentColor: '#C9A84C' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. BODY TEXT STYLE (TEKS KANDUNGAN) */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div>
                        <h5 style={{ margin: 0, color: '#C9A84C', fontSize: '0.85rem', fontWeight: 700 }}>
                          📝 {lang === 'en' ? 'Body Text' : 'Teks Kandungan / Body'}
                        </h5>
                        <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>
                          📌 {SECTION_TEXT_TARGETS[activeSection]?.bodyTarget || 'Teks Kandungan & Mesej'}
                        </span>
                      </div>
                      <button
                        onClick={() => updateSectionStyle({ bodyStyle: undefined })}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--admin-border)',
                          color: 'var(--admin-text-muted)',
                          fontSize: '0.68rem',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        ↺ {lang === 'en' ? 'Reset Body Default' : 'Default Body'}
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginTop: '0.5rem' }}>
                      {/* Font Family */}
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontWeight: 600 }}>
                          {lang === 'en' ? 'Font Family' : 'Jenis Font'}
                        </label>
                        <select
                          className="form-control"
                          value={currentSectionStyle.bodyStyle?.fontFamily || ''}
                          onChange={(e) =>
                            updateSectionStyle({
                              bodyStyle: { ...(currentSectionStyle.bodyStyle || {}), fontFamily: e.target.value || undefined },
                            })
                          }
                          style={{ fontSize: '0.82rem' }}
                        >
                          <option value="">-- {lang === 'en' ? 'Default Theme Font' : 'Ikut Font Tema Standard'} --</option>
                          {BODY_FONTS.map((f) => (
                            <option key={f.name} value={f.name}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Font Color */}
                      <div className="form-group" style={{ margin: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontWeight: 600 }}>
                            {lang === 'en' ? 'Color' : 'Warna Teks'}
                          </label>
                          {currentSectionStyle.bodyStyle?.color && (
                            <button
                              onClick={() => updateSectionStyle({ bodyStyle: { ...(currentSectionStyle.bodyStyle || {}), color: undefined } })}
                              style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.65rem', cursor: 'pointer', padding: 0 }}
                            >
                              ↺ Default
                            </button>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <input
                            type="color"
                            value={currentSectionStyle.bodyStyle?.color || '#CCCCCC'}
                            onChange={(e) =>
                              updateSectionStyle({
                                bodyStyle: { ...(currentSectionStyle.bodyStyle || {}), color: e.target.value },
                              })
                            }
                            style={{ width: '34px', height: '34px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }}
                          />
                          <input
                            className="form-control"
                            type="text"
                            placeholder="#CCCCCC"
                            value={currentSectionStyle.bodyStyle?.color || ''}
                            onChange={(e) =>
                              updateSectionStyle({
                                bodyStyle: { ...(currentSectionStyle.bodyStyle || {}), color: e.target.value || undefined },
                              })
                            }
                            style={{ fontSize: '0.8rem' }}
                          />
                        </div>
                      </div>
                      {/* Font Size */}
                      <div className="form-group" style={{ margin: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.72rem', fontWeight: 600 }}>
                            {lang === 'en'
                              ? `Font Size (${currentSectionStyle.bodyStyle?.fontSize || 'Default'})`
                              : `Saiz Teks (${currentSectionStyle.bodyStyle?.fontSize || 'Default'})`}
                          </label>
                          {currentSectionStyle.bodyStyle?.fontSize && (
                            <button
                              onClick={() => updateSectionStyle({ bodyStyle: { ...(currentSectionStyle.bodyStyle || {}), fontSize: undefined } })}
                              style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.65rem', cursor: 'pointer', padding: 0 }}
                            >
                              ↺ Default
                            </button>
                          )}
                        </div>
                        <input
                          type="range"
                          min="12"
                          max="36"
                          value={parseInt(currentSectionStyle.bodyStyle?.fontSize || '16', 10)}
                          onChange={(e) =>
                            updateSectionStyle({
                              bodyStyle: { ...(currentSectionStyle.bodyStyle || {}), fontSize: `${e.target.value}px` },
                            })
                          }
                          style={{ width: '100%', accentColor: '#C9A84C' }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </>
            ) : (
              /* INDIVIDUAL ELEMENT TEXT CUSTOMIZER (TETAPAN KANDUNGAN SPESIFIK) */
              <div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(SECTION_ELEMENTS[activeSection] || []).map((elCfg) => {
                    const elStyle = currentSectionStyle.elements?.[elCfg.key] || {};
                    const sampleText = elCfg.getSample(config, t);
                    const hasCustom = Boolean(elStyle.fontFamily || elStyle.color || elStyle.fontSize);

                    return (
                      <div
                        key={elCfg.key}
                        style={{
                          background: hasCustom ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.015)',
                          padding: '0.9rem 1rem',
                          borderRadius: '12px',
                          border: `1px solid ${hasCustom ? '#C9A84C' : 'var(--admin-border)'}`,
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--admin-text)' }}>
                              📝 {lang === 'en' ? elCfg.labelEn : elCfg.labelMs}
                            </span>
                            {sampleText && (
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  background: 'rgba(255,255,255,0.08)',
                                  color: elStyle.color || '#C9A84C',
                                  fontFamily: elStyle.fontFamily ? `'${elStyle.fontFamily}', sans-serif` : 'inherit',
                                  border: '1px solid var(--admin-border)',
                                  maxWidth: '220px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                "{sampleText}"
                              </span>
                            )}
                          </div>
                          {hasCustom && (
                            <button
                              onClick={() => resetElementStyle(elCfg.key)}
                              style={{
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.25)',
                                color: '#f87171',
                                fontSize: '0.68rem',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 600,
                              }}
                            >
                              ↺ {lang === 'en' ? 'Reset Item Default' : 'Set Semula Teks Ini'}
                            </button>
                          )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                          {/* Font Family */}
                          <div className="form-group" style={{ margin: 0 }}>
                            <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.7rem', fontWeight: 600 }}>
                              {lang === 'en' ? 'Font Family' : 'Jenis Font'}
                            </label>
                            <select
                              className="form-control"
                              value={elStyle.fontFamily || ''}
                              onChange={(e) => updateElementStyle(elCfg.key, { fontFamily: e.target.value || undefined })}
                              style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
                            >
                              <option value="">-- {lang === 'en' ? 'Default Theme Font' : 'Ikut Font Tema Standard'} --</option>
                              {ALL_FONTS.map((fontName) => (
                                <option key={fontName} value={fontName}>
                                  {fontName}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Font Color */}
                          <div className="form-group" style={{ margin: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.7rem', fontWeight: 600 }}>
                                {lang === 'en' ? 'Color' : 'Warna Teks'}
                              </label>
                              {elStyle.color && (
                                <button
                                  onClick={() => updateElementStyle(elCfg.key, { color: undefined })}
                                  style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.62rem', cursor: 'pointer', padding: 0 }}
                                >
                                  ↺ Default
                                </button>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                              <input
                                type="color"
                                value={elStyle.color || '#FFFFFF'}
                                onChange={(e) => updateElementStyle(elCfg.key, { color: e.target.value })}
                                style={{ width: '32px', height: '32px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }}
                              />
                              <input
                                className="form-control"
                                type="text"
                                placeholder="#FFFFFF"
                                value={elStyle.color || ''}
                                onChange={(e) => updateElementStyle(elCfg.key, { color: e.target.value || undefined })}
                                style={{ fontSize: '0.78rem', padding: '0.35rem 0.5rem' }}
                              />
                            </div>
                          </div>

                          {/* Font Size */}
                          <div className="form-group" style={{ margin: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.7rem', fontWeight: 600 }}>
                                {lang === 'en'
                                  ? `Font Size (${elStyle.fontSize || 'Default'})`
                                  : `Saiz Teks (${elStyle.fontSize || 'Default'})`}
                              </label>
                              {elStyle.fontSize && (
                                <button
                                  onClick={() => updateElementStyle(elCfg.key, { fontSize: undefined })}
                                  style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.62rem', cursor: 'pointer', padding: 0 }}
                                >
                                  ↺ Default
                                </button>
                              )}
                            </div>
                            <input
                              type="range"
                              min="12"
                              max="64"
                              value={parseInt(elStyle.fontSize || '20', 10)}
                              onChange={(e) => updateElementStyle(elCfg.key, { fontSize: `${e.target.value}px` })}
                              style={{ width: '100%', accentColor: '#C9A84C' }}
                            />
                          </div>

                          {/* 🎨 Background, Border & Frame Styles - Collapsible */}
                          <details style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--admin-border)', gridColumn: '1 / -1' }}>
                            <summary style={{ fontSize: '0.72rem', color: '#C9A84C', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none', listStyle: 'none' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <span>▶</span> 🎨 {lang === 'en' ? 'Background, Border & Frame Styles' : 'Warna Latar, Sempadan & Bingkai'}
                              </span>
                              {(elStyle.backgroundColor || elStyle.borderColor || elStyle.borderRadius) && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateElementStyle(elCfg.key, { backgroundColor: undefined, borderColor: undefined, borderRadius: undefined });
                                  }}
                                  style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.62rem', cursor: 'pointer', padding: 0 }}
                                >
                                  ↺ {lang === 'en' ? 'Reset Frame' : 'Reset Bingkai'}
                                </button>
                              )}
                            </summary>

                            <div style={{ marginTop: '0.6rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.6rem' }}>
                              {/* Background Color */}
                              <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.68rem', fontWeight: 600 }}>
                                  🎨 {lang === 'en' ? 'Background Color' : 'Warna Latar'}
                                </label>
                                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                                  <input
                                    type="color"
                                    value={elStyle.backgroundColor || '#000000'}
                                    onChange={(e) => updateElementStyle(elCfg.key, { backgroundColor: e.target.value })}
                                    style={{ width: '30px', height: '30px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }}
                                  />
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="transparent"
                                    value={elStyle.backgroundColor || ''}
                                    onChange={(e) => updateElementStyle(elCfg.key, { backgroundColor: e.target.value || undefined })}
                                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
                                  />
                                </div>
                              </div>

                              {/* Border Color */}
                              <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.68rem', fontWeight: 600 }}>
                                  🖼️ {lang === 'en' ? 'Border Color' : 'Warna Sempadan'}
                                </label>
                                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                                  <input
                                    type="color"
                                    value={elStyle.borderColor || '#C9A84C'}
                                    onChange={(e) => updateElementStyle(elCfg.key, { borderColor: e.target.value })}
                                    style={{ width: '30px', height: '30px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }}
                                  />
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="#C9A84C"
                                    value={elStyle.borderColor || ''}
                                    onChange={(e) => updateElementStyle(elCfg.key, { borderColor: e.target.value || undefined })}
                                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
                                  />
                                </div>
                              </div>

                              {/* Border Radius */}
                              <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
                                <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.68rem', fontWeight: 600 }}>
                                  ⭕ {lang === 'en' ? 'Border Radius' : 'Jejari Sudut (Bucu Bulat)'}: {elStyle.borderRadius || '0px'}
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="50"
                                  value={parseInt(elStyle.borderRadius || '0', 10)}
                                  onChange={(e) => updateElementStyle(elCfg.key, { borderRadius: `${e.target.value}px` })}
                                  style={{ width: '100%', accentColor: '#C9A84C' }}
                                />
                              </div>
                            </div>
                          </details>

                          {/* 1. Text Spacing & Margins (Padding, Letter Spacing, Line Height) - Collapsible */}
                          <details style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--admin-border)', gridColumn: '1 / -1' }}>
                            <summary style={{ fontSize: '0.72rem', color: '#C9A84C', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none', listStyle: 'none' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <span>▶</span> ↔️ {lang === 'en' ? 'Text Spacing & Margins (Top, Bottom, Left, Right)' : 'Jarak & Padding Teks (Atas, Bawah, Kiri, Kanan)'}
                              </span>
                              {(elStyle.paddingTop || elStyle.paddingBottom || elStyle.paddingLeft || elStyle.paddingRight || elStyle.letterSpacing || elStyle.lineHeight) && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateElementStyle(elCfg.key, { paddingTop: undefined, paddingBottom: undefined, paddingLeft: undefined, paddingRight: undefined, letterSpacing: undefined, lineHeight: undefined });
                                  }}
                                  style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.62rem', cursor: 'pointer', padding: 0 }}
                                >
                                  ↺ {lang === 'en' ? 'Reset Text Spacing' : 'Reset Jarak Teks'}
                                </button>
                              )}
                            </summary>

                            <div style={{ marginTop: '0.6rem' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
                                {/* Padding Top */}
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.68rem', fontWeight: 600 }}>
                                    ⬆️ {lang === 'en' ? 'Top Padding' : 'Padding Atas (Top)'}: {elStyle.paddingTop || '0px'}
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="60"
                                    value={parseInt(elStyle.paddingTop || '0', 10)}
                                    onChange={(e) => updateElementStyle(elCfg.key, { paddingTop: `${e.target.value}px` })}
                                    style={{ width: '100%', accentColor: '#C9A84C' }}
                                  />
                                </div>

                                {/* Padding Bottom */}
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.68rem', fontWeight: 600 }}>
                                    ⬇️ {lang === 'en' ? 'Bottom Padding' : 'Padding Bawah (Bottom)'}: {elStyle.paddingBottom || '0px'}
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="60"
                                    value={parseInt(elStyle.paddingBottom || '0', 10)}
                                    onChange={(e) => updateElementStyle(elCfg.key, { paddingBottom: `${e.target.value}px` })}
                                    style={{ width: '100%', accentColor: '#C9A84C' }}
                                  />
                                </div>

                                {/* Padding Left */}
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.68rem', fontWeight: 600 }}>
                                    ⬅️ {lang === 'en' ? 'Left Padding' : 'Padding Kiri (Left)'}: {elStyle.paddingLeft || '0px'}
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="60"
                                    value={parseInt(elStyle.paddingLeft || '0', 10)}
                                    onChange={(e) => updateElementStyle(elCfg.key, { paddingLeft: `${e.target.value}px` })}
                                    style={{ width: '100%', accentColor: '#C9A84C' }}
                                  />
                                </div>

                                {/* Padding Right */}
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.68rem', fontWeight: 600 }}>
                                    ➡️ {lang === 'en' ? 'Right Padding' : 'Padding Kanan (Right)'}: {elStyle.paddingRight || '0px'}
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="60"
                                    value={parseInt(elStyle.paddingRight || '0', 10)}
                                    onChange={(e) => updateElementStyle(elCfg.key, { paddingRight: `${e.target.value}px` })}
                                    style={{ width: '100%', accentColor: '#C9A84C' }}
                                  />
                                </div>
                              </div>

                              {/* Letter Spacing & Line Height */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem', marginTop: '0.5rem' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.68rem', fontWeight: 600 }}>
                                    🔤 {lang === 'en' ? 'Letter Spacing' : 'Jarak Huruf'}: {elStyle.letterSpacing || '0px'}
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="12"
                                    value={parseInt(elStyle.letterSpacing || '0', 10)}
                                    onChange={(e) => updateElementStyle(elCfg.key, { letterSpacing: `${e.target.value}px` })}
                                    style={{ width: '100%', accentColor: '#C9A84C' }}
                                  />
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.68rem', fontWeight: 600 }}>
                                    ↕️ {lang === 'en' ? 'Line Height' : 'Tinggi Baris'}: {elStyle.lineHeight || '1.4'}
                                  </label>
                                  <input
                                    type="range"
                                    min="1"
                                    max="3"
                                    step="0.1"
                                    value={parseFloat(elStyle.lineHeight || '1.4')}
                                    onChange={(e) => updateElementStyle(elCfg.key, { lineHeight: e.target.value })}
                                    style={{ width: '100%', accentColor: '#C9A84C' }}
                                  />
                                </div>
                              </div>
                            </div>
                          </details>

                          {/* 2. Section Spacing & Margins (Outer Block Margins: Top, Bottom, Left, Right) - Collapsible */}
                          <details style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--admin-border)', gridColumn: '1 / -1' }}>
                            <summary style={{ fontSize: '0.72rem', color: '#C9A84C', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none', listStyle: 'none' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <span>▶</span> 📦 {lang === 'en' ? 'Section Spacing & Margins (Top, Bottom, Left, Right)' : 'Jarak Blok & Margin Seksyen (Atas, Bawah, Kiri, Kanan)'}
                              </span>
                              {(elStyle.marginTop || elStyle.marginBottom || elStyle.marginLeft || elStyle.marginRight) && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateElementStyle(elCfg.key, { marginTop: undefined, marginBottom: undefined, marginLeft: undefined, marginRight: undefined });
                                  }}
                                  style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.62rem', cursor: 'pointer', padding: 0 }}
                                >
                                  ↺ {lang === 'en' ? 'Reset Section Spacing' : 'Reset Jarak Seksyen'}
                                </button>
                              )}
                            </summary>

                            <div style={{ marginTop: '0.6rem' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
                                {/* Margin Top */}
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.68rem', fontWeight: 600 }}>
                                    ⬆️ {lang === 'en' ? 'Top Margin' : 'Margin Atas (Top)'}: {elStyle.marginTop || '0px'}
                                  </label>
                                  <input
                                    type="range"
                                    min="-40"
                                    max="120"
                                    value={parseInt(elStyle.marginTop || '0', 10)}
                                    onChange={(e) => updateElementStyle(elCfg.key, { marginTop: `${e.target.value}px` })}
                                    style={{ width: '100%', accentColor: '#C9A84C' }}
                                  />
                                </div>

                                {/* Margin Bottom */}
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.68rem', fontWeight: 600 }}>
                                    ⬇️ {lang === 'en' ? 'Bottom Margin' : 'Margin Bawah (Bottom)'}: {elStyle.marginBottom || '0px'}
                                  </label>
                                  <input
                                    type="range"
                                    min="-40"
                                    max="120"
                                    value={parseInt(elStyle.marginBottom || '0', 10)}
                                    onChange={(e) => updateElementStyle(elCfg.key, { marginBottom: `${e.target.value}px` })}
                                    style={{ width: '100%', accentColor: '#C9A84C' }}
                                  />
                                </div>

                                {/* Margin Left */}
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.68rem', fontWeight: 600 }}>
                                    ⬅️ {lang === 'en' ? 'Left Margin' : 'Margin Kiri (Left)'}: {elStyle.marginLeft || '0px'}
                                  </label>
                                  <input
                                    type="range"
                                    min="-40"
                                    max="120"
                                    value={parseInt(elStyle.marginLeft || '0', 10)}
                                    onChange={(e) => updateElementStyle(elCfg.key, { marginLeft: `${e.target.value}px` })}
                                    style={{ width: '100%', accentColor: '#C9A84C' }}
                                  />
                                </div>

                                {/* Margin Right */}
                                <div className="form-group" style={{ margin: 0 }}>
                                  <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.68rem', fontWeight: 600 }}>
                                    ➡️ {lang === 'en' ? 'Right Margin' : 'Margin Kanan (Right)'}: {elStyle.marginRight || '0px'}
                                  </label>
                                  <input
                                    type="range"
                                    min="-40"
                                    max="120"
                                    value={parseInt(elStyle.marginRight || '0', 10)}
                                    onChange={(e) => updateElementStyle(elCfg.key, { marginRight: `${e.target.value}px` })}
                                    style={{ width: '100%', accentColor: '#C9A84C' }}
                                  />
                                </div>
                              </div>
                            </div>
                          </details>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🧭 FLOATING NAVIGATION BAR TOGGLE */}
        <div style={{ background: 'var(--admin-stat-bg)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--admin-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h4 style={{ color: '#C9A84C', fontSize: '0.92rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🧭 {lang === 'en' ? 'Live Website Floating Navigation Bar' : 'Bar Navigasi Terapung Laman Web Live'}
              </h4>
              <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.76rem', margin: '0.25rem 0 0 0', lineHeight: 1.4 }}>
                {lang === 'en'
                  ? 'Enable or disable the floating bottom menu (RSVP, Calendar, Contact, Location, Cash Gift, Gift).'
                  : 'Aktifkan atau nyahaktifkan bar menu pintas di bahagian bawah laman (RSVP, Kalendar, Kenalan, Lokasi, Hadiah Wang, Hadiah Hantaran).'}
              </p>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--admin-text)', fontWeight: 600, cursor: 'pointer', margin: 0 }}>
              <span>{config.featureToggles?.enableFloatingNav !== false ? 'ON (Paparkan)' : 'OFF (Nyahaktif)'}</span>
              <label className="toggle-switch" style={{ transform: 'scale(0.85)', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={config.featureToggles?.enableFloatingNav !== false}
                  onChange={(e) =>
                    update({
                      featureToggles: {
                        ...(config.featureToggles || {}),
                        enableFloatingNav: e.target.checked,
                      },
                    })
                  }
                />
                <span className="toggle-slider" />
              </label>
            </label>
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
