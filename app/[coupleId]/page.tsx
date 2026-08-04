'use client';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { WeddingConfig } from '@/lib/db';
import { THEMES } from '@/lib/themes';
import GateScreen from '@/components/invitation/GateScreen';
import InvitationHero from '@/components/invitation/InvitationHero';
import ParentsSection from '@/components/invitation/ParentsSection';
import CountdownSection from '@/components/invitation/CountdownSection';
import ProgrammeSection from '@/components/invitation/ProgrammeSection';
import GalleryWishes from '@/components/invitation/GalleryWishes';
import CoupleMessage from '@/components/invitation/CoupleMessage';
import ClosingScreen from '@/components/invitation/ClosingScreen';
import FloatingNav from '@/components/nav/FloatingNav';
import FallingParticles from '@/components/invitation/FallingParticles';
import SectionFrame from '@/components/invitation/SectionFrame';
import { buildGoogleFontsUrl } from '@/lib/typography';
import { Lang } from '@/lib/i18n';

export default function InvitationPage({ params }: { params: Promise<{ coupleId: string }> }) {
  const [coupleId, setCoupleId] = useState('');
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [dbId, setDbId] = useState('');
  const [status, setStatus] = useState<'loading' | 'active' | 'inactive' | 'notfound'>('loading');
  const [gateOpen, setGateOpen] = useState(false);
  const [gateClosing, setGateClosing] = useState(false);
  const [gateUnmounted, setGateUnmounted] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('');
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dotNavItems = useMemo(() => {
    return [
      { key: 'invitation', label: 'Jemputan' },
      { key: 'parents', label: 'Keluarga' },
      { key: 'countdown', label: 'Tarikh' },
      { key: 'programme', label: 'Aturcara' },
      { key: 'gallery', label: 'Galeri' },
      { key: 'message', label: 'Mesej' },
      { key: 'closing', label: 'Penutup' },
    ].filter(item => config && config.sections[item.key as keyof typeof config.sections]);
  }, [config]);

  // Desktop slide scroll interceptor
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if we are on a desktop device
    const isDesktop = window.matchMedia('(min-width: 601px)').matches;
    if (!isDesktop) return;

    const el = wrapperRef.current;
    if (!el) return;

    let isTransitioning = false;

    const handleWheel = (e: WheelEvent) => {
      // Check if the scroll target is inside a scrollable element
      let target = e.target as HTMLElement | null;
      while (target && target !== el) {
        const style = window.getComputedStyle(target);
        const overflowY = style.overflowY;
        const isScrollable = (overflowY === 'auto' || overflowY === 'scroll') && target.scrollHeight > target.clientHeight;
        if (isScrollable) {
          // If the child element has scroll room, let it scroll naturally
          if (e.deltaY > 0 && target.scrollTop + target.clientHeight < target.scrollHeight - 2) {
            return;
          }
          if (e.deltaY < 0 && target.scrollTop > 2) {
            return;
          }
        }
        target = target.parentElement;
      }

      const activeIdx = dotNavItems.findIndex(item => item.key === activeSection);
      if (activeIdx === -1) return;

      // Prevent default scrolling to handle it smoothly
      e.preventDefault();

      if (isTransitioning) return;

      if (e.deltaY > 20) {
        if (activeIdx < dotNavItems.length - 1) {
          const nextSection = dotNavItems[activeIdx + 1].key;
          const nextEl = document.getElementById(nextSection);
          if (nextEl) {
            isTransitioning = true;
            nextEl.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => { isTransitioning = false; }, 850);
          }
        }
      } else if (e.deltaY < -20) {
        if (activeIdx > 0) {
          const prevSection = dotNavItems[activeIdx - 1].key;
          const prevEl = document.getElementById(prevSection);
          if (prevEl) {
            isTransitioning = true;
            prevEl.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => { isTransitioning = false; }, 850);
          }
        }
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [activeSection, dotNavItems, config, gateUnmounted]);

  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleScroll]);

  useEffect(() => {
    params.then(p => setCoupleId(p.coupleId));
  }, [params]);

  const [siteLang, setSiteLang] = useState<Lang>('ms');

  useEffect(() => {
    if (!coupleId) return;
    fetch(`/api/invitation/${coupleId}`)
      .then(async res => {
        if (res.status === 404) { setStatus('notfound'); return; }
        if (res.status === 403) { setStatus('inactive'); return; }
        const data = await res.json();
        setConfig(data.couple.config);
        setSiteLang(data.couple.config.language || 'ms');
        setDbId(data.couple.id);
        setStatus('active');
      })
      .catch(() => setStatus('notfound'));
  }, [coupleId]);

  // Apply theme and custom fonts
  useEffect(() => {
    if (!config) return;
    const theme = THEMES.find(t => t.key === config.theme) || THEMES[0];
    document.documentElement.setAttribute('data-theme', config.theme);
    // Load Google Fonts
    const existing = document.getElementById('gfonts');
    if (existing) existing.remove();
    
    // Collect custom section fonts if any
    const customFonts: string[] = [];
    if (config.pageStyles) {
      Object.values(config.pageStyles).forEach(st => {
        if (st?.headingStyle?.fontFamily) customFonts.push(st.headingStyle.fontFamily);
        if (st?.bodyStyle?.fontFamily) customFonts.push(st.bodyStyle.fontFamily);
        if (st?.accentStyle?.fontFamily) customFonts.push(st.accentStyle.fontFamily);
      });
    }

    const themeFontUrl = `https://fonts.googleapis.com/css2?family=${theme.googleFonts}&display=swap`;
    const customFontUrl = buildGoogleFontsUrl(customFonts);

    const link = document.createElement('link');
    link.id = 'gfonts';
    link.rel = 'stylesheet';
    link.href = customFontUrl ? `${themeFontUrl}&family=${customFonts.map(f => f.replace(/\s+/g, '+')).join('&family=')}` : themeFontUrl;
    document.head.appendChild(link);
    
    // Update page title
    document.title = `Jemputan Perkahwinan — ${config.groomName} & ${config.brideName}`;
  }, [config]);

  const handleGateOpen = useCallback(() => {
    // Step 1: doors open
    setGateOpen(true);
    window.postMessage({ type: 'GATE_OPENED' }, '*');
    // Step 2: after doors open (900ms), start closing fade-out
    setTimeout(() => {
      setGateClosing(true);
      setShowNav(true);
      window.postMessage({ type: 'GATE_OPENED' }, '*');
      // Step 3: after fade-out completes (580ms), unmount gate completely
      setTimeout(() => {
        setGateUnmounted(true);
        window.postMessage({ type: 'GATE_OPENED' }, '*');
      }, 580);
    }, 900);
  }, []);

  const ft = config?.featureToggles || {};
  const baseSections = config?.sections || {
    gate: true,
    invitation: true,
    parents: true,
    countdown: true,
    programme: true,
    gallery: true,
    message: true,
    closing: true,
  };

  const sections = {
    gate: baseSections.gate && ft.enableGateSection !== false,
    invitation: baseSections.invitation && ft.enableHeroSection !== false,
    parents: baseSections.parents && ft.enableParentsSection !== false,
    countdown: baseSections.countdown && ft.enableCountdownSection !== false,
    programme: baseSections.programme && ft.enableProgramme !== false && ft.enableProgrammeSection !== false,
    gallery: baseSections.gallery && ft.enableGallery !== false && ft.enableGallerySection !== false,
    message: baseSections.message && ft.enableMessageSection !== false,
    closing: baseSections.closing && ft.enableClosingSection !== false,
  };

  useEffect(() => {
    if (!config || (sections.gate && !gateUnmounted)) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.38 });

    const targets = document.querySelectorAll('.section-scroll-target');
    targets.forEach(t => observer.observe(t));
    return () => observer.disconnect();
  }, [config, gateUnmounted, status, sections]);

  useEffect(() => {
    function handlePreviewMsg(e: MessageEvent) {
      if (!e.data || typeof e.data !== 'object') return;
      
      if (e.data.type === 'PREVIEW_SELECT_SECTION') {
        if (e.data.sectionId && e.data.sectionId !== 'gate') {
          setGateOpen(true);
          setGateClosing(true);
          setGateUnmounted(true);
          setShowNav(true);
        }
        if (e.data.sectionId) {
          const el = document.getElementById(e.data.sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      } else if (e.data.type === 'PREVIEW_HOVER_STYLE') {
        if (e.data.sectionId && e.data.sectionId !== 'gate') {
          // Ensure gate is open so inner section is visible
          setGateOpen(true);
          setGateClosing(true);
          setGateUnmounted(true);
          setShowNav(true);
        }
      } else if (e.data.type === 'PREVIEW_UPDATE_CONFIG') {
        if (e.data.config) {
          setConfig(e.data.config);
        }
      }
    }
    window.addEventListener('message', handlePreviewMsg);
    return () => window.removeEventListener('message', handlePreviewMsg);
  }, []);

  function getSectionStyle(sectionKey: 'gate' | 'invitation' | 'parents' | 'countdown' | 'programme' | 'gallery' | 'message' | 'closing') {
    if (!config) return {};
    const themeObj = THEMES.find(t => t.key === config.theme) || THEMES[0];
    const customBg = config.backgrounds?.[sectionKey];
    const bgUrl = customBg || themeObj.defaultBg;

    // Dark/light overlays to guarantee readability
    let overlay = 'rgba(255, 255, 255, 0.72)';
    if (['gate', 'parents', 'message', 'closing'].includes(sectionKey)) {
      overlay = 'rgba(0, 0, 0, 0.55)';
    }

    if (config.useUnifiedBackground && sectionKey !== 'gate') {
      return {
        background: `linear-gradient(${overlay}, ${overlay})`,
      };
    }

    return {
      backgroundImage: `linear-gradient(${overlay}, ${overlay}), url(${bgUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'scroll',
    };
  }

  if (status === 'loading') return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💍</div>
        <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Memuatkan jemputan...</p>
      </div>
    </div>
  );

  if (status === 'inactive') return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e293b', flexDirection: 'column', gap: '1rem', fontFamily: 'sans-serif', color: '#888', textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '3rem' }}>🔒</div>
      <h2 style={{ color: '#f8fafc' }}>Laman Tidak Aktif</h2>
      <p>Laman jemputan ini sedang tidak aktif buat sementara waktu.</p>
    </div>
  );

  if (status === 'notfound' || !config) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e293b', flexDirection: 'column', gap: '1rem', fontFamily: 'sans-serif', color: '#888', textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '3rem' }}>🔍</div>
      <h2 style={{ color: '#f8fafc' }}>Jemputan Tidak Dijumpai</h2>
      <p>URL yang anda masukkan tidak sah atau sudah tamat tempoh.</p>
    </div>
  );

  return (
    <div className="invitation-wrapper" ref={wrapperRef}>
      {/* Unified fixed background backdrop */}
      {config.useUnifiedBackground && (!sections.gate || gateUnmounted) && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundImage: `url(${config.unifiedBackgroundUrl || THEMES.find(t => t.key === config.theme)?.defaultBg || THEMES[0].defaultBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -1,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Global particles shown across all sections once welcome is opened */}
      {(!sections.gate || gateUnmounted) && <FallingParticles />}

      {/* Inner invitation content is mounted unconditionally so it pre-loads underneath the gate */}
      <>
        {sections.invitation && (
          <SectionFrame id="invitation" sectionKey="invitation" sectionStyle={config.pageStyles?.invitation}>
            <InvitationHero config={config} style={getSectionStyle('invitation')} lang={siteLang} textOverrides={config.textOverrides} />
          </SectionFrame>
        )}
        {sections.parents && (
          <SectionFrame id="parents" sectionKey="parents" sectionStyle={config.pageStyles?.parents}>
            <ParentsSection config={config} style={getSectionStyle('parents')} lang={siteLang} textOverrides={config.textOverrides} />
          </SectionFrame>
        )}
        {sections.countdown && (
          <SectionFrame id="countdown" sectionKey="countdown" sectionStyle={config.pageStyles?.countdown}>
            <CountdownSection config={config} style={getSectionStyle('countdown')} lang={siteLang} textOverrides={config.textOverrides} />
          </SectionFrame>
        )}
        {sections.programme && (
          <SectionFrame id="programme" sectionKey="programme" sectionStyle={config.pageStyles?.programme}>
            <ProgrammeSection config={config} style={getSectionStyle('programme')} lang={siteLang} textOverrides={config.textOverrides} />
          </SectionFrame>
        )}
        {sections.gallery && (
          <SectionFrame id="gallery" sectionKey="gallery" sectionStyle={config.pageStyles?.gallery}>
            <GalleryWishes config={config} coupleId={dbId} style={getSectionStyle('gallery')} lang={siteLang} textOverrides={config.textOverrides} />
          </SectionFrame>
        )}
        {sections.message && (
          <SectionFrame id="message" sectionKey="message" sectionStyle={config.pageStyles?.message}>
            <CoupleMessage config={config} style={getSectionStyle('message')} lang={siteLang} textOverrides={config.textOverrides} />
          </SectionFrame>
        )}
        {sections.closing && (
          <SectionFrame id="closing" sectionKey="closing" sectionStyle={config.pageStyles?.closing}>
            <ClosingScreen config={config} style={getSectionStyle('closing')} lang={siteLang} textOverrides={config.textOverrides} />
          </SectionFrame>
        )}

        {/* ChatGPT-style Circular Vertical Dot Navigation — visible only after gate is dismissed */}
        {dotNavItems.length > 1 && showNav && (
          <div className={`vertical-dot-nav ${isScrolling ? 'visible' : ''}`}>
            {dotNavItems.map(item => (
              <button
                key={item.key}
                className={`dot-nav-item ${activeSection === item.key ? 'active' : ''}`}
                onClick={() => {
                  const el = document.getElementById(item.key);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                title={item.label}
                aria-label={`Lompat ke skrin ${item.label}`}
              />
            ))}
          </div>
        )}
      </>

      {/* Overlay the Gate Screen on top of everything if enabled and not yet unmounted */}
      {sections.gate && !gateUnmounted && (
        <GateScreen config={config} onOpen={handleGateOpen} isOpen={gateOpen} isClosing={gateClosing} lang={siteLang} textOverrides={config.textOverrides} />
      )}


      <FloatingNav
        config={config}
        coupleId={dbId}
        visible={showNav || !sections.gate || gateUnmounted}
        onUpdateGifts={(updatedGifts) => {
          setConfig(prev => prev ? { ...prev, gifts: updatedGifts } : null);
        }}
        lang={siteLang}
        textOverrides={config.textOverrides}
      />
    </div>
  );
}
