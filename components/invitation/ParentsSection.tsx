'use client';
import { WeddingConfig } from '@/lib/db';
import { getElementStyle } from '@/lib/element-styles';
import styles from './ParentsSection.module.css';
import AdaptiveTextSection from './AdaptiveTextSection';

import { INVITATION_DICT, Lang, getInvitationText } from '@/lib/i18n';

export default function ParentsSection({ config, style, lang, textOverrides }: { config: WeddingConfig; style?: React.CSSProperties; lang?: Lang; textOverrides?: Record<string, string> }) {
  const currentLang: Lang = lang || config.language || 'ms';
  const t = getInvitationText(currentLang, textOverrides);
  const secStyle = config.pageStyles?.parents;

  return (
    <AdaptiveTextSection className={`invitation-section ${styles.section}`} style={style}>
      <div className={styles.card} style={getElementStyle(secStyle, 'parentsCard', 'headingStyle')}>
        <div className={`${styles.topLine} ornament-divider`}><span></span></div>
        <p className={`font-script ${styles.syukur}`} style={getElementStyle(secStyle, 'syukur', 'headingStyle')}>{t.parentsInviting}</p>
        <div className={styles.parents}>
          <div className={styles.parentCouple}>
            <p className={styles.parentRole} style={getElementStyle(secStyle, 'parentRoleGroom', 'bodyStyle')}>{t.parentsRoleGroom}</p>
            <p className={styles.parentNames} style={getElementStyle(secStyle, 'parentNames', 'headingStyle')}>{config.groomFatherName}</p>
            <span className={styles.parentAnd}>&amp;</span>
            <p className={styles.parentNames} style={getElementStyle(secStyle, 'parentNames', 'headingStyle')}>{config.groomMotherName}</p>
          </div>
          <div className={styles.dividerVert} />
          <div className={styles.parentCouple}>
            <p className={styles.parentRole} style={getElementStyle(secStyle, 'parentRoleBride', 'bodyStyle')}>{t.parentsRoleBride}</p>
            <p className={styles.parentNames} style={getElementStyle(secStyle, 'parentNames', 'headingStyle')}>{config.brideFatherName}</p>
            <span className={styles.parentAnd}>&amp;</span>
            <p className={styles.parentNames} style={getElementStyle(secStyle, 'parentNames', 'headingStyle')}>{config.brideMotherName}</p>
          </div>
        </div>
        <div className={styles.inviteText} style={getElementStyle(secStyle, 'inviteText', 'bodyStyle')}>
          <p>{t.parentsInviteLine1}</p>
          <p className={styles.inviteTitle}>{t.parentsInviteLine2}</p>
          <p>{t.parentsInviteLine3}</p>
        </div>
        <div className={styles.coupleNames}>
          <h2 style={getElementStyle(secStyle, 'coupleNames', 'headingStyle')}>{config.groomName}</h2>
          <span className={`font-script ${styles.amp}`}>&amp;</span>
          <h2 style={getElementStyle(secStyle, 'coupleNames', 'headingStyle')}>{config.brideName}</h2>
        </div>
        <div className={`ornament-divider ${styles.bottomLine}`}><span></span></div>
      </div>
    </AdaptiveTextSection>
  );
}
