export interface FontOption {
  name: string;
  category: 'heading' | 'script' | 'body';
  sampleText?: string;
}

export interface FontPairing {
  key: string;
  label: string;
  heading: string;
  script: string;
  body: string;
  googleFonts: string; // URL param for Google fonts API
}

export const HEADING_FONTS: FontOption[] = [
  { name: 'Playfair Display', category: 'heading' },
  { name: 'Cormorant Garamond', category: 'heading' },
  { name: 'EB Garamond', category: 'heading' },
  { name: 'Noto Serif', category: 'heading' },
  { name: 'Cinzel', category: 'heading' },
  { name: 'Rozha One', category: 'heading' },
  { name: 'Philosopher', category: 'heading' },
  { name: 'Montserrat', category: 'heading' },
  { name: 'Josefin Sans', category: 'heading' },
  { name: 'Work Sans', category: 'heading' },
  { name: 'Prata', category: 'heading' },
];

export const SCRIPT_FONTS: FontOption[] = [
  { name: 'Dancing Script', category: 'script' },
  { name: 'Great Vibes', category: 'script' },
  { name: 'Pinyon Script', category: 'script' },
  { name: 'Allura', category: 'script' },
  { name: 'Satisfy', category: 'script' },
  { name: 'Sacramento', category: 'script' },
  { name: 'Cinzel Decorative', category: 'script' },
  { name: 'Ma Shan Zheng', category: 'script' },
  { name: 'Pacifico', category: 'script' },
];

export const BODY_FONTS: FontOption[] = [
  { name: 'Lato', category: 'body' },
  { name: 'Inter', category: 'body' },
  { name: 'Poppins', category: 'body' },
  { name: 'Open Sans', category: 'body' },
  { name: 'Libre Baskerville', category: 'body' },
  { name: 'Raleway', category: 'body' },
  { name: 'Nunito', category: 'body' },
  { name: 'Josefin Slab', category: 'body' },
  { name: 'Noto Sans', category: 'body' },
];

export const FONT_PAIRINGS: FontPairing[] = [
  {
    key: 'classic',
    label: 'Klasik Anggun',
    heading: 'Playfair Display',
    script: 'Dancing Script',
    body: 'Lato',
    googleFonts: 'Playfair+Display:ital,wght@0,400..700;1,400..700&family=Dancing+Script:wght@400..700&family=Lato:ital,wght@0,400;0,700;1,400',
  },
  {
    key: 'modern',
    label: 'Moden Mewah',
    heading: 'Cormorant Garamond',
    script: 'Pinyon Script',
    body: 'Inter',
    googleFonts: 'Cormorant+Garamond:ital,wght@0,400..700;1,400..700&family=Pinyon+Script&family=Inter:wght@300;400;500;600;700',
  },
  {
    key: 'romantic',
    label: 'Romantik Puitis',
    heading: 'EB Garamond',
    script: 'Great Vibes',
    body: 'Libre Baskerville',
    googleFonts: 'EB+Garamond:ital,wght@0,400..700;1,400..700&family=Great+Vibes&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400',
  },
  {
    key: 'bold',
    label: 'Teguh & Kontemporari',
    heading: 'Montserrat',
    script: 'Pacifico',
    body: 'Open Sans',
    googleFonts: 'Montserrat:wght@400;600;700;800&family=Pacifico&family=Open+Sans:wght@400;600',
  },
  {
    key: 'elegant',
    label: 'Minimalist Diraja',
    heading: 'Prata',
    script: 'Allura',
    body: 'Poppins',
    googleFonts: 'Prata&family=Allura&family=Poppins:wght@300;400;500;600',
  },
  {
    key: 'traditional',
    label: 'Tradisi Etnik',
    heading: 'Noto Serif',
    script: 'Ma Shan Zheng',
    body: 'Noto Sans',
    googleFonts: 'Noto+Serif:wght@400;700&family=Ma+Shan+Zheng&family=Noto+Sans:wght@400;600',
  },
];

export function buildGoogleFontsUrl(fonts: string[]): string {
  const uniqueFonts = Array.from(new Set(fonts.filter(Boolean)));
  if (uniqueFonts.length === 0) return '';
  const formatted = uniqueFonts.map(f => f.replace(/\s+/g, '+')).join('&family=');
  return `https://fonts.googleapis.com/css2?family=${formatted}&display=swap`;
}
