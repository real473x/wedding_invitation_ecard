'use client';
import { useEffect, useState } from 'react';
import { WeddingConfig } from '@/lib/db';
import { getElementStyle } from '@/lib/element-styles';
import styles from './CountdownSection.module.css';

function useCountdown(targetDate: string) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, passed: false });
  useEffect(() => {
    function calc() {
      const target = new Date(targetDate + 'T00:00:00').getTime();
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0, passed: true }); return; }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        passed: false,
      });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

import { INVITATION_DICT, Lang, getInvitationText } from '@/lib/i18n';

export default function CountdownSection({ config, style, lang, textOverrides }: { config: WeddingConfig; style?: React.CSSProperties; lang?: Lang; textOverrides?: Record<string, string> }) {
  const currentLang: Lang = lang || config.language || 'ms';
  const t = getInvitationText(currentLang, textOverrides);
  const countdown = useCountdown(config.weddingDate);
  const dateObj = config.weddingDate ? new Date(config.weddingDate + 'T00:00:00') : null;
  const dayNum = dateObj ? dateObj.getDate() : '';
  const monthName = dateObj ? dateObj.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'ms-MY', { month: 'long' }) : '';
  const yearNum = dateObj ? dateObj.getFullYear() : '';
  const secStyle = config.pageStyles?.countdown;

  return (
    <section className={`invitation-section ${styles.section}`} style={style}>
      <div className={styles.container}>
        <p className={`font-script ${styles.sectionLabel}`} style={getElementStyle(secStyle, 'countdownTitle', 'headingStyle')}>{t.countdownTitle}</p>

        {/* Calendar Card */}
        <div className={styles.calCard} style={getElementStyle(secStyle, 'countdownCalendarCard', 'headingStyle')}>
          <div className={styles.calHeader}>{config.weddingDay}</div>
          <div className={styles.calBody}>
            <span className={styles.calDay}>{dayNum}</span>
            <span className={styles.calMonth}>{monthName} {yearNum}</span>
          </div>
        </div>

        {/* Countdown */}
        {countdown.passed ? (
          <div className={styles.passed}>🎉 {t.countdownEventPassed}</div>
        ) : (
          <div className={styles.countdown}>
            {[
              { val: countdown.days, label: t.days },
              { val: countdown.hours, label: t.hours },
              { val: countdown.minutes, label: t.minutes },
              { val: countdown.seconds, label: t.seconds },
            ].map(({ val, label }) => (
              <div key={label} className={styles.unit}>
                <span className={styles.num} style={getElementStyle(secStyle, 'countdownCircles', 'headingStyle')}>{String(val).padStart(2, '0')}</span>
                <span className={styles.label} style={getElementStyle(secStyle, 'countdownLabels', 'bodyStyle')}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Event details */}
        <div className={styles.details} style={getElementStyle(secStyle, 'countdownEventDetailsCard', 'headingStyle')}>
          <div className={styles.detailRow}>
            <span className={styles.detailIcon}>🕐</span>
            <div>
              <span className={styles.detailLabel} style={getElementStyle(secStyle, 'countdownDetailLabel', 'bodyStyle')}>Masa</span>
              <span className={styles.detailValue} style={getElementStyle(secStyle, 'countdownDetailValue', 'headingStyle')}>{config.weddingTime}</span>
            </div>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailIcon}>📍</span>
            <div>
              <span className={styles.detailLabel} style={getElementStyle(secStyle, 'countdownDetailLabel', 'bodyStyle')}>Tempat</span>
              <span className={styles.detailValue} style={getElementStyle(secStyle, 'countdownDetailValue', 'headingStyle')}>{config.venue}</span>
              <span className={styles.detailSub} style={getElementStyle(secStyle, 'countdownDetailSub', 'bodyStyle')}>{config.venueAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
