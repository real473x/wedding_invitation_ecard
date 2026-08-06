'use client';
import { WeddingConfig } from '@/lib/db';
import { getElementStyle } from '@/lib/element-styles';
import styles from './InvitationHero.module.css';

import { INVITATION_DICT, Lang, getInvitationText } from '@/lib/i18n';

export default function InvitationHero({ config, style, lang, textOverrides }: { config: WeddingConfig; style?: React.CSSProperties; lang?: Lang; textOverrides?: Record<string, string> }) {
  const currentLang: Lang = lang || config.language || 'ms';
  const t = getInvitationText(currentLang, textOverrides);
  const dateObj = config.weddingDate ? new Date(config.weddingDate + 'T00:00:00') : null;
  const formattedDate = dateObj ? dateObj.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ms-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';

  const secStyle = config.pageStyles?.invitation;

  return (
    <section className={`invitation-section ${styles.hero}`} style={style}>
      <div className={styles.border} style={getElementStyle(secStyle, 'heroFrame', 'headingStyle')}>
        <div className={styles.inner}>
          <div className={styles.topDecor}>
            <span className={styles.star}>✦</span>
            <div className={styles.line} />
            <span className={styles.star}>✦</span>
          </div>

          <p className={`${styles.subtitle} font-script fade-in-up`} style={getElementStyle(secStyle, 'subtitle', 'accentStyle')}>{t.walimatulurus}</p>

          <h1 className={`${styles.groom} fade-in-up delay-1`} style={getElementStyle(secStyle, 'groom', 'headingStyle')}>{config.groomFullName}</h1>
          <div className={`ornament-divider ${styles.heroDivider} fade-in-up delay-1`}>
            <span className={`font-script ${styles.ampersand}`} style={getElementStyle(secStyle, 'ampersand', 'accentStyle')}>&amp;</span>
          </div>
          <h1 className={`${styles.bride} fade-in-up delay-2`} style={getElementStyle(secStyle, 'bride', 'headingStyle')}>{config.brideFullName}</h1>

          <div className={`${styles.dateWrap} fade-in-up delay-2`}>
            <div className={styles.dateLine} />
            <div className={styles.dateContent}>
              <span className={styles.dateLabel} style={getElementStyle(secStyle, 'dateLabel', 'bodyStyle')}>{t.heroDateLabel}</span>
              <span className={styles.dateText} style={getElementStyle(secStyle, 'dateText', 'headingStyle')}>
                {textOverrides?.hasOwnProperty('heroDate') 
                  ? (textOverrides.heroDate || '') 
                  : formattedDate}
              </span>
            </div>
            <div className={styles.dateLine} />
          </div>

          <div className={`${styles.venueWrap} fade-in-up delay-3`}>
            <span className={styles.venueLabel} style={getElementStyle(secStyle, 'venueLabel', 'bodyStyle')}>{t.heroVenueLabel}</span>
            <span className={styles.venueName} style={getElementStyle(secStyle, 'venueName', 'headingStyle')}>{config.venue}</span>
            <span className={styles.venueAddr} style={getElementStyle(secStyle, 'venueAddr', 'bodyStyle')}>{config.venueAddress}</span>
          </div>

          {config.quote && (
            <div className={`${styles.quoteWrap} fade-in-up delay-4`} style={getElementStyle(secStyle, 'quote', 'bodyStyle')}>
              <p className={styles.quote}>{config.quote}</p>
              {config.quoteSource && <p className={styles.quoteSource} style={getElementStyle(secStyle, 'quoteSource', 'accentStyle')}>{config.quoteSource}</p>}
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
