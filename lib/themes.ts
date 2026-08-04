export interface Theme {
  key: string;
  label: string;
  emoji: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  fonts: {
    heading: string;
    body: string;
    script: string;
  };
  googleFonts: string;
  defaultBg: string;
}

export const THEMES: Theme[] = [
  {
    key: 'malay',
    label: 'Melayu',
    emoji: '🌙',
    description: 'Emas & hijau tua, corak batik tradisional',
    primaryColor: '#8B6914',
    accentColor: '#1B4332',
    bgColor: '#FDFAF3',
    fonts: { heading: 'Playfair Display', body: 'Lato', script: 'Dancing Script' },
    googleFonts: 'Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&family=Dancing+Script:wght@600',
    defaultBg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  },
  {
    key: 'chinese',
    label: 'Cina',
    emoji: '🏮',
    description: 'Merah & emas, motif perayaan',
    primaryColor: '#C0392B',
    accentColor: '#D4AF37',
    bgColor: '#FFF9F9',
    fonts: { heading: 'Noto Serif', body: 'Noto Sans', script: 'Ma Shan Zheng' },
    googleFonts: 'Noto+Serif:ital,wght@0,400;0,700;1,400&family=Noto+Sans:wght@300;400;700&family=Ma+Shan+Zheng',
    defaultBg: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=1200&auto=format&fit=crop&q=80',
  },
  {
    key: 'indian',
    label: 'India',
    emoji: '🪷',
    description: 'Saffron, magenta & teal, motif mandala',
    primaryColor: '#E07B00',
    accentColor: '#9B1B6E',
    bgColor: '#FFFBF5',
    fonts: { heading: 'Rozha One', body: 'Poppins', script: 'Dancing Script' },
    googleFonts: 'Rozha+One&family=Poppins:wght@300;400;600&family=Dancing+Script:wght@600',
    defaultBg: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
  },
  {
    key: 'iban',
    label: 'Iban',
    emoji: '🦅',
    description: 'Karat tanah & hitam, corak pua kumbu',
    primaryColor: '#A0320A',
    accentColor: '#1A1A1A',
    bgColor: '#FDF8F2',
    fonts: { heading: 'Cinzel', body: 'Lato', script: 'Cinzel Decorative' },
    googleFonts: 'Cinzel:wght@400;700&family=Lato:wght@300;400;700&family=Cinzel+Decorative:wght@400;700',
    defaultBg: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=1200&auto=format&fit=crop&q=80',
  },
  {
    key: 'kadazan',
    label: 'Kadazan Dusun',
    emoji: '🌿',
    description: 'Hijau hutan & gangsa, motif suku kaum',
    primaryColor: '#2E6B3E',
    accentColor: '#8B6914',
    bgColor: '#F5FBF6',
    fonts: { heading: 'Cinzel', body: 'Open Sans', script: 'Cinzel Decorative' },
    googleFonts: 'Cinzel:wght@400;700&family=Open+Sans:wght@300;400;600&family=Cinzel+Decorative:wght@400',
    defaultBg: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1200&auto=format&fit=crop&q=80',
  },
  {
    key: 'kayan',
    label: 'Kayan',
    emoji: '🔴',
    description: 'Merah & hitam, corak geometri suku kaum',
    primaryColor: '#B01020',
    accentColor: '#0A0A0A',
    bgColor: '#FFF8F8',
    fonts: { heading: 'Cinzel', body: 'Raleway', script: 'Cinzel Decorative' },
    googleFonts: 'Cinzel:wght@400;700&family=Raleway:wght@300;400;600&family=Cinzel+Decorative:wght@400',
    defaultBg: 'https://images.unsplash.com/photo-1502691876148-a8997c43cd86?w=1200&auto=format&fit=crop&q=80',
  },
  {
    key: 'bidayuh',
    label: 'Bidayuh',
    emoji: '🏺',
    description: 'Tanah merah & beige, corak anyaman',
    primaryColor: '#B5541A',
    accentColor: '#8B7355',
    bgColor: '#FDF7EF',
    fonts: { heading: 'Playfair Display', body: 'Nunito', script: 'Dancing Script' },
    googleFonts: 'Playfair+Display:wght@400;700&family=Nunito:wght@300;400;600&family=Dancing+Script:wght@600',
    defaultBg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80',
  },
  {
    key: 'moden',
    label: 'Moden',
    emoji: '🖤',
    description: 'Minimalis hitam, putih & mawar',
    primaryColor: '#1A1A1A',
    accentColor: '#D4A0B0',
    bgColor: '#FFFFFF',
    fonts: { heading: 'Cormorant Garamond', body: 'Inter', script: 'Pinyon Script' },
    googleFonts: 'Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;600&family=Pinyon+Script',
    defaultBg: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&auto=format&fit=crop&q=80',
  },
  {
    key: 'british',
    label: 'British / American',
    emoji: '🌹',
    description: 'Navy & mawar merah jambu, klasik',
    primaryColor: '#1B3A6B',
    accentColor: '#C08080',
    bgColor: '#FAFBFF',
    fonts: { heading: 'EB Garamond', body: 'Libre Baskerville', script: 'Great Vibes' },
    googleFonts: 'EB+Garamond:ital,wght@0,400;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Great+Vibes',
    defaultBg: 'https://images.unsplash.com/photo-1556997685-309989c1aa82?w=1200&auto=format&fit=crop&q=80',
  },
  {
    key: 'orangasli',
    label: 'Orang Asli',
    emoji: '🌳',
    description: 'Okra & perang tua, motif alam semula jadi',
    primaryColor: '#A07020',
    accentColor: '#3D2B1F',
    bgColor: '#FDF8F0',
    fonts: { heading: 'Philosopher', body: 'Josefin Sans', script: 'Pacifico' },
    googleFonts: 'Philosopher:ital,wght@0,400;0,700;1,400&family=Josefin+Sans:wght@300;400;600&family=Pacifico',
    defaultBg: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=1200&auto=format&fit=crop&q=80',
  },
];

export function getTheme(key: string): Theme {
  return THEMES.find(t => t.key === key) || THEMES[0];
}
