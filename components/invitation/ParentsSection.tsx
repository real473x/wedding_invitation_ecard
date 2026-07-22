'use client';
import { WeddingConfig } from '@/lib/db';
import styles from './ParentsSection.module.css';
import AdaptiveTextSection from './AdaptiveTextSection';

import { INVITATION_DICT, Lang } from '@/lib/i18n';

export default function ParentsSection({ config, style, lang }: { config: WeddingConfig; style?: React.CSSProperties; lang?: Lang }) {
  const currentLang: Lang = lang || config.language || 'ms';
  const t = INVITATION_DICT[currentLang];

  return (
    <AdaptiveTextSection className={`invitation-section ${styles.section}`} style={style}>
      <div className={styles.card}>
        <div className={`${styles.topLine} ornament-divider`}><span></span></div>
        <p className={`font-script ${styles.syukur}`}>{t.parentsInviting}</p>
        <div className={styles.parents}>
          <div className={styles.parentCouple}>
            <p className={styles.parentRole}>{currentLang === 'en' ? "Groom's Family" : 'Keluarga Pengantin Lelaki'}</p>
            <p className={styles.parentNames}>{config.groomFatherName}</p>
            <span className={styles.parentAnd}>&amp;</span>
            <p className={styles.parentNames}>{config.groomMotherName}</p>
          </div>
          <div className={styles.dividerVert} />
          <div className={styles.parentCouple}>
            <p className={styles.parentRole}>{currentLang === 'en' ? "Bride's Family" : 'Keluarga Pengantin Perempuan'}</p>
            <p className={styles.parentNames}>{config.brideFatherName}</p>
            <span className={styles.parentAnd}>&amp;</span>
            <p className={styles.parentNames}>{config.brideMotherName}</p>
          </div>
        </div>
        <div className={styles.inviteText}>
          <p>{currentLang === 'en' ? 'Warmly invite you' : 'Menjemput'}</p>
          <p className={styles.inviteTitle}>{currentLang === 'en' ? 'Our Valued Guests' : 'Dato\' / Datin / Tuan / Puan / Encik / Cik'}</p>
          <p>{currentLang === 'en' ? 'to celebrate the wedding of our children' : 'ke Majlis Perkahwinan Anak Kami'}</p>
        </div>
        <div className={styles.coupleNames}>
          <h2>{config.groomName}</h2>
          <span className={`font-script ${styles.amp}`}>&amp;</span>
          <h2>{config.brideName}</h2>
        </div>
        <div className={`ornament-divider ${styles.bottomLine}`}><span></span></div>
      </div>
    </AdaptiveTextSection>
  );
}
