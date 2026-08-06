import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSuperAdminSession, getCoupleSession, hashPassword, verifyPassword } from '@/lib/auth';

// GET /api/super-admin/login — Check setup status
export async function GET() {
  const db = readDb();
  const setupRequired = !db.superAdmin.passwordHash;
  return NextResponse.json({
    setupRequired,
    username: db.superAdmin.username || '',
  });
}

// POST /api/super-admin/login — Login or Setup Super Admin account
export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!password) {
    return NextResponse.json({ error: 'Sila isi kata laluan.' }, { status: 400 });
  }

  const db = readDb();

  // First-time setup: if no password hash exists, register username and password
  if (!db.superAdmin.passwordHash) {
    if (!username || username.trim().length < 3) {
      return NextResponse.json({ error: 'Nama pengguna mestilah sekurang-kurangnya 3 aksara.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Kata laluan mestilah sekurang-kurangnya 6 aksara.' }, { status: 400 });
    }

    const cleanUsername = username.trim();
    db.superAdmin.username = cleanUsername;
    db.superAdmin.passwordHash = await hashPassword(password);
    writeDb(db);

    const session = await getSuperAdminSession();
    session.role = 'superadmin';
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ ok: true, firstTime: true, username: cleanUsername });
  }

  // Normal login: verify username if superadmin username is set
  if (db.superAdmin.username && username) {
    const inputUsername = username.trim().toLowerCase();
    if (inputUsername !== db.superAdmin.username.toLowerCase()) {
      return NextResponse.json({ error: 'Nama pengguna atau kata laluan tidak sah.' }, { status: 401 });
    }
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
}

export async function DELETE() {
  const session = await getSuperAdminSession();
  session.destroy();
  const coupleSession = await getCoupleSession();
  coupleSession.destroy();
  return NextResponse.json({ ok: true });
}
