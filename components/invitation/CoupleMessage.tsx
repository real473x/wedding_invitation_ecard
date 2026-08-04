'use client';
import { WeddingConfig } from '@/lib/db';
import styles from './CoupleMessage.module.css';
import AdaptiveTextSection from './AdaptiveTextSection';

import { Lang, getInvitationText } from '@/lib/i18n';

export default function CoupleMessage({ config, style, lang, textOverrides }: { config: WeddingConfig; style?: React.CSSProperties; lang?: Lang; textOverrides?: Record<string, string> }) {
  const currentLang: Lang = lang || config.language || 'ms';
  const t = getInvitationText(currentLang, textOverrides);
  return (
    <AdaptiveTextSection className={`invitation-section ${styles.section}`} style={style}>
      <div className={styles.container}>
        <div className={styles.quoteIcon}>&ldquo;</div>
        <p className={`font-script ${styles.title}`}>{config.coupleMessageTitle}</p>
        <div className={`ornament-divider ${styles.orn}`}><span></span></div>
        <p className={styles.message}>{config.coupleMessage}</p>
        <div className={styles.signature}>
          <span className={`font-script`}>{config.groomName} &amp; {config.brideName}</span>
        </div>
        <div className={styles.ringsIcon}>💍</div>
      </div>
    </AdaptiveTextSection>
  );
}
