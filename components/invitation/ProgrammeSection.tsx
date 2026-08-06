'use client';
import { WeddingConfig } from '@/lib/db';
import { getElementStyle } from '@/lib/element-styles';
import styles from './ProgrammeSection.module.css';

import { INVITATION_DICT, Lang, getInvitationText } from '@/lib/i18n';

export default function ProgrammeSection({ config, style, lang, textOverrides }: { config: WeddingConfig; style?: React.CSSProperties; lang?: Lang; textOverrides?: Record<string, string> }) {
  const currentLang: Lang = lang || config.language || 'ms';
  const t = getInvitationText(currentLang, textOverrides);
  const secStyle = config.pageStyles?.programme;

  return (
    <section className={`invitation-section ${styles.section}`} style={style}>
      <div className={styles.container}>
        <p className={`font-script ${styles.label}`} style={getElementStyle(secStyle, 'programmeTitle', 'headingStyle')}>{t.eventSchedule}</p>
        <div className={`ornament-divider ${styles.orn}`}><span></span></div>
        <div className={styles.timeline}>
          {config.programme.map((item, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.timeCol}>
                <span className={styles.time} style={getElementStyle(secStyle, 'programmeTime', 'accentStyle')}>{item.time}</span>
              </div>
              <div className={styles.lineCol}>
                <div className={styles.dot} />
                {i < config.programme.length - 1 && <div className={styles.connector} />}
              </div>
              <div className={styles.eventCol}>
                <div className={styles.eventCard} style={getElementStyle(secStyle, 'programmeCard', 'headingStyle')}>
                  <span className={styles.eventText} style={getElementStyle(secStyle, 'programmeItem', 'bodyStyle')}>{item.event}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
