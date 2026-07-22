'use client';
import { WeddingConfig } from '@/lib/db';
import { THEMES } from '@/lib/themes';
import styles from './GateScreen.module.css';

import { INVITATION_DICT, Lang } from '@/lib/i18n';

interface Props { config: WeddingConfig; onOpen: () => void; isOpen: boolean; isClosing?: boolean; lang?: Lang; }

export default function GateScreen({ config, onOpen, isOpen, isClosing, lang }: Props) {
  const currentLang: Lang = lang || config.language || 'ms';
  const t = INVITATION_DICT[currentLang];
  const themeObj = THEMES.find(t => t.key === config.theme) || THEMES[0];
  const bgUrl = (config.useUnifiedBackground && config.unifiedBackgroundUrl)
    ? config.unifiedBackgroundUrl
    : (config.backgrounds?.gate || themeObj.defaultBg);

  const bgStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${bgUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <section className={`${styles.gate} ${isClosing ? styles.gateClosing : ''}`}>
      {/* Gate doors split line is behind the card */}
      <div className={`${styles.gateWrap} ${isOpen ? styles.gateOpen : ''}`}>
        <div className={styles.gateLeft} style={bgStyle}>
          <div className={styles.gateLatch} />
          <div className={styles.gatePattern} />
        </div>
        <div className={styles.gateRight} style={bgStyle}>
          <div className={styles.gatePattern} />
        </div>
      </div>

      {/* Center content (above/on gate) - Etched Stamp Style */}
      <div className={`${styles.content} ${isOpen ? styles.contentFadeOut : ''}`}>
        <div className={styles.topOrnament}>✦</div>
        <p className={`${styles.invitedText} font-script`}>{t.walimatulurus}</p>
        <h1 className={styles.coupleName}>
          <span>{config.groomName}</span>
          <span className={styles.ampersand}>&</span>
          <span>{config.brideName}</span>
        </h1>
        <p className={styles.date}>{config.weddingDay}, {config.weddingDate ? new Date(config.weddingDate + 'T00:00:00').toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ms-MY', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
        <button className={`btn ${styles.openBtn}`} onClick={onOpen} aria-label={t.openInvitation}>
          <span>{t.openInvitation}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </section>
  );
}
