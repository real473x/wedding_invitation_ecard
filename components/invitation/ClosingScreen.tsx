'use client';
import { useState } from 'react';
import { WeddingConfig } from '@/lib/db';
import { getElementStyle } from '@/lib/element-styles';
import styles from './ClosingScreen.module.css';
import AdaptiveTextSection from './AdaptiveTextSection';

export function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  let videoId = '';
  const watchMatch = url.match(/[?&]v=([^&#]+)/);
  if (watchMatch) {
    videoId = watchMatch[1];
  } else {
    const shortMatch = url.match(/youtu\.be\/([^&#?]+)/);
    if (shortMatch) {
      videoId = shortMatch[1];
    } else {
      const embedMatch = url.match(/youtube\.com\/embed\/([^&#?]+)/);
      if (embedMatch) {
        videoId = embedMatch[1];
      }
    }
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&enablejsapi=1`;
  }
  return url;
}

import { Lang, getInvitationText } from '@/lib/i18n';

export default function ClosingScreen({ config, style, lang, textOverrides }: { config: WeddingConfig; style?: React.CSSProperties; lang?: Lang; textOverrides?: Record<string, string> }) {
  const currentLang: Lang = lang || config.language || 'ms';
  const t = getInvitationText(currentLang, textOverrides);
  const [isMusicExpanded, setIsMusicExpanded] = useState(false);
  const rawUrl = config.youtubeUrl;
  const embedUrl = getYouTubeEmbedUrl(rawUrl);
  const secStyle = config.pageStyles?.closing;

  return (
    <AdaptiveTextSection className={`invitation-section ${styles.section}`} style={style}>
      <div className={styles.container}>
        <p className={`font-script ${styles.title}`} style={getElementStyle(secStyle, 'closingTitle', 'headingStyle')}>{config.closingTitle}</p>
        <div className={styles.heartAnim}>❤️</div>
        <div className={`ornament-divider ${styles.orn}`}><span></span></div>

        {config.showClosingPhoto !== false && (
          <div className={styles.couplePhotoWrapper}>
            {config.closingPhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={config.closingPhotoUrl} alt="Pasangan Pengantin" className={styles.couplePhoto} />
            ) : (
              <div className={styles.photoPlaceholder}>
                <span className={styles.placeholderHeart}>💍</span>
                <span>Foto Pasangan</span>
              </div>
            )}
          </div>
        )}

        <p className={styles.text} style={getElementStyle(secStyle, 'closingText', 'bodyStyle')}>{config.closingText}</p>

        <div className={styles.signatures}>
          <div className={styles.sigCouple}>
            <span className={`font-script ${styles.sigName}`} style={getElementStyle(secStyle, 'sigGroom', 'accentStyle')}>{config.groomName}</span>
            <div className={styles.sigLine} />
          </div>
          <div className={styles.sigHeart}>💍</div>
          <div className={styles.sigCouple}>
            <span className={`font-script ${styles.sigName}`} style={getElementStyle(secStyle, 'sigBride', 'accentStyle')}>{config.brideName}</span>
            <div className={styles.sigLine} />
          </div>
        </div>

        {rawUrl && (
          <div className={styles.musicPlayerContainer}>
            <button 
              type="button"
              className={styles.musicNoteToggle} 
              onClick={() => setIsMusicExpanded(prev => !prev)}
              title={t.toggleYoutubePlayerTooltip}
            >
              <span className={`${styles.musicIcon} ${!isMusicExpanded ? styles.musicIconSpinning : ''}`}>🎵</span>
              <span>Muzik Latar (Pemain YouTube) {isMusicExpanded ? '▲' : '▼'}</span>
            </button>
            <div className={`${styles.playerWrapper} ${isMusicExpanded ? styles.playerExpanded : ''}`}>
              <iframe
                src={embedUrl}
                allow="autoplay; encrypted-media"
                className={styles.ytFrameVisible}
                title={t.bgMusicTitle}
              />
            </div>
          </div>
        )}

        <p className={styles.credit}>Dibuat dengan ❤️ oleh eWedding</p>
      </div>
    </AdaptiveTextSection>
  );
}

