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
  autoSimulate: boolean;
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
  const autoSimToggle = $('rec-auto-sim') as HTMLInputElement | null;

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
    abort = false;

    // STEP 1: Hide recording controls panel (it's to the right of the phone frame)
    // This keeps the phone frame visible as the only thing on screen to share
    const controlsPanel = $('rec-controls');
    const recWrap = $('rec-wrap');
    if (controlsPanel) controlsPanel.style.display = 'none';
    if (recWrap) recWrap.style.justifyContent = 'center';

    // Inject HUD to the RIGHT of the phone frame — same position as the hidden controls panel.
    // It will NOT appear in the captured video because it's outside the phone frame area.
    const hud = document.createElement('div');
    hud.id = 'rec-hud';
    hud.style.cssText = `
      position: fixed; right: 20px; top: 50%; transform: translateY(-50%);
      background: rgba(15,17,23,0.95); backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.12); border-radius: 20px;
      padding: 20px 18px; display: flex; flex-direction: column; align-items: stretch; gap: 14px;
      z-index: 9999; font-family: system-ui; color: #fff; font-size: 13px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.7); width: 280px;
    `;
    hud.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:2px;">
        <span style="display:inline-block;width:10px;height:10px;background:#ef4444;border-radius:50%;flex-shrink:0;animation:hudpulse 1s ease-in-out infinite;"></span>
        <span style="font-weight:800;color:#C9A84C;font-size:14px;">🎬 Recording</span>
      </div>
      <span id="hud-status" style="font-weight:500;color:#d1d5db;font-size:12px;line-height:1.5;min-height:36px;">Initialising...</span>
      <div>
        <div style="font-size:11px;color:#6b7280;margin-bottom:5px;">Progress</div>
        <div style="height:6px;width:100%;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
          <div id="hud-progress" style="height:100%;width:0%;background:linear-gradient(90deg,#C9A84C,#e8c46a);transition:width .4s;border-radius:3px;"></div>
        </div>
      </div>
      <button id="hud-stop" style="background:#ef4444;color:#fff;border:none;border-radius:12px;padding:10px 16px;font-size:13px;font-weight:700;cursor:pointer;width:100%;">⏹ Stop Recording</button>
    `;
    const hudStyle = document.createElement('style');
    hudStyle.textContent = '@keyframes hudpulse { 0%,100%{opacity:1} 50%{opacity:0.3} }';
    document.head.appendChild(hudStyle);
    document.body.appendChild(hud);

    const hudStatus = document.getElementById('hud-status')!;
    const hudProgress = document.getElementById('hud-progress') as HTMLDivElement;
    const hudStop = document.getElementById('hud-stop') as HTMLButtonElement;

    function restoreUI() {
      hud.remove();
      if (controlsPanel) controlsPanel.style.display = '';
      if (recWrap) recWrap.style.justifyContent = '';
      startBtn.style.display = 'inline-block';
    }

    hudStop.addEventListener('click', () => { abort = true; stop(); });

    // STEP 2: Request native screen capture BEFORE refreshing the iframe.
    // The refresh must happen AFTER the user approves screen sharing so
    // the recording starts from the very beginning of the Gate cover.
    hudStatus.textContent = config.lang === 'en'
      ? '📺 Select this window in the browser share dialog...'
      : '📺 Pilih tetingkap ini dalam dialog perkongsian...';

    let displayStream: MediaStream;
    try {
      displayStream = await (navigator.mediaDevices as unknown as {
        getDisplayMedia: (opts: unknown) => Promise<MediaStream>
      }).getDisplayMedia({
        video: {
          frameRate: { ideal: 30, max: 60 },
          displaySurface: 'window',
        },
        audio: false,  // We mix invitation audio separately below
        preferCurrentTab: true,
      });
    } catch (e) {
      restoreUI();
      statusEl.textContent = config.lang === 'en' ? 'Recording cancelled.' : 'Rakaman dibatalkan.';
      return;
    }

    if (abort) {
      displayStream.getTracks().forEach(t => t.stop());
      restoreUI();
      return;
    }

    // STEP 3: NOW refresh the iframe — screen sharing is active, recording can begin immediately after.
    hudStatus.textContent = config.lang === 'en'
      ? '⏳ Refreshing invitation to start from beginning...'
      : '⏳ Memuat semula jemputan dari awal...';
    hudProgress.style.width = '5%';

    await new Promise<void>((resolve) => {
      let resolved = false;
      const done = () => { if (!resolved) { resolved = true; resolve(); } };
      iframeEl.onload = done;
      iframeEl.src = config.src;
      setTimeout(done, 1500);
    });
    await new Promise((r) => setTimeout(r, 600));

    if (abort) {
      displayStream.getTracks().forEach(t => t.stop());
      restoreUI();
      return;
    }

    // STEP 4: Build a combined stream — screen video track + invitation audio track
    // We must create a new MediaStream from parts so MediaRecorder picks up both
    const videoTracks = displayStream.getVideoTracks();
    const combinedTracks: MediaStreamTrack[] = [...videoTracks];

    if (config.includeAudio) {
      const audioTrack = captureAudioTrack();
      if (audioTrack) combinedTracks.push(audioTrack);
    }
    const combinedStream = new MediaStream(combinedTracks);

    // STEP 5: Setup MediaRecorder on the combined stream
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'video/webm';
    }

    const recordedChunks: Blob[] = [];
    mediaRecorder = new MediaRecorder(combinedStream, { mimeType, videoBitsPerSecond: 5_000_000 });
    mediaRecorder.ondataavailable = (e) => { if (e.data?.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = () => {
      displayStream.getTracks().forEach(t => t.stop());
      restoreUI();
      const blob = new Blob(recordedChunks, { type: mimeType.includes('mp4') ? 'video/mp4' : 'video/webm' });
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = `eWedding_${config.loginId}_Video.${mimeType.includes('mp4') ? 'mp4' : 'webm'}`;
      downloadWrap.style.display = 'block';
      startBtn.style.display = 'inline-block';
      startBtn.textContent = config.lang === 'en' ? '🔁 Record Again' : '🔁 Rakam Semula';
      document.title = config.lang === 'en' ? '✅ Video Ready' : '✅ Video Sedia';
      if (audioCtx) audioCtx.close().catch(() => {});
    };

    mediaRecorder.start(100);

    // If user clicks "Stop sharing" in browser chrome, auto-stop the recorder
    videoTracks[0]?.addEventListener('ended', () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        abort = true;
        mediaRecorder.stop();
      }
    });

    // STEP 6: Simulation motion sequence — runs while native screen capture records
    const totalSecs = config.sections.length;
    const totalSimDurationMs = 3000 + 2500 + totalSecs * config.pageDurationMs;
    const simStart = performance.now();

    function updateProgress() {
      if (abort) return;
      const elapsed = performance.now() - simStart;
      const ratio = Math.min(elapsed / totalSimDurationMs, 1);
      if (hudProgress) hudProgress.style.width = `${5 + Math.round(ratio * 95)}%`;
      if (ratio < 1) requestAnimationFrame(updateProgress);
    }
    requestAnimationFrame(updateProgress);

    // Phase 1: 3s showing closed Gate cover
    for (let s = 3; s > 0; s--) {
      if (abort) break;
      hudStatus.textContent = config.lang === 'en'
        ? `🤖 Gate cover — opening in ${s}s...`
        : `🤖 Skrin Penutup — buka dalam ${s}s...`;
      await new Promise((r) => setTimeout(r, 1000));
    }

    if (!abort) {
      // Phase 2: Click Open Invitation & wait for door animation
      hudStatus.textContent = config.lang === 'en'
        ? '🤖 Clicking "Open Invitation"...'
        : '🤖 Mensimulasi klik "Buka Jemputan"...';
      const btn = iframeEl.contentDocument?.querySelector<HTMLElement>('.open-invitation-btn') ??
                  iframeEl.contentDocument?.querySelector<HTMLElement>('button');
      btn?.click();
      iframeEl.contentWindow?.postMessage({ type: 'OPEN_GATE' }, '*');
      await new Promise((r) => setTimeout(r, 2500));
    }

    if (!abort) {
      // Phase 3: Hero card
      const heroLabel = config.sections[1]?.label ?? 'Invitation Hero';
      hudStatus.textContent = `🤖 Viewing ${heroLabel}`;
      await new Promise((r) => setTimeout(r, config.pageDurationMs));
    }

    if (!abort) {
      // Phase 4: Scroll remaining sections
      for (let i = 2; i < totalSecs; i++) {
        if (abort) break;
        const sec = config.sections[i];
        hudStatus.textContent = `🤖 Viewing ${sec.label} (${i + 1}/${totalSecs})`;
        iframeEl.contentWindow?.postMessage({ type: 'PREVIEW_SELECT_SECTION', sectionId: sec.key }, '*');
        const secEl = iframeEl.contentDocument?.getElementById(sec.key) ??
                      iframeEl.contentDocument?.querySelector<HTMLElement>(`.${sec.key}-section`);
        secEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        await new Promise((r) => setTimeout(r, config.pageDurationMs));
      }
    }

    hudStatus.textContent = config.lang === 'en' ? '✅ Wrapping up...' : '✅ Menyiapkan fail...';
    stop();
  }

  function stop() {
    abort = true;
    if (animFrameId) cancelAnimationFrame(animFrameId);
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    } else {
      stopBtn.style.display = 'none';
      startBtn.style.display = 'inline-block';
      const previewBtn = $('rec-preview') as HTMLButtonElement | null;
      if (previewBtn) previewBtn.style.display = 'inline-block';
    }
  }

  const previewBtn = $('rec-preview') as HTMLButtonElement | null;
  const previewStopBtn = $('rec-preview-stop') as HTMLButtonElement | null;

  async function runPreview() {
    errorEl.style.display = 'none';
    downloadWrap.style.display = 'none';
    startBtn.style.display = 'none';
    if (previewBtn) previewBtn.style.display = 'none';
    if (previewStopBtn) previewStopBtn.style.display = 'inline-block';
    abort = false;

    statusEl.textContent = config.lang === 'en' ? '👁️ [PREVIEW] Loading Gate cover screen...' : '👁️ [UJIAN] Memuat semula skrin penutup...';
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

    await new Promise((r) => setTimeout(r, 600));
    if (abort) return;

    // 3-second delay on the closed Gate cover screen
    for (let s = 3; s > 0; s--) {
      if (abort) return;
      statusEl.textContent = config.lang === 'en'
        ? `👁️ [PREVIEW] Closed Gate screen (opening in ${s}s)...`
        : `👁️ [UJIAN] Skrin Penutup Jemputan (buka dalam ${s}s)...`;
      progressEl.style.width = `${Math.round(((3 - s) / 3) * 15)}%`;
      await new Promise((r) => setTimeout(r, 1000));
    }

    if (abort) return;

    // Simulate clicking "Open Invitation" button
    statusEl.textContent = config.lang === 'en'
      ? '🤖 [PREVIEW] Clicking "Open Invitation" button...'
      : '🤖 [UJIAN] Mensimulasi klik butang "Buka Jemputan"...';
    progressEl.style.width = '20%';

    if (iframeEl.contentDocument) {
      const btn = iframeEl.contentDocument.querySelector('.open-invitation-btn') || iframeEl.contentDocument.querySelector('button');
      if (btn) (btn as HTMLElement).click();
    }
    if (iframeEl.contentWindow) {
      iframeEl.contentWindow.postMessage({ type: 'OPEN_GATE' }, '*');
    }

    // Wait 2.5 seconds for door opening animation to reveal Hero card
    await new Promise((r) => setTimeout(r, 2500));
    if (abort) return;

    // Pause on Hero section for pageDurationMs
    statusEl.textContent = config.lang === 'en'
      ? `👁️ [PREVIEW] Viewing ${config.sections[1]?.label || 'Invitation Hero'}`
      : `👁️ [UJIAN] Memapar ${config.sections[1]?.label || 'Jemputan Utama'}`;
    progressEl.style.width = '35%';
    await new Promise((r) => setTimeout(r, config.pageDurationMs));
    if (abort) return;

    // Smoothly scroll section by section starting from section 2 (Parents)
    const totalSecs = config.sections.length;
    for (let i = 2; i < totalSecs; i++) {
      if (abort) break;
      const sec = config.sections[i];
      statusEl.textContent = `👁️ [PREVIEW] Scrolling & Viewing ${sec.label} (${i + 1}/${totalSecs})`;
      progressEl.style.width = `${35 + Math.round(((i - 1) / (totalSecs - 2)) * 65)}%`;

      if (iframeEl.contentWindow) {
        iframeEl.contentWindow.postMessage({ type: 'PREVIEW_SELECT_SECTION', sectionId: sec.key }, '*');
        if (iframeEl.contentDocument) {
          const secEl = iframeEl.contentDocument.getElementById(sec.key) || iframeEl.contentDocument.querySelector(`.${sec.key}-section`);
          if (secEl) secEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      await new Promise((r) => setTimeout(r, config.pageDurationMs));
    }

    previewStop();
    if (!abort) {
      statusEl.textContent = config.lang === 'en' ? '✅ Simulation preview finished! Click Start Recording.' : '✅ Ujian simulasi selesai! Klik Mula Rakam Video.';
    }
  }

  function previewStop() {
    abort = true;
    if (previewStopBtn) previewStopBtn.style.display = 'none';
    if (previewBtn) previewBtn.style.display = 'inline-block';
    startBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
  }

  if (previewBtn) previewBtn.addEventListener('click', runPreview);
  if (previewStopBtn) previewStopBtn.addEventListener('click', previewStop);

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
  autoSimulate: boolean;
  loginId: string;
  sections: { key: string; label: string }[];
}): string {
  const title = config.lang === 'en' ? 'Recording' : 'Merekod Video';
  const startLabel = config.lang === 'en' ? '▶️ Start Recording' : '▶️ Mula Rakam Video';
  const stopLabel = config.lang === 'en' ? '⏹️ Stop' : '⏹️ Hentikan';
  const previewLabel = config.lang === 'en' ? '👁️ Preview Simulation (No Record)' : '👁️ Uji Simulasi (Tanpa Rakam)';
  const previewStopLabel = config.lang === 'en' ? '⏹️ Stop Preview' : '⏹️ Hentikan Ujian';
  const downloadLabel = config.lang === 'en' ? '⬇️ Download Video' : '⬇️ Muat Turun Video';
  const hint =
    config.lang === 'en'
      ? 'Test preview or click Start Recording to generate your video.'
      : 'Uji simulasi atau klik Mula Rakam Video untuk hasilkan video.';

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
        border-radius: 0px;
        overflow: hidden;
        background: #0a0d14;
        box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        box-sizing: border-box;
        border: 1px solid rgba(255,255,255,0.1);
      }
      #rec-screen-slot {
        width: 100%;
        height: 100%;
        border-radius: 0px;
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
  #rec-preview { background: rgba(201,168,76,0.15); color: #C9A84C; border: 1px solid rgba(201,168,76,0.4); width: 100%; }
  #rec-preview:hover { background: rgba(201,168,76,0.25); }
  #rec-preview-stop { background: #dc2626; color: #fff; display: none; width: 100%; }
  #rec-stop { background: #dc2626; color: #fff; display: none; width: 100%; }
  #rec-download-wrap { display: none; width: 100%; text-align: center; }
  #rec-download { display: inline-block; width: 100%; box-sizing: border-box; padding: 12px; background: linear-gradient(135deg,#16a34a,#22c55e); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(34,197,94,0.3); }
  #rec-error { display: none; color: #f87171; font-size: 12px; background: rgba(248,113,113,0.1); padding: 8px 12px; border-radius: 8px; }
  
  /* Toggle Switch Styles for Recorder Window */
  .switch-wrap { display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.04); padding: 10px 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); }
  .switch-label { font-size: 12px; font-weight: 600; color: #C9A84C; display: flex; flex-direction: column; gap: 2px; }
  .switch-sub { font-size: 10px; color: #9ca3af; font-weight: 400; }
  .switch { position: relative; display: inline-block; width: 38px; height: 22px; flex-shrink: 0; }
  .switch input { opacity: 0; width: 0; height: 0; }
  .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #374151; transition: .3s; border-radius: 20px; }
  .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
  input:checked + .slider { background-color: #C9A84C; }
  input:checked + .slider:before { transform: translateX(16px); }

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

      <div class="switch-wrap">
        <div class="switch-label">
          <span>🤖 ${config.lang === 'en' ? 'Auto-Walkthrough Simulation' : 'Simulasi Klik & Skrol Automatik'}</span>
          <span class="switch-sub">${config.lang === 'en' ? '3s delay, auto-click & smooth scroll' : '3s penangguhan, auto-klik & skrol'}</span>
        </div>
        <label class="switch">
          <input type="checkbox" id="rec-auto-sim" ${config.autoSimulate ? 'checked' : ''} />
          <span class="slider"></span>
        </label>
      </div>

      <div id="rec-error"></div>
      <div id="rec-status"></div>
      <div id="rec-progress-track"><div id="rec-progress"></div></div>
      <button id="rec-preview">${previewLabel}</button>
      <button id="rec-preview-stop">${previewStopLabel}</button>
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
  const [autoSimulate, setAutoSimulate] = useState<boolean>(true);
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
      autoSimulate,
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
                📱 iPhone 17 Pro
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
                🤖 {lang === 'en' ? 'Auto-Human Walkthrough Simulation' : 'Simulasi Klik & Skrol Automatik'}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>
                {lang === 'en' ? '3s delay, auto-click "Open", & smooth scroll' : 'Menunggu 3s, auto-klik "Buka Kad", & skrol'}
              </span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={autoSimulate} onChange={(e) => setAutoSimulate(e.target.checked)} />
              <span className="toggle-slider" />
            </label>
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
