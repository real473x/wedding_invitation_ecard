import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSuperAdminSession, getCoupleSession, hashPassword, verifyPassword } from '@/lib/auth';

// GET /api/super-admin/login — Check setup status
export async function GET() {
  try {
    // Check if credentials exist in environment variables (Vercel deployment)
    const envUsername = process.env.SUPERADMIN_USERNAME;
    const envPassword = process.env.SUPERADMIN_PASSWORD;
    if (envUsername && envPassword) {
      return NextResponse.json({
        setupRequired: false,
        username: envUsername,
      });
    }

    const db = await readDb();
    // Setup is required ONLY if either username or passwordHash is completely missing/empty
    const setupRequired = !db.superAdmin?.passwordHash || !db.superAdmin?.username;
    return NextResponse.json({
      setupRequired,
      username: db.superAdmin?.username || '',
    });
  } catch (err: any) {
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
      return NextResponse.json({ error: 'Please enter password.' }, { status: 400 });
    }

    if (!username || username.trim().length === 0) {
      return NextResponse.json({ error: 'Please enter username.' }, { status: 400 });
    }

    const db = await readDb();
    const envUsername = process.env.SUPERADMIN_USERNAME;
    const envPassword = process.env.SUPERADMIN_PASSWORD;

    // Check if system is uninitialized (first-time setup)
    const isUninitialized = (!db.superAdmin?.passwordHash || !db.superAdmin?.username) && (!envUsername || !envPassword);

    // First-time setup: ONLY allowed if NO superadmin account exists in DB or ENV
    if (isUninitialized) {
      if (username.trim().length < 3) {
        return NextResponse.json({ error: 'Username must be at least 3 characters long.' }, { status: 400 });
      }
      if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
      }

      const cleanUsername = username.trim();
      db.superAdmin = {
        username: cleanUsername,
        passwordHash: await hashPassword(password),
      };
      await writeDb(db);

      try {
        const session = await getSuperAdminSession();
        session.role = 'superadmin';
        session.isLoggedIn = true;
        await session.save();
      } catch (e) {
        console.warn('Session save failed during setup:', e);
      }

      return NextResponse.json({ ok: true, firstTime: true, username: cleanUsername });
    }

    // Normal Login Mode — Verify credentials strictly (NO registration bypass allowed)
    const inputUsername = username.trim().toLowerCase();
    const storedUsername = (db.superAdmin?.username || '').toLowerCase();

    let isDbValid = false;
    if (db.superAdmin?.passwordHash && inputUsername === storedUsername) {
      isDbValid = await verifyPassword(password, db.superAdmin.passwordHash);
    }

    let isEnvValid = false;
    if (envUsername && envPassword) {
      if (inputUsername === envUsername.trim().toLowerCase() && password === envPassword) {
        isEnvValid = true;
      }
    }

    if (!isDbValid && !isEnvValid) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    try {
      const session = await getSuperAdminSession();
      session.role = 'superadmin';
      session.isLoggedIn = true;
      await session.save();
    } catch (e) {
      console.warn('Session save failed during login:', e);
    }

    return NextResponse.json({ ok: true, username: isEnvValid ? envUsername : db.superAdmin.username });
  } catch (err: any) {
    console.error('POST /api/super-admin/login error:', err);
    return NextResponse.json(
      { error: err?.message ? `Server error: ${err.message}` : 'Server error. Please try again.' },
      { status: 500 }
    );
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
