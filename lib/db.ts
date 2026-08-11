import fs from 'fs';
import path from 'path';

function getDbFilePath(): string {
  const defaultPath = path.join(process.cwd(), 'data', 'db.json');
  // On Vercel or serverless production environments, use writable /tmp/db.json
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpPath = path.join('/tmp', 'db.json');
    if (!fs.existsSync(tmpPath)) {
      try {
        const dir = path.dirname(tmpPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        if (fs.existsSync(defaultPath)) {
          fs.copyFileSync(defaultPath, tmpPath);
        }
      } catch (e) {
        console.warn('Unable to seed /tmp/db.json from defaultPath:', e);
      }
    }
    return tmpPath;
  }
  return defaultPath;
}

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
  isHidden?: boolean;
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

export interface FeatureToggles {
  // Feature Modules
  enableFloatingNav?: boolean;
  enableCalendar?: boolean;
  enableRsvp?: boolean;
  enableMoney?: boolean;
  enableGift?: boolean;
  enableGallery?: boolean;
  enableProgramme?: boolean;
  enableContact?: boolean;
  enableLocation?: boolean;
  enableDesignBuilder?: boolean;
  enableMusic?: boolean;
  enableTextOverrides?: boolean;
  // Section Displays
  enableGateSection?: boolean;
  enableHeroSection?: boolean;
  enableParentsSection?: boolean;
  enableCountdownSection?: boolean;
  enableProgrammeSection?: boolean;
  enableGallerySection?: boolean;
  enableMessageSection?: boolean;
  enableClosingSection?: boolean;
}

export interface PageElementStyle {
  fontFamily?: string;
  fontSize?: string;
  fontStyle?: 'normal' | 'italic';
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: string;
  letterSpacing?: string;
  lineHeight?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
}

export interface SectionStyle {
  overlayOpacity?: number;       // 0–100 (controls how dark/light the BG overlay is)
  overlayColor?: string;         // 'rgba(0,0,0,0.5)' or custom hex
  borderStyle?: string;          // 'none' | 'single' | 'double' | 'ornate-gold' | 'floral' | 'corner-dots' | 'art-deco' | 'mandala-corner' | 'islamic' | 'bamboo'
  borderColor?: string;
  borderWidth?: number;
  cornerDecor?: string;          // 'none' | 'floral' | 'star' | 'diamond' | 'mandala'
  dividerStyle?: string;         // 'line' | 'ornate' | 'floral' | 'wave' | 'none'
  cardBackground?: string;       // 'transparent' | 'surface' | 'frosted' | hex color
  cardOpacity?: number;          // 0-100
  transition?: string;           // transition animation key e.g. 'fade', 'slide-up'
  headingStyle?: PageElementStyle;
  bodyStyle?: PageElementStyle;
  accentStyle?: PageElementStyle;
  elements?: Record<string, PageElementStyle>;
}

export interface PageStyles {
  gate?: SectionStyle;
  invitation?: SectionStyle;
  parents?: SectionStyle;
  countdown?: SectionStyle;
  programme?: SectionStyle;
  gallery?: SectionStyle;
  message?: SectionStyle;
  closing?: SectionStyle;
}

export function getElementStyle(
  sectionStyle?: SectionStyle,
  elementKey?: string,
  categoryFallback?: 'headingStyle' | 'bodyStyle' | 'accentStyle'
): React.CSSProperties {
  if (!sectionStyle) return {};
  const elStyle = elementKey ? sectionStyle.elements?.[elementKey] : undefined;
  const categoryStyle = categoryFallback ? sectionStyle[categoryFallback] : undefined;

  const fontFamily = elStyle?.fontFamily || categoryStyle?.fontFamily;
  const color = elStyle?.color || categoryStyle?.color;
  const fontSize = elStyle?.fontSize || categoryStyle?.fontSize;

  const styleObj: React.CSSProperties = {};
  if (fontFamily) styleObj.fontFamily = `'${fontFamily}', sans-serif`;
  if (color) styleObj.color = color;
  if (fontSize) styleObj.fontSize = fontSize;

  return styleObj;
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
  pageStyles?: PageStyles;
  featureToggles?: FeatureToggles;
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
  featureToggles?: FeatureToggles;
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
  username?: string;
  passwordHash: string;
}

export interface Database {
  superAdmin: SuperAdmin;
  couples: Couple[];
  payments?: Payment[]; // new field for tracking accounting/payments
  globalTextOverrides?: Record<string, string>;
  importedJsonBase?: Record<string, string>;
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
  language: 'en',
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
  weddingDay: 'Saturday',
  weddingTime: '11:00 AM – 10:00 PM',
  receptionTime: '11:00 AM',
  venue: 'Magrett Hotel',
  venueAddress: 'Jalan Bukit Bintang, 55100 Kuala Lumpur',
  quote: '"And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them..."',
  quoteSource: '— Surah Ar-Rum, 30:21',
  coupleMessage: 'With humble hearts and profound gratitude, we invite you to share in our joy and blessings on this special day. Your presence means everything to us.',
  coupleMessageTitle: 'From Both of Us',
  closingTitle: 'Thank You',
  closingText: 'Your presence and blessings are deeply appreciated. May joy and peace be with you all.',
  showClosingPhoto: true,
  closingPhotoUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop&q=80',
  youtubeUrl: 'https://www.youtube.com/embed/cNGjD0VG4R8?autoplay=1&mute=0&loop=1&playlist=cNGjD0VG4R8',
  showMap: true,
  mapEmbedUrl: 'https://maps.google.com/maps?q=Kuala+Lumpur&output=embed',
  wazeLink: 'https://waze.com/ul?q=Kuala+Lumpur',
  googleMapsLink: 'https://maps.google.com/?q=Kuala+Lumpur',
  contacts: [
    { name: 'Adam (Groom)', phone: '0123456789' },
    { name: 'Hawa (Bride)', phone: '0198765432' },
  ],
  bankName: 'Maybank',
  bankAccountName: 'Adam bin Abdullah',
  bankAccountNo: '1234 5678 9012',
  bankQrUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/QR_Code_Example.svg/250px-QR_Code_Example.svg.png',
  programme: [
    { time: '11:00 AM', event: 'Guest Arrival' },
    { time: '12:00 PM', event: 'Solemnization Ceremony' },
    { time: '1:00 PM', event: 'Groom Arrival' },
    { time: '1:30 PM', event: 'Bride Arrival' },
    { time: '2:00 PM', event: 'Wedding Reception Lunch' },
    { time: '10:00 PM', event: 'Event Concludes' },
  ],
  photos: [
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop&q=80',
  ],
  wishes: [
    { id: '1', name: 'Sarah & Family', message: 'Congratulations! Wishing you both endless happiness and blessings always.', createdAt: new Date().toISOString() },
    { id: '2', name: 'Fariz & Nurul', message: 'Happy wedding day! May your journey together be filled with joy.', createdAt: new Date().toISOString() },
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

import { Redis } from '@upstash/redis';

export function getRedisClient(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return new Redis({ url, token });
  }
  return null;
}

const REDIS_KEY = 'ewedding:db';

function sanitizeAndUpgradeDb(db: Database, onSave?: (updated: Database) => void | Promise<void>): Database {
  let modified = false;
  if (!db.superAdmin) {
    db.superAdmin = { username: '', passwordHash: '' };
    modified = true;
  }
  if (!db.couples) {
    db.couples = [];
    modified = true;
  }
  if (!db.payments) {
    db.payments = [];
    modified = true;
  }
  if (!db.globalTextOverrides) {
    db.globalTextOverrides = {};
    modified = true;
  }

  // Auto-upgrade existing couples to ensure all enhanced demo features (photos, youtube, background, QR, gifts) are applied
  if (db.couples) {
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
  }

  if (modified && onSave) {
    try {
      onSave(db);
    } catch (_) {}
  }
  return db;
}

function ensureDbFile(): Database {
  const dbPath = getDbFilePath();
  const dir = path.dirname(dbPath);
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch (_) {}

  if (!fs.existsSync(dbPath)) {
    const initial: Database = {
      superAdmin: { username: '', passwordHash: '' },
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
    try { fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2)); } catch (_) {}
    return initial;
  }

  let db: Database;
  try {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf-8')) as Database;
  } catch (e) {
    db = {
      superAdmin: { username: '', passwordHash: '' },
      couples: [],
      payments: [],
      globalTextOverrides: {},
    };
  }

  return sanitizeAndUpgradeDb(db, (updated) => {
    try {
      fs.writeFileSync(dbPath, JSON.stringify(updated, null, 2));
    } catch (_) {}
  });
}

function createFreshDb(): Database {
  const initial: Database = {
    superAdmin: { username: '', passwordHash: '' },
    couples: [],
    payments: [],
    globalTextOverrides: {},
  };
  initial.couples.push({
    id: 'demo',
    loginId: 'demo',
    passwordHash: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    config: getDefaultConfig(),
    packageName: 'Demo Selamanya',
    expiresAt: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString(),
    statusMode: 'on',
    mustChangePassword: false,
  });
  return initial;
}

declare global {
  var _cachedDb: Database | undefined;
}

export async function readDb(): Promise<Database> {
  if (globalThis._cachedDb) {
    return sanitizeAndUpgradeDb(globalThis._cachedDb);
  }

  const redis = getRedisClient();
  if (redis) {
    try {
      let db = await redis.get<Database>(REDIS_KEY);
      if (db && typeof db === 'object') {
        const sanitized = sanitizeAndUpgradeDb(db, async (updatedDb) => {
          await redis.set(REDIS_KEY, updatedDb);
        });
        globalThis._cachedDb = sanitized;
        return sanitized;
      }
    } catch (err) {
      console.error('Redis read error, falling back to local file:', err);
    }
  }
  const dbFromFile = ensureDbFile();
  globalThis._cachedDb = dbFromFile;
  return dbFromFile;
}

export async function writeDb(db: Database): Promise<void> {
  globalThis._cachedDb = db;

  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set(REDIS_KEY, db);
    } catch (err) {
      console.error('Redis write error:', err);
    }
  }

  const defaultPath = path.join(process.cwd(), 'data', 'db.json');
  const targetPath = getDbFilePath();
  const dataStr = JSON.stringify(db, null, 2);

  try {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(targetPath, dataStr);
  } catch (err: unknown) {
    console.error('Failed to write DB to target path:', err);
  }

  // Sync to defaultPath if different and writable
  if (targetPath !== defaultPath) {
    try {
      const dir = path.dirname(defaultPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(defaultPath, dataStr);
    } catch (_) {}
  }
}

export function getDefaultConfig(): WeddingConfig {
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

export async function getCoupleById(id: string): Promise<Couple | undefined> {
  const db = await readDb();
  return db.couples.find(c => c.id === id);
}

export async function getCoupleByLoginId(loginId: string): Promise<Couple | undefined> {
  const db = await readDb();
  return db.couples.find(c => c.loginId === loginId);
}

export async function getStorageInfo() {
  const redis = getRedisClient();
  let isRedisConnected = false;
  if (redis) {
    try {
      await redis.ping();
      isRedisConnected = true;
    } catch (_) {
      isRedisConnected = false;
    }
  }

  const defaultPath = path.join(process.cwd(), 'data', 'db.json');
  const tmpPath = path.join('/tmp', 'db.json');
  const defaultExists = fs.existsSync(defaultPath);
  const tmpExists = fs.existsSync(tmpPath);
  const dbJsonExists = defaultExists || tmpExists;

  const db = await readDb();

  const isVercel = !!(process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV);
  const environment = isVercel
    ? `Vercel Serverless (${process.env.VERCEL_ENV || process.env.NODE_ENV || 'Production'})`
    : `Local Node.js (${process.env.NODE_ENV || 'development'})`;

  const superAdminConfigured = !!(db.superAdmin?.username && db.superAdmin?.passwordHash);
  const superAdminUsername = db.superAdmin?.username || '';

  return {
    isVercel,
    environment,
    isRedisConnected,
    redisStatus: isRedisConnected ? '🟢 Connected (Upstash Redis)' : '🟡 Not Connected (File Fallback)',
    dbJsonExists,
    dbJsonPath: defaultExists ? defaultPath : (tmpExists ? tmpPath : 'None'),
    activeDbSource: isRedisConnected ? 'Upstash Redis (ewedding:db)' : (defaultExists ? defaultPath : (tmpExists ? tmpPath : 'In-Memory Singleton')),
    couplesCount: db.couples?.length || 0,
    superAdminConfigured,
    superAdminUsername,
    superAdminStatus: superAdminConfigured ? `🟢 Active (${superAdminUsername})` : '🔴 Uninitialized (Requires Setup)',
  };
}

export function deleteLocalDbFile(): boolean {
  let deletedAny = false;
  const defaultPath = path.join(process.cwd(), 'data', 'db.json');
  const tmpPath = path.join('/tmp', 'db.json');

  try {
    if (fs.existsSync(defaultPath)) {
      fs.unlinkSync(defaultPath);
      deletedAny = true;
    }
  } catch (e) {
    console.warn('Unable to delete data/db.json:', e);
  }

  try {
    if (fs.existsSync(tmpPath)) {
      fs.unlinkSync(tmpPath);
      deletedAny = true;
    }
  } catch (e) {
    console.warn('Unable to delete /tmp/db.json:', e);
  }

  return deletedAny;
}

export async function dropAllData(): Promise<void> {
  const resetDb: Database = {
    superAdmin: { username: '', passwordHash: '' },
    couples: [],
    payments: [],
    globalTextOverrides: {},
  };

  globalThis._cachedDb = resetDb;

  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set(REDIS_KEY, resetDb);
    } catch (e) {
      console.error('Failed to delete Redis key ewedding:db:', e);
    }
  }

  const defaultPath = path.join(process.cwd(), 'data', 'db.json');
  const tmpPath = path.join('/tmp', 'db.json');
  const dataStr = JSON.stringify(resetDb, null, 2);

  try {
    const dir = path.dirname(defaultPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(defaultPath, dataStr);
  } catch (e) {}

  try {
    const dir = path.dirname(tmpPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(tmpPath, dataStr);
  } catch (e) {}
}

