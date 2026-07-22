'use client';
import { WeddingConfig } from '@/lib/db';
import styles from './InvitationHero.module.css';

import { INVITATION_DICT, Lang } from '@/lib/i18n';

export default function InvitationHero({ config, style, lang }: { config: WeddingConfig; style?: React.CSSProperties; lang?: Lang }) {
  const currentLang: Lang = lang || config.language || 'ms';
  const t = INVITATION_DICT[currentLang];
  const dateObj = config.weddingDate ? new Date(config.weddingDate + 'T00:00:00') : null;
  const formattedDate = dateObj ? dateObj.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ms-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <section className={`invitation-section ${styles.hero}`} style={style}>
      <div className={styles.border}>
        <div className={styles.inner}>
          <div className={styles.topDecor}>
            <span className={styles.star}>✦</span>
            <div className={styles.line} />
            <span className={styles.star}>✦</span>
          </div>

          <p className={`${styles.subtitle} font-script fade-in-up`}>{t.walimatulurus}</p>

          <h1 className={`${styles.groom} fade-in-up delay-1`}>{config.groomFullName}</h1>
          <div className={`ornament-divider ${styles.heroDivider} fade-in-up delay-1`}>
            <span className={`font-script ${styles.ampersand}`}>&amp;</span>
          </div>
          <h1 className={`${styles.bride} fade-in-up delay-2`}>{config.brideFullName}</h1>

          <div className={`${styles.dateWrap} fade-in-up delay-2`}>
            <div className={styles.dateLine} />
            <div className={styles.dateContent}>
              <span className={styles.dateLabel}>{currentLang === 'en' ? 'Date' : 'Tarikh'}</span>
              <span className={styles.dateText}>{formattedDate}</span>
            </div>
            <div className={styles.dateLine} />
          </div>

          <div className={`${styles.venueWrap} fade-in-up delay-3`}>
            <span className={styles.venueLabel}>{currentLang === 'en' ? 'Venue' : 'Tempat Majlis'}</span>
            <span className={styles.venueName}>{config.venue}</span>
            <span className={styles.venueAddr}>{config.venueAddress}</span>
          </div>

          {config.quote && (
            <div className={`${styles.quoteWrap} fade-in-up delay-4`}>
              <p className={styles.quote}>{config.quote}</p>
              {config.quoteSource && <p className={styles.quoteSource}>{config.quoteSource}</p>}
            </div>
          )}

          <div className={styles.bottomDecor}>
            <span className={styles.star}>✦</span>
            <div className={styles.line} />
            <span className={styles.star}>✦</span>
          </div>
        </div>
      </div>
    </section>
  );
}
