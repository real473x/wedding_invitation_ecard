'use client';
import React, { useState } from 'react';
import html2canvas from 'html2canvas';

interface iPhoneRecorderModalProps {
  loginId: string;
  isOpen: boolean;
  onClose: () => void;
  lang?: 'ms' | 'en';
}

const sectionsList = [
  { key: 'gate', label: 'Skrin Pembuka (Gate)' },
  { key: 'invitation', label: 'Jemputan Utama (Hero)' },
  { key: 'parents', label: 'Keluarga' },
  { key: 'countdown', label: 'Tarikh & Masa' },
  { key: 'programme', label: 'Aturcara' },
  { key: 'gallery', label: 'Galeri' },
  { key: 'message', label: 'Mesej Pengantin' },
  { key: 'closing', label: 'Penutup' },
];

/**
 * Runs inside the popup window. Self-contained & serialized via .toString()
 */
function recorderMain(config: {
  src: string;
  lang: 'ms' | 'en';
  showPhoneFrame: boolean;
  pageDurationMs: number;
  includeAudio: boolean;
  loginId: string;
  sections: { key: string; label: string }[];
}) {
  const $ = (id: string) => document.getElementById(id) as HTMLElement;
  const statusEl = $('rec-status');
  const progressEl = $('rec-progress') as HTMLDivElement;
  const startBtn = $('rec-start') as HTMLButtonElement;
  const stopBtn = $('rec-stop') as HTMLButtonElement;
  const downloadWrap = $('rec-download-wrap');
  const downloadLink = $('rec-download') as HTMLAnchorElement;
  const errorEl = $('rec-error');
  const iframeEl = document.getElementById('rec-iframe') as HTMLIFrameElement;

  let abort = false;
  let mediaRecorder: MediaRecorder | null = null;
  let audioCtx: AudioContext | null = null;
  let animFrameId: number | null = null;

  function showError(msg: string) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }

  function captureAudioTrack(): MediaStreamTrack | null {
    try {
      const audioEl =
        iframeEl.contentDocument?.querySelector<HTMLAudioElement>('audio') || null;
      if (!audioEl) return null;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioCtx();
      const dest = audioCtx.createMediaStreamDestination();
      const source = audioCtx.createMediaElementSource(audioEl);
      source.connect(dest);
      source.connect(audioCtx.destination);

      if (audioEl.paused) {
        audioEl.currentTime = 0;
        audioEl.play().catch(() => {});
      }
      return dest.stream.getAudioTracks()[0] || null;
    } catch (e) {
      console.warn('Audio capture notice:', e);
      return null;
    }
  }

  async function start() {
    errorEl.style.display = 'none';
    downloadWrap.style.display = 'none';
    startBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    abort = false;

    // STEP 1: Refresh website preview screen to reset to initial state
    statusEl.textContent = config.lang === 'en' ? 'Refreshing preview page...' : 'Memuat semula halaman pratonton...';
    progressEl.style.width = '5%';

    await new Promise<void>((resolve) => {
      let resolved = false;
      const done = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };
      iframeEl.onload = done;
      iframeEl.src = config.src;
      setTimeout(done, 1200);
    });

    await new Promise((r) => setTimeout(r, 500));

    if (abort) return;

    // STEP 2: Pre-cache clean snapshots for each section BEFORE starting MediaRecorder
    // This removes html2canvas thread locks from the live recording process entirely!
    const snapshots: (HTMLCanvasElement | null)[] = [];
    const total = config.sections.length;

    for (let i = 0; i < total; i++) {
      if (abort) break;
      const sec = config.sections[i];
      statusEl.textContent = `Menyediakan: ${sec.label} (${i + 1}/${total})`;
      progressEl.style.width = `${5 + Math.round(((i + 1) / total) * 35)}%`;

      if (iframeEl.contentWindow) {
        if (i === 1) {
          // Open gate transition when moving from Gate to Hero section
          iframeEl.contentWindow.postMessage({ type: 'OPEN_GATE' }, '*');
          await new Promise((r) => setTimeout(r, 700));
        }
        iframeEl.contentWindow.postMessage({ type: 'PREVIEW_SELECT_SECTION', sectionId: sec.key }, '*');
      }

      await new Promise((r) => setTimeout(r, 400));

      let snap: HTMLCanvasElement | null = null;
      if (iframeEl.contentDocument && iframeEl.contentDocument.body) {
        try {
          const h2c = (window as unknown as { html2canvas: typeof html2canvas }).html2canvas || html2canvas;
          if (h2c) {
            snap = await h2c(iframeEl.contentDocument.body, {
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#111827',
              windowWidth: 390,
              windowHeight: 844,
              scale: 1.5,
              logging: false,
            });
          }
        } catch (e) {
          console.warn('Snapshot notice:', e);
        }
      }
      snapshots.push(snap);
    }

    if (abort) return;

    // STEP 3: Setup Canvas & MediaRecorder NOW that snapshots are pre-loaded in memory
    const CANVAS_W = 1179;
    const CANVAS_H = 2556;
    const renderCanvas = document.createElement('canvas');
    renderCanvas.width = CANVAS_W;
    renderCanvas.height = CANVAS_H;
    const ctx = renderCanvas.getContext('2d');

    if (!ctx) {
      showError('Gagal menyediakan canvas perakam.');
      return;
    }

    // Capture 30FPS stream directly from renderCanvas
    const canvasStream = renderCanvas.captureStream(30);

    if (config.includeAudio) {
      const audioTrack = captureAudioTrack();
      if (audioTrack) {
        canvasStream.addTrack(audioTrack);
      }
    }

    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      } else {
        mimeType = 'video/webm';
      }
    }

    const recordedChunks: Blob[] = [];
    mediaRecorder = new MediaRecorder(canvasStream, {
      mimeType,
      videoBitsPerSecond: 4000000,
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      const blob = new Blob(recordedChunks, { type: mimeType.includes('mp4') ? 'video/mp4' : 'video/webm' });
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = `eWedding_${config.loginId}_Video.${mimeType.includes('mp4') ? 'mp4' : 'webm'}`;
      downloadWrap.style.display = 'block';
      stopBtn.style.display = 'none';
      startBtn.style.display = 'inline-block';
      startBtn.textContent = config.lang === 'en' ? '🔁 Record Again' : '🔁 Rakam Semula';
      document.title = config.lang === 'en' ? '✅ Video Ready' : '✅ Video Sedia';
      if (audioCtx) audioCtx.close().catch(() => {});
    };

    // Start recording ONLY ONCE snapshots are 100% pre-loaded!
    mediaRecorder.start();

    // STEP 4: Start smooth playback loop across pre-loaded section snapshots
    const startTime = performance.now();
    const totalDurationMs = total * config.pageDurationMs;

    function drawFrame() {
      if (abort) return;

      const elapsed = performance.now() - startTime;
      const progressRatio = Math.min(elapsed / totalDurationMs, 1);
      const currentSecIdx = Math.min(Math.floor(elapsed / config.pageDurationMs), total - 1);

      progressEl.style.width = `${40 + Math.round(progressRatio * 60)}%`;
      statusEl.textContent = `Merekod: ${config.sections[currentSecIdx].label} (${currentSecIdx + 1}/${total})`;
      document.title = `🔴 ${Math.round(progressRatio * 100)}%`;

      const currentSnap = snapshots[currentSecIdx];

      if (config.showPhoneFrame) {
        // Mode 1: iPhone 17 Pro Titanium Frame + Dynamic Island
        const bgGrad = ctx!.createLinearGradient(0, 0, CANVAS_W, CANVAS_H);
        bgGrad.addColorStop(0, '#1a1d27');
        bgGrad.addColorStop(0.5, '#0f1117');
        bgGrad.addColorStop(1, '#050608');
        ctx!.fillStyle = bgGrad;
        ctx!.fillRect(0, 0, CANVAS_W, CANVAS_H);

        const framePadding = 48;
        const phoneW = CANVAS_W - framePadding * 2;
        const phoneH = CANVAS_H - framePadding * 2;
        const cornerRadius = 140;

        ctx!.save();
        ctx!.shadowColor = 'rgba(0,0,0,0.7)';
        ctx!.shadowBlur = 60;
        ctx!.shadowOffsetY = 30;

        ctx!.beginPath();
        ctx!.roundRect(framePadding, framePadding, phoneW, phoneH, cornerRadius);
        ctx!.fillStyle = '#22252a';
        ctx!.fill();
        ctx!.restore();

        const bezelGrad = ctx!.createLinearGradient(framePadding, framePadding, framePadding + phoneW, framePadding + phoneH);
        bezelGrad.addColorStop(0, 'rgba(255,255,255,0.25)');
        bezelGrad.addColorStop(0.3, 'rgba(255,255,255,0.05)');
        bezelGrad.addColorStop(0.7, 'rgba(255,255,255,0.02)');
        bezelGrad.addColorStop(1, 'rgba(255,255,255,0.15)');
        ctx!.lineWidth = 14;
        ctx!.strokeStyle = bezelGrad;
        ctx!.stroke();

        const screenPadding = 24;
        const screenX = framePadding + screenPadding;
        const screenY = framePadding + screenPadding;
        const screenW = phoneW - screenPadding * 2;
        const screenH = phoneH - screenPadding * 2;
        const screenRadius = cornerRadius - screenPadding;

        ctx!.save();
        ctx!.beginPath();
        ctx!.roundRect(screenX, screenY, screenW, screenH, screenRadius);
        ctx!.clip();

        ctx!.fillStyle = '#111827';
        ctx!.fillRect(screenX, screenY, screenW, screenH);

        if (currentSnap) {
          ctx!.drawImage(currentSnap, screenX, screenY, screenW, screenH);
        }

        const islandW = 340;
        const islandH = 95;
        const islandX = CANVAS_W / 2 - islandW / 2;
        const islandY = screenY + 40;

        ctx!.beginPath();
        ctx!.roundRect(islandX, islandY, islandW, islandH, 50);
        ctx!.fillStyle = '#000000';
        ctx!.fill();
        ctx!.lineWidth = 3;
        ctx!.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx!.stroke();

        ctx!.beginPath();
        ctx!.arc(islandX + islandW - 55, islandY + islandH / 2, 16, 0, Math.PI * 2);
        ctx!.fillStyle = '#101014';
        ctx!.fill();

        ctx!.restore();
      } else {
        // Mode 2: No frame video (iPhone 17 Pro/Pro Max screen without frame & without Dynamic Island)
        ctx!.fillStyle = '#0a0d14';
        ctx!.fillRect(0, 0, CANVAS_W, CANVAS_H);

        if (currentSnap) {
          ctx!.drawImage(currentSnap, 0, 0, CANVAS_W, CANVAS_H);
        }
      }

      if (elapsed < totalDurationMs && !abort) {
        animFrameId = requestAnimationFrame(drawFrame);
      } else {
        statusEl.textContent = config.lang === 'en' ? 'Finishing up video...' : 'Menyiapkan fail video...';
        stop();
      }
    }

    drawFrame();
  }

  function stop() {
    abort = true;
    if (animFrameId) cancelAnimationFrame(animFrameId);
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    } else {
      stopBtn.style.display = 'none';
      startBtn.style.display = 'inline-block';
    }
  }

  startBtn.addEventListener('click', start);
  stopBtn.addEventListener('click', stop);
  window.addEventListener('beforeunload', () => {
    stop();
  });
}

function buildRecorderPopupHtml(config: {
  src: string;
  lang: 'ms' | 'en';
  showPhoneFrame: boolean;
  pageDurationMs: number;
  includeAudio: boolean;
  loginId: string;
  sections: { key: string; label: string }[];
}): string {
  const title = config.lang === 'en' ? 'Recording' : 'Merekod Video';
  const startLabel = config.lang === 'en' ? '▶️ Start Recording' : '▶️ Mula Rakam Video';
  const stopLabel = config.lang === 'en' ? '⏹️ Stop' : '⏹️ Hentikan';
  const downloadLabel = config.lang === 'en' ? '⬇️ Download Video' : '⬇️ Muat Turun Video';
  const hint =
    config.lang === 'en'
      ? 'Click Start Recording. The video will generate automatically.'
      : 'Klik Mula Rakam Video. Video akan dihasilkan secara automatik.';

  const phoneFrameCss = config.showPhoneFrame
    ? `
      #rec-crop-target {
        position: relative;
        width: 320px;
        height: 660px;
        border-radius: 44px;
        background: #22252a;
        box-shadow: 0 25px 50px rgba(0,0,0,0.7);
        border: 4px solid rgba(255,255,255,0.18);
        padding: 10px;
        box-sizing: border-box;
      }
      #rec-screen-slot {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 34px;
        overflow: hidden;
        background: #111827;
      }
      #rec-island {
        position: absolute;
        top: 18px;
        left: 50%;
        transform: translateX(-50%);
        width: 90px;
        height: 24px;
        background: #000;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.12);
        z-index: 10;
      }
      #rec-iframe {
        width: 390px !important;
        height: 844px !important;
        transform: scale(0.76);
        transform-origin: top left;
        border: 0;
        display: block;
      }
    `
    : `
      #rec-crop-target {
        position: relative;
        width: 300px;
        height: 650px;
        border-radius: 32px;
        overflow: hidden;
        background: #0a0d14;
        box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        box-sizing: border-box;
      }
      #rec-screen-slot {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      #rec-island { display: none; }
      #rec-iframe {
        width: 390px !important;
        height: 844px !important;
        transform: scale(0.76);
        transform-origin: top left;
        border: 0;
        display: block;
      }
    `;

  const islandDiv = config.showPhoneFrame ? '<div id="rec-island"></div>' : '';
  const configJson = JSON.stringify(config).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${title}</title>
<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
<style>
  html, body { margin: 0; padding: 0; background: #0f1117; color: #fff; font-family: system-ui, sans-serif; min-height: 100vh; overflow-y: auto; }
  #rec-wrap { display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 24px; padding: 24px; box-sizing: border-box; min-height: 100vh; }
  #rec-stage { display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg,#1a1d27,#0f1117 50%,#050608); border-radius: 20px; padding: 20px; box-sizing: border-box; }
  ${phoneFrameCss}
  #rec-controls { width: 320px; flex-shrink: 0; display: flex; flex-direction: column; gap: 14px; background: #181b24; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 24px; box-sizing: border-box; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
  #rec-title { font-size: 1.1rem; font-weight: 800; color: #C9A84C; margin: 0 0 4px 0; }
  #rec-hint { font-size: 12px; color: #9ca3af; line-height: 1.4; }
  #rec-status { font-size: 13px; color: #C9A84C; min-height: 18px; font-weight: 600; }
  #rec-progress-track { width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
  #rec-progress { width: 0%; height: 100%; background: #C9A84C; transition: width .3s; }
  button { border: none; border-radius: 12px; padding: 12px 18px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  #rec-start { background: linear-gradient(135deg,#C9A84C,#b8963f); color: #111; width: 100%; box-shadow: 0 4px 12px rgba(201,168,76,0.3); }
  #rec-start:hover { transform: translateY(-1px); filter: brightness(1.08); }
  #rec-stop { background: #dc2626; color: #fff; display: none; width: 100%; }
  #rec-download-wrap { display: none; width: 100%; text-align: center; }
  #rec-download { display: inline-block; width: 100%; box-sizing: border-box; padding: 12px; background: linear-gradient(135deg,#16a34a,#22c55e); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(34,197,94,0.3); }
  #rec-error { display: none; color: #f87171; font-size: 12px; background: rgba(248,113,113,0.1); padding: 8px 12px; border-radius: 8px; }

  @media (max-width: 720px) {
    #rec-wrap { flex-direction: column; }
    #rec-controls { width: 100%; max-width: 340px; }
  }
</style>
</head>
<body>
  <div id="rec-wrap">
    <div id="rec-stage">
      <div id="rec-crop-target">
        <div id="rec-screen-slot">
          <iframe id="rec-iframe" src="${config.src}"></iframe>
        </div>
        ${islandDiv}
      </div>
    </div>
    <div id="rec-controls">
      <h3 id="rec-title">🎥 ${config.lang === 'en' ? 'Recorder Control' : 'Kawalan Perakam'}</h3>
      <div id="rec-hint">${hint}</div>
      <div id="rec-error"></div>
      <div id="rec-status"></div>
      <div id="rec-progress-track"><div id="rec-progress"></div></div>
      <button id="rec-start">${startLabel}</button>
      <button id="rec-stop">${stopLabel}</button>
      <div id="rec-download-wrap">
        <a id="rec-download">${downloadLabel}</a>
      </div>
    </div>
  </div>
  <script>(${recorderMain.toString()})(${configJson});</script>
</body>
</html>`;
}

export default function IPhoneRecorderModal({
  loginId,
  isOpen,
  onClose,
  lang = 'ms',
}: iPhoneRecorderModalProps) {
  const [showPhoneFrame, setShowPhoneFrame] = useState<boolean>(true);
  const [pageDuration, setPageDuration] = useState<number>(5.0);
  const [includeAudio, setIncludeAudio] = useState<boolean>(true);
  const [popupOpened, setPopupOpened] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  function launchRecorderPopup() {
    setErrorMsg(null);

    const iframeEl = document.querySelector<HTMLIFrameElement>('iframe');
    if (!iframeEl || !iframeEl.src) {
      setErrorMsg(
        lang === 'en'
          ? 'Could not find the preview iframe to record.'
          : 'Tidak dapat mengesan iframe pratonton untuk dirakam.'
      );
      return;
    }

    const popup = window.open('', '_blank', 'width=880,height=760,noopener=no');
    if (!popup) {
      setErrorMsg(
        lang === 'en'
          ? 'Popup was blocked. Please allow popups for this site and try again.'
          : 'Pop-up disekat. Sila benarkan pop-up untuk laman ini dan cuba lagi.'
      );
      return;
    }

    const html = buildRecorderPopupHtml({
      src: iframeEl.src,
      lang,
      showPhoneFrame,
      pageDurationMs: pageDuration * 1000,
      includeAudio,
      loginId,
      sections: sectionsList,
    });

    popup.document.open();
    popup.document.write(html);
    popup.document.close();
    popup.focus();

    setPopupOpened(true);
  }

  return (
    <div className="popup-overlay" style={{ zIndex: 10000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div
        className="popup-sheet"
        style={{
          maxWidth: '520px',
          background: 'var(--admin-card-bg)',
          border: '1px solid var(--admin-border)',
          borderRadius: '24px',
          padding: '1.75rem',
          color: 'var(--admin-text)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#C9A84C', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            🎥 {lang === 'en' ? 'iPhone 17 Pro Video Recorder' : 'Perakam Video iPhone 17 Pro'}
            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(234,179,8,0.15)', color: '#eab308', border: '1px solid rgba(234,179,8,0.3)', fontWeight: 700 }}>
              🧪 Experimental
            </span>
          </h3>
          <button onClick={onClose} className="popup-close">
            ✕
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
          {lang === 'en'
            ? 'Recording opens in a separate window so this page stays free to use while it runs.'
            : 'Rakaman akan dibuka dalam tetingkap berasingan supaya halaman ini kekal boleh digunakan semasa rakaman berjalan.'}
        </p>

        {errorMsg && (
          <div
            style={{
              fontSize: '0.78rem',
              color: '#f87171',
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.3)',
              borderRadius: '10px',
              padding: '0.6rem 0.75rem',
              marginBottom: '1.25rem',
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {popupOpened && (
          <div
            style={{
              fontSize: '0.78rem',
              color: '#4ade80',
              background: 'rgba(74,222,128,0.08)',
              border: '1px solid rgba(74,222,128,0.3)',
              borderRadius: '10px',
              padding: '0.6rem 0.75rem',
              marginBottom: '1.25rem',
            }}
          >
            ✅ {lang === 'en'
              ? 'Recorder window opened. You can keep using this page — the download link will appear in that window when it finishes.'
              : 'Tetingkap perakam dibuka. Anda boleh terus guna halaman ini — pautan muat turun akan muncul di tetingkap itu apabila selesai.'}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
              {lang === 'en' ? 'Video Frame Format' : 'Gaya Format Video'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                onClick={() => setShowPhoneFrame(true)}
                style={{
                  background: showPhoneFrame ? 'rgba(201,168,76,0.18)' : 'var(--admin-stat-bg)',
                  border: `1.5px solid ${showPhoneFrame ? '#C9A84C' : 'var(--admin-border)'}`,
                  color: showPhoneFrame ? '#C9A84C' : 'var(--admin-text)',
                  padding: '0.65rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                }}
              >
                📱 Bingkai iPhone 17 Pro
              </button>
              <button
                onClick={() => setShowPhoneFrame(false)}
                style={{
                  background: !showPhoneFrame ? 'rgba(201,168,76,0.18)' : 'var(--admin-stat-bg)',
                  border: `1.5px solid ${!showPhoneFrame ? '#C9A84C' : 'var(--admin-border)'}`,
                  color: !showPhoneFrame ? '#C9A84C' : 'var(--admin-text)',
                  padding: '0.65rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                }}
              >
                🎬 No frame video
              </button>
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
              {lang === 'en'
                ? `Duration per Page (${pageDuration}s)`
                : `Tempoh Paparan Setiap Skrin (${pageDuration} saat)`}
            </label>
            <input
              type="range"
              min="3"
              max="10"
              step="0.5"
              value={pageDuration}
              onChange={(e) => setPageDuration(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#C9A84C' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--admin-stat-bg)', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-text)', display: 'block' }}>
                🎵 {lang === 'en' ? 'Record Audio / Music' : 'Rakam Audio & Lagu Latar'}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>
                {lang === 'en' ? 'Captured directly with full quality' : 'Dirakam terus secara automatik'}
              </span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={includeAudio} onChange={(e) => setIncludeAudio(e.target.checked)} />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={launchRecorderPopup}
            className="btn btn-primary"
            style={{ flex: 1, padding: '0.8rem', fontSize: '0.9rem' }}
          >
            🪟 {lang === 'en' ? 'Open Recorder Window' : 'Buka Tetingkap Perakam'}
          </button>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.8rem 1.25rem' }}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
