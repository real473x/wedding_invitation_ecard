import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, getDefaultConfig, Payment } from '@/lib/db';
import { getSuperAdminSession, hashPassword, generateCoupleId, generatePassword } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

async function requireSuperAdmin() {
  const session = await getSuperAdminSession();
  if (!session.isLoggedIn || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// GET /api/super-admin/couples — list all couples
export async function GET() {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  const db = readDb();
  const couples = db.couples.map(c => {
    // Expiration details
    const expiresAt = c.expiresAt ?? new Date(new Date(c.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const daysRemaining = Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

    return {
      id: c.id,
      loginId: c.loginId,
      isActive: c.isActive,
      createdAt: c.createdAt,
      groomName: c.config.groomName,
      brideName: c.config.brideName,
      weddingDate: c.config.weddingDate,
      venue: c.config.venue,
      theme: c.config.theme,
      rsvpCount: c.config.rsvps?.length ?? 0,
      // Expiry & subscription fields
      packageName: c.packageName ?? '30 Hari',
      expiresAt,
      daysRemaining,
      statusMode: c.statusMode ?? 'auto',
      mustChangePassword: c.mustChangePassword ?? false,
      featureToggles: c.featureToggles || c.config.featureToggles || {},
    };
  });
  return NextResponse.json({ couples });
}

// POST /api/super-admin/couples — create a new couple
export async function POST(req: NextRequest) {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  const body = await req.json();
  const { groomName, brideName, weddingDate, theme, customLoginId, customPassword, packageKey, customDays, amountPaid } = body;

  if (!groomName || !brideName) {
    return NextResponse.json({ error: 'Groom and bride names are required' }, { status: 400 });
  }

  const db = readDb();
  const dateObj = weddingDate ? new Date(weddingDate) : new Date();
  const year = dateObj.getFullYear().toString();
  let loginId = customLoginId || generateCoupleId(groomName, brideName, year);

  // Ensure unique login ID
  let suffix = 0;
  while (db.couples.find(c => c.loginId === loginId)) {
    suffix++;
    loginId = `${generateCoupleId(groomName, brideName, year)}-${suffix}`;
  }

  const plainPassword = customPassword || generatePassword();
  const passwordHash = await hashPassword(plainPassword);
  const id = uuidv4();

  const defaultConfig = getDefaultConfig();
  defaultConfig.groomName = groomName;
  defaultConfig.brideName = brideName;
  defaultConfig.groomFullName = groomName;
  defaultConfig.brideFullName = brideName;
  defaultConfig.theme = theme || 'malay';
  defaultConfig.bankAccountName = `${groomName} / ${brideName}`;
  defaultConfig.contacts = [
    { name: `${groomName} (Pengantin Lelaki)`, phone: '0123456789' },
    { name: `${brideName} (Pengantin Perempuan)`, phone: '0198765432' },
  ];

  if (weddingDate) {
    defaultConfig.weddingDate = weddingDate;
    const dayNames = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
    const computedDay = dayNames[new Date(weddingDate).getDay()];
    defaultConfig.weddingDay = computedDay || 'Sabtu';
  }

  // Calculate subscription & expiration
  let days = 30;
  let pName = '1 Bulan';
  let sMode: 'on' | 'off' | 'auto' = 'auto';

  if (packageKey === '3month') {
    days = 90;
    pName = '3 Bulan';
  } else if (packageKey === '6month') {
    days = 180;
    pName = '6 Bulan';
  } else if (packageKey === '1year') {
    days = 365;
    pName = '1 Tahun';
  } else if (packageKey === 'unlimited') {
    days = 36500; // 100 years
    pName = 'Unlimited';
    sMode = 'on';
  } else if (packageKey === 'custom') {
    days = Number(customDays) || 30;
    pName = `Kustom (${days} Hari)`;
  }
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  const newCouple = {
    id,
    loginId,
    passwordHash,
    isActive: true,
    createdAt: new Date().toISOString(),
    config: defaultConfig,
    packageName: pName,
    expiresAt,
    statusMode: sMode,
    mustChangePassword: true,
  };

  db.couples.push(newCouple);

  // Record initial payment if amountPaid > 0
  const amt = Number(amountPaid);
  if (amt && amt > 0) {
    const payment: Payment = {
      id: uuidv4(),
      coupleId: id,
      coupleName: `${groomName} & ${brideName}`,
      packageName: pName,
      amount: amt,
      paymentDate: new Date().toISOString(),
      notes: 'Bayaran pendaftaran akaun baru.',
    };
    if (!db.payments) db.payments = [];
    db.payments.push(payment);
  }

  writeDb(db);

  return NextResponse.json({
    ok: true,
    couple: {
      id,
      loginId,
      plainPassword,
      isActive: true,
    },
  });
}
