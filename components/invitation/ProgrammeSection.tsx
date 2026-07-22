'use client';
import { WeddingConfig } from '@/lib/db';
import styles from './ProgrammeSection.module.css';

import { INVITATION_DICT, Lang } from '@/lib/i18n';

export default function ProgrammeSection({ config, style, lang }: { config: WeddingConfig; style?: React.CSSProperties; lang?: Lang }) {
  const currentLang: Lang = lang || config.language || 'ms';
  const t = INVITATION_DICT[currentLang];

  return (
    <section className={`invitation-section ${styles.section}`} style={style}>
      <div className={styles.container}>
        <p className={`font-script ${styles.label}`}>{t.eventSchedule}</p>
        <div className={`ornament-divider ${styles.orn}`}><span></span></div>
        <div className={styles.timeline}>
          {config.programme.map((item, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.timeCol}>
                <span className={styles.time}>{item.time}</span>
              </div>
              <div className={styles.lineCol}>
                <div className={styles.dot} />
                {i < config.programme.length - 1 && <div className={styles.connector} />}
              </div>
              <div className={styles.eventCol}>
                <div className={styles.eventCard}>
                  <span className={styles.eventText}>{item.event}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
