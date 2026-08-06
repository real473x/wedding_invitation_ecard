'use client';
import { WeddingConfig } from '@/lib/db';
import { getElementStyle } from '@/lib/element-styles';
import { THEMES } from '@/lib/themes';
import styles from './GateScreen.module.css';

import { INVITATION_DICT, Lang, getInvitationText } from '@/lib/i18n';

interface Props { config: WeddingConfig; onOpen: () => void; isOpen: boolean; isClosing?: boolean; lang?: Lang; textOverrides?: Record<string, string>; }

export default function GateScreen({ config, onOpen, isOpen, isClosing, lang, textOverrides }: Props) {
  const currentLang: Lang = lang || config.language || 'ms';
  const t = getInvitationText(currentLang, textOverrides);
  const themeObj = THEMES.find(t => t.key === config.theme) || THEMES[0];
  const bgUrl = (config.useUnifiedBackground && config.unifiedBackgroundUrl)
    ? config.unifiedBackgroundUrl
    : (config.backgrounds?.gate || themeObj.defaultBg);

  const secStyle = config.pageStyles?.gate;

  const bgStyleLeft = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${bgUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'left center',
  };
  const bgStyleRight = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${bgUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'right center',
  };

  return (
    <section className={`${styles.gate} ${isClosing ? styles.gateClosing : ''}`}>
      {/* Gate doors split line is behind the card */}
      <div className={`${styles.gateWrap} ${isOpen ? styles.gateOpen : ''}`}>
        <div className={styles.gateLeft} style={bgStyleLeft}>
          <div className={styles.gateLatch} />
          <div className={styles.gatePattern} />
        </div>
        <div className={styles.gateRight} style={bgStyleRight}>
          <div className={styles.gatePattern} />
        </div>
      </div>

      {/* Center content (above/on gate) - Etched Stamp Style */}
      <div className={`${styles.content} ${isOpen ? styles.contentFadeOut : ''}`}>
        <div className={styles.topOrnament}>✦</div>
        <p className={`${styles.invitedText} font-script`} style={getElementStyle(secStyle, 'gateWalimatulurus', 'accentStyle')}>{t.walimatulurus}</p>
        <h1 className={styles.coupleName} style={getElementStyle(secStyle, 'gateTitle', 'headingStyle')}>
          <span>{config.groomName}</span>
          <span className={styles.ampersand}>&</span>
          <span>{config.brideName}</span>
        </h1>
        <p className={styles.date} style={getElementStyle(secStyle, 'gateDearGuest', 'bodyStyle')}>
          {textOverrides?.hasOwnProperty('gateDate') 
            ? (textOverrides.gateDate || '') 
            : `${config.weddingDay}, ${config.weddingDate ? new Date(config.weddingDate + 'T00:00:00').toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ms-MY', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}`}
        </p>
        <button className={`btn ${styles.openBtn}`} onClick={onOpen} aria-label={t.openInvitation} style={getElementStyle(secStyle, 'gateOpenBtn', 'headingStyle')}>
          <span>{t.openInvitation}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </section>
  );
}
