import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, getDefaultConfig } from '@/lib/db';
import { getSuperAdminSession, hashPassword, generateCoupleId, generatePassword } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

async function requireSuperAdmin() {
  const session = await getSuperAdminSession();
  if (!session.isLoggedIn || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// GET /api/super-admin/users — Get all registered users (superadmin + couples)
export async function GET() {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  const db = await readDb();
  const users = [];

  // Superadmin User
  if (db.superAdmin?.username) {
    users.push({
      id: 'superadmin',
      role: 'superadmin',
      username: db.superAdmin.username,
      displayName: 'Super Admin',
      isActive: true,
      createdAt: null,
      packageName: 'System Admin',
      expiresAt: null,
      statusMode: 'on',
    });
  }

  // Couple Users
  (db.couples || []).forEach(c => {
    const expiresAt = c.expiresAt ?? new Date(new Date(c.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    users.push({
      id: c.id,
      role: 'couple',
      username: c.loginId,
      displayName: `${c.config?.groomName || 'Pengantin'} & ${c.config?.brideName || 'Pengantin'}`,
      isActive: c.isActive,
      createdAt: c.createdAt,
      packageName: c.packageName || '30 Hari',
      expiresAt,
      statusMode: c.statusMode || 'auto',
      mustChangePassword: c.mustChangePassword || false,
    });
  });

  return NextResponse.json({ users });
}

// POST /api/super-admin/users — Create a new user (superadmin or couple)
export async function POST(req: NextRequest) {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { role, username, password, groomName, brideName, weddingDate, packageName } = body;

    const db = await readDb();

    if (role === 'superadmin') {
      if (db.superAdmin?.username && db.superAdmin?.passwordHash) {
        return NextResponse.json(
          { error: 'Only 1 Super Admin account is allowed in the system. Creating additional Super Admin accounts is strictly forbidden.' },
          { status: 400 }
        );
      }

      if (!username || username.trim().length < 3) {
        return NextResponse.json({ error: 'Username must be at least 3 characters long.' }, { status: 400 });
      }
      if (!password || password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
      }

      db.superAdmin = {
        username: username.trim(),
        passwordHash: await hashPassword(password),
      };
      await writeDb(db);
      return NextResponse.json({ ok: true, role: 'superadmin', username: db.superAdmin.username });
    }

    // Role === 'couple'
    if (!groomName || !brideName) {
      return NextResponse.json({ error: 'Groom and bride names are required' }, { status: 400 });
    }

    const year = weddingDate ? new Date(weddingDate).getFullYear().toString() : new Date().getFullYear().toString();
    let loginId = username ? username.trim() : generateCoupleId(groomName, brideName, year);

    let suffix = 0;
    while (db.couples.find(c => c.loginId === loginId)) {
      suffix++;
      loginId = `${generateCoupleId(groomName, brideName, year)}-${suffix}`;
    }

    const plainPassword = password || generatePassword();
    const passwordHash = await hashPassword(plainPassword);
    const id = uuidv4();

    const defaultConfig = getDefaultConfig();
    defaultConfig.groomName = groomName;
    defaultConfig.brideName = brideName;
    if (weddingDate) defaultConfig.weddingDate = weddingDate;

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const newCouple = {
      id,
      loginId,
      passwordHash,
      isActive: true,
      createdAt: new Date().toISOString(),
      config: defaultConfig,
      packageName: packageName || '30 Hari',
      expiresAt,
      statusMode: 'auto' as const,
      mustChangePassword: true,
    };

    db.couples.push(newCouple);
    await writeDb(db);

    return NextResponse.json({ ok: true, role: 'couple', user: { id, loginId, plainPassword } });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
