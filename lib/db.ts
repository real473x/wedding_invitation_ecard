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
  useUnifiedBackground: false,
  unifiedBackgroundUrl: '',
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
  closingPhotoUrl: '',
  youtubeUrl: '',
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
  bankQrUrl: '',
  programme: [
    { time: '11:00 AM', event: 'Ketibaan Tetamu' },
    { time: '12:00 PM', event: 'Majlis Akad Nikah' },
    { time: '1:00 PM', event: 'Ketibaan Pengantin Lelaki' },
    { time: '1:30 PM', event: 'Ketibaan Pengantin Perempuan' },
    { time: '2:00 PM', event: 'Jamuan Makan Tengahari' },
    { time: '10:00 PM', event: 'Majlis Bersurai' },
  ],
  photos: [],
  wishes: [
    { id: '1', name: 'Siti Aminah', message: 'Tahniah Adam & Hawa! Semoga bahagia hingga ke syurga. Amin.', createdAt: new Date().toISOString() },
    { id: '2', name: 'Fariz & Nurul', message: 'Selamat pengantin baru! Moga kekal bahagia dunia akhirat.', createdAt: new Date().toISOString() },
  ],
  gifts: [
    { id: '1', item: 'Air Fryer', link: '' },
    { id: '2', item: 'Set Pinggan Mangkuk Premium', link: '' },
    { id: '3', item: 'Tilam King Size', link: '' },
  ],
  rsvps: [],
};

function ensureDbFile(): Database {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    const initial: Database = {
      superAdmin: { passwordHash: '' },
      couples: [],
      payments: [],
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
  if (!db.payments) {
    db.payments = [];
  }
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
