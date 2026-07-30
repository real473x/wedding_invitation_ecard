import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface Contact {
  name: string;
  phone: string;
}

export interface ProgrammeItem {
  time: string;
  event: string;
}

export interface Gift {
  id: string;
  item: string;
  link: string;
  claimedBy?: string;
  imageUrl?: string;
  price?: string;
}

export interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface RSVP {
  id: string;
  name: string;
  phone: string;
  attending: 'yes' | 'no';
  paxCount: number;
  wishes: string;
  createdAt: string;
}

export interface SectionVisibility {
  gate: boolean;
  invitation: boolean;
  parents: boolean;
  countdown: boolean;
  programme: boolean;
  gallery: boolean;
  message: boolean;
  closing: boolean;
}

export interface WeddingConfig {
  theme: string;
  language?: 'ms' | 'en';
  sections: SectionVisibility;
  groomName: string;
  groomFullName: string;
  brideName: string;
  brideFullName: string;
  groomFatherName: string;
  groomMotherName: string;
  brideFatherName: string;
  brideMotherName: string;
  weddingDate: string;
  weddingDay: string;
  weddingTime: string;
  receptionTime: string;
  venue: string;
  venueAddress: string;
  quote: string;
  quoteSource: string;
  coupleMessage: string;
  coupleMessageTitle: string;
  closingTitle: string;
  closingText: string;
  youtubeUrl: string;
  showMap: boolean;
  mapEmbedUrl: string;
  wazeLink: string;
  googleMapsLink: string;
  contacts: Contact[];
  bankName: string;
  bankAccountName: string;
  bankAccountNo: string;
  bankQrUrl: string;
  programme: ProgrammeItem[];
  photos: string[];
  wishes: Wish[];
  gifts: Gift[];
  rsvps: RSVP[];
  showClosingPhoto: boolean;
  closingPhotoUrl: string;
  backgrounds: {
    gate: string;
    invitation: string;
    parents: string;
    countdown: string;
    programme: string;
    gallery: string;
    message: string;
    closing: string;
  };
  useUnifiedBackground?: boolean;
  unifiedBackgroundUrl?: string;
  textOverrides?: Record<string, string>;
}

export interface Couple {
  id: string;
  loginId: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: string;
  config: WeddingConfig;
  // Expiry & subscription fields:
  packageName?: string;     // e.g. "30 Hari", "60 Hari (2 Bulan)", "Kustom"
  expiresAt?: string;       // ISO date string
  statusMode?: 'on' | 'off' | 'auto'; // 'on' = always active, 'off' = always inactive, 'auto' = active if not expired
  mustChangePassword?: boolean;
}

export interface Payment {
  id: string;
  coupleId: string;
  coupleName: string;
  packageName: string;
  amount: number;
  paymentDate: string;
  notes?: string;
}

export interface SuperAdmin {
  passwordHash: string;
}

export interface Database {
  superAdmin: SuperAdmin;
  couples: Couple[];
  payments?: Payment[]; // new field for tracking accounting/payments
  globalTextOverrides?: Record<string, string>;
}

/** Helper to check if a couple page is active based on superadmin statusMode & expiration */
export function isCoupleActive(couple: Couple): boolean {
  const mode = couple.statusMode ?? 'auto';
  if (mode === 'on') return true;
  if (mode === 'off') return false;
  if (mode === 'auto') {
    if (!couple.expiresAt) return true; // Default to true if not set
    return new Date(couple.expiresAt).getTime() > Date.now();
  }
  return couple.isActive;
}

const DEFAULT_CONFIG: WeddingConfig = {
  theme: 'malay',
  language: 'ms',
  backgrounds: {
    gate: '',
    invitation: '',
    parents: '',
    countdown: '',
    programme: '',
    gallery: '',
    message: '',
    closing: '',
  },
  useUnifiedBackground: true,
  unifiedBackgroundUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80',
  sections: {
    gate: true,
    invitation: true,
    parents: true,
    countdown: true,
    programme: true,
    gallery: true,
    message: true,
    closing: true,
  },
  groomName: 'Adam',
  groomFullName: 'Adam bin Abdullah',
  brideName: 'Hawa',
  brideFullName: 'Hawa binti Ibrahim',
  groomFatherName: 'Jackson',
  groomMotherName: 'Hazel',
  brideFatherName: 'Razif',
  brideMotherName: 'Zainab',
  weddingDate: '2027-01-10',
  weddingDay: 'Sabtu',
  weddingTime: '11:00 AM – 10:00 PM',
  receptionTime: '11:00 AM',
  venue: 'Hotel Magrett',
  venueAddress: 'Jalan Bukit Bintang, 55100 Kuala Lumpur',
  quote: '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri..."',
  quoteSource: '— Surah Ar-Rum, 30:21',
  coupleMessage: 'Dengan penuh kerendahan hati dan rasa syukur, kami mengundang anda untuk berkongsi kebahagiaan dan berkat bersama kami pada hari yang istimewa ini. Kehadiran anda bermakna segalanya buat kami.',
  coupleMessageTitle: 'Dari Kami Berdua',
  closingTitle: 'Terima Kasih',
  closingText: 'Kehadiran dan doa restu anda amat kami hargai. Semoga Allah memberkati majlis dan pertemuan kita.',
  showClosingPhoto: true,
  closingPhotoUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop&q=80',
  youtubeUrl: 'https://www.youtube.com/embed/cNGjD0VG4R8?autoplay=1&mute=0&loop=1&playlist=cNGjD0VG4R8',
  showMap: true,
  mapEmbedUrl: 'https://maps.google.com/maps?q=Kuala+Lumpur&output=embed',
  wazeLink: 'https://waze.com/ul?q=Kuala+Lumpur',
  googleMapsLink: 'https://maps.google.com/?q=Kuala+Lumpur',
  contacts: [
    { name: 'Adam (Pengantin Lelaki)', phone: '0123456789' },
    { name: 'Hawa (Pengantin Perempuan)', phone: '0198765432' },
  ],
  bankName: 'Maybank',
  bankAccountName: 'Adam bin Abdullah',
  bankAccountNo: '1234 5678 9012',
  bankQrUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/QR_Code_Example.svg/250px-QR_Code_Example.svg.png',
  programme: [
    { time: '11:00 AM', event: 'Ketibaan Tetamu' },
    { time: '12:00 PM', event: 'Majlis Akad Nikah' },
    { time: '1:00 PM', event: 'Ketibaan Pengantin Lelaki' },
    { time: '1:30 PM', event: 'Ketibaan Pengantin Perempuan' },
    { time: '2:00 PM', event: 'Jamuan Makan Tengahari' },
    { time: '10:00 PM', event: 'Majlis Bersurai' },
  ],
  photos: [
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop&q=80',
  ],
  wishes: [
    { id: '1', name: 'Siti Aminah', message: 'Tahniah! Semoga bahagia hingga ke syurga. Amin.', createdAt: new Date().toISOString() },
    { id: '2', name: 'Fariz & Nurul', message: 'Selamat pengantin baru! Moga kekal bahagia dunia akhirat.', createdAt: new Date().toISOString() },
  ],
  gifts: [
    {
      id: '1',
      item: 'Wireless Keyboard',
      link: 'https://www.allithypermarket.com.my/products/logitech-pebble-keys-2-k380s-multi-device-bluetooth-wireless-keyboard-with-customizable-shortcuts-slim-and-portable?variant=44231460421860',
      imageUrl: 'http://www.allithypermarket.com.my/cdn/shop/files/shopify_ce00833a-0bab-4cb2-b0e2-236b1a10b9a6.jpg?v=1756215715',
      claimedBy: '',
      price: 'RM 149.00'
    },
    {
      id: '2',
      item: 'Espresso Travel Mug',
      link: 'https://www.nespresso.com/my/en/order/accessories/original/touch-travel-mug',
      imageUrl: 'https://www.nespresso.com/ecom/medias/sys_master/public/9206582542366/A-3407-quickViewMediaFormat.png?',
      claimedBy: '',
      price: 'RM 109.00'
    },
    {
      id: '3',
      item: 'Set Pinggan Mangkuk Premium',
      link: '',
      imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&fit=crop',
      claimedBy: '',
      price: 'RM 250.00'
    },
    {
      id: '4',
      item: 'Air Fryer',
      link: '',
      imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&fit=crop',
      claimedBy: '',
      price: 'RM 320.00'
    }
  ],
  rsvps: [],
  textOverrides: {},
};

function ensureDbFile(): Database {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    const initial: Database = {
      superAdmin: { passwordHash: '' },
      couples: [],
      payments: [],
      globalTextOverrides: {},
    };
    // Seed default demo couple into initial database
    initial.couples.push({
      id: 'demo',
      loginId: 'demo',
      passwordHash: '', // no direct login password (managed via superadmin)
      isActive: true,
      createdAt: new Date().toISOString(),
      config: getDefaultConfig(),
      packageName: 'Demo Selamanya',
      expiresAt: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString(), // 10 years
      statusMode: 'on',
      mustChangePassword: false,
    });
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) as Database;
  let modified = false;
  if (!db.payments) {
    db.payments = [];
    modified = true;
  }
  if (!db.globalTextOverrides) {
    db.globalTextOverrides = {};
    modified = true;
  }
  // Auto-upgrade existing couples to ensure all enhanced demo features (photos, youtube, background, QR, gifts) are applied
  db.couples.forEach(c => {
    if (c.config) {
      if (!c.config.photos || c.config.photos.length === 0) {
        c.config.photos = [...DEFAULT_CONFIG.photos];
        modified = true;
      }
      if (!c.config.unifiedBackgroundUrl) {
        c.config.useUnifiedBackground = true;
        c.config.unifiedBackgroundUrl = DEFAULT_CONFIG.unifiedBackgroundUrl;
        modified = true;
      }
      if (!c.config.closingPhotoUrl) {
        c.config.closingPhotoUrl = DEFAULT_CONFIG.closingPhotoUrl;
        modified = true;
      }
      if (!c.config.youtubeUrl) {
        c.config.youtubeUrl = DEFAULT_CONFIG.youtubeUrl;
        modified = true;
      }
      if (!c.config.bankQrUrl) {
        c.config.bankQrUrl = DEFAULT_CONFIG.bankQrUrl;
        modified = true;
      }
      if (c.config.gifts) {
        c.config.gifts = c.config.gifts.map((g, idx) => {
          const defaultRef = DEFAULT_CONFIG.gifts[idx % DEFAULT_CONFIG.gifts.length];
          if (!g.price || !g.imageUrl) {
            modified = true;
          }
          return {
            ...g,
            price: g.price || defaultRef.price || 'RM 150.00',
            imageUrl: g.imageUrl || defaultRef.imageUrl || 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&fit=crop',
          };
        });
      }
    }
  });

  // If demo couple is missing from parsed db, seed it
  if (!db.couples.find(c => c.loginId === 'demo')) {
    const demoConfig = getDefaultConfig();
    demoConfig.groomName = 'Demo Groom';
    demoConfig.brideName = 'Demo Bride';
    db.couples.push({
      id: 'demo',
      loginId: 'demo',
      passwordHash: '',
      isActive: true,
      createdAt: new Date().toISOString(),
      config: demoConfig,
      packageName: 'Demo Selamanya',
      expiresAt: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString(),
      statusMode: 'on',
      mustChangePassword: false,
    });
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  }
  return db;
}

export function readDb(): Database {
  return ensureDbFile();
}

export function writeDb(db: Database): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function getDefaultConfig(): WeddingConfig {
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

export function getCoupleById(id: string): Couple | undefined {
  const db = readDb();
  return db.couples.find(c => c.id === id);
}

export function getCoupleByLoginId(loginId: string): Couple | undefined {
  const db = readDb();
  return db.couples.find(c => c.loginId === loginId);
}
