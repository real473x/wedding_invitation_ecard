import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSuperAdminSession, getCoupleSession, hashPassword, verifyPassword } from '@/lib/auth';

// GET /api/super-admin/login — Check setup status
export async function GET() {
  try {
    const db = readDb();
    // Setup is required if either passwordHash or username is missing
    const setupRequired = !db.superAdmin?.passwordHash || !db.superAdmin?.username;
    return NextResponse.json({
      setupRequired,
      username: db.superAdmin?.username || '',
    });
  } catch (err) {
    console.error('GET /api/super-admin/login error:', err);
    return NextResponse.json({ setupRequired: true, username: '' });
  }
}

// POST /api/super-admin/login — Login or Setup Super Admin account
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { username, password } = body;

    if (!password) {
      return NextResponse.json({ error: 'Sila masukkan kata laluan.' }, { status: 400 });
    }

    const db = readDb();
    const isFirstTime = !db.superAdmin?.passwordHash || !db.superAdmin?.username;

    // First-time setup: if passwordHash or username is missing, register username and password
    if (isFirstTime) {
      if (!username || username.trim().length < 3) {
        return NextResponse.json({ error: 'Nama pengguna mestilah sekurang-kurangnya 3 aksara.' }, { status: 400 });
      }
      if (password.length < 6) {
        return NextResponse.json({ error: 'Kata laluan mestilah sekurang-kurangnya 6 aksara.' }, { status: 400 });
      }

      const cleanUsername = username.trim();
      db.superAdmin = {
        username: cleanUsername,
        passwordHash: await hashPassword(password),
      };
      writeDb(db);

      const session = await getSuperAdminSession();
      session.role = 'superadmin';
      session.isLoggedIn = true;
      await session.save();

      return NextResponse.json({ ok: true, firstTime: true, username: cleanUsername });
    }

    // Normal login: verify username
    if (!username || username.trim().length === 0) {
      return NextResponse.json({ error: 'Sila masukkan nama pengguna.' }, { status: 400 });
    }

    const inputUsername = username.trim().toLowerCase();
    const storedUsername = (db.superAdmin.username || '').toLowerCase();

    if (inputUsername !== storedUsername) {
      return NextResponse.json({ error: 'Nama pengguna atau kata laluan tidak sah.' }, { status: 401 });
    }

    const valid = await verifyPassword(password, db.superAdmin.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Nama pengguna atau kata laluan tidak sah.' }, { status: 401 });
    }

    const session = await getSuperAdminSession();
    session.role = 'superadmin';
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ ok: true, username: db.superAdmin.username });
  } catch (err) {
    console.error('POST /api/super-admin/login error:', err);
    return NextResponse.json({ error: 'Ralat pelayan. Sila cuba semula.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getSuperAdminSession();
    session.destroy();
    const coupleSession = await getCoupleSession();
    coupleSession.destroy();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: true });
  }
}
