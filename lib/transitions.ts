export interface TransitionPreset {
  key: string;
  label: string;
  labelEn: string;
  description: string;
  icon: string;
}

export const TRANSITION_PRESETS: TransitionPreset[] = [
  { key: 'none', label: 'Tiada (Pantas)', labelEn: 'None (Instant)', description: 'Tukar skrin secara biasa tanpa animasi', icon: '⚡' },
  { key: 'fade', label: 'Pudar Perlahan', labelEn: 'Soft Fade', description: 'Kesan pudar masuk dan keluar yang lembut', icon: '✨' },
  { key: 'slide-up', label: 'Slaid Naik', labelEn: 'Slide Up', description: 'Skrin meluncur naik dari bawah', icon: '⬆️' },
  { key: 'slide-left', label: 'Slaid Kiri', labelEn: 'Slide Left', description: 'Skrin meluncur masuk dari kanan', icon: '⬅️' },
  { key: 'zoom-in', label: 'Zum Masuk', labelEn: 'Zoom In', description: 'Skrin membesar masuk secara perlahan', icon: '🔍' },
  { key: 'flip-y', label: 'Selak Halaman 3D', labelEn: 'Page Turn 3D', description: 'Kesan selakan helaian buku secara 3D', icon: '📖' },
  { key: 'curtain', label: 'Buka Tirai', labelEn: 'Curtain Reveal', description: 'Skrin terbuka seperti tirai persembahan', icon: '🎭' },
  { key: 'blur-in', label: 'Fokus Kabur', labelEn: 'Blur Reveal', description: 'Skrin bertukar dari kabur kepada tajam', icon: '💧' },
  { key: 'float-up', label: 'Terapung Naik', labelEn: 'Float Up', description: 'Elemen terapung naik dengan kesan kenyal', icon: '🎈' },
  { key: 'split-in', label: 'Belah Dua', labelEn: 'Split Reveal', description: 'Skrin bercantum dari atas dan bawah', icon: '✂️' },
  { key: 'glow', label: 'Nyalau Cahaya', labelEn: 'Glow Pulse', description: 'Pancaran cahaya lembut semasa skrin muncul', icon: '🌟' },
  { key: 'bounce-in', label: 'Lantulan Manja', labelEn: 'Bounce In', description: 'Animasi melantul mesra semasa memasuki skrin', icon: '🎾' },
];

export function getTransitionCssClass(transitionKey?: string): string {
  if (!transitionKey || transitionKey === 'none') return '';
  return `transition-${transitionKey}`;
}
