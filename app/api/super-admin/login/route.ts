import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSuperAdminSession, getCoupleSession, hashPassword, verifyPassword } from '@/lib/auth';

// GET /api/super-admin/login — Check setup status
export async function GET() {
  const db = readDb();
  const setupRequired = !db.superAdmin.passwordHash;
  return NextResponse.json({
    setupRequired,
    email: db.superAdmin.email || '',
  });
}

// POST /api/super-admin/login — Login or Setup Super Admin account
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!password) {
    return NextResponse.json({ error: 'Sila isi kata laluan.' }, { status: 400 });
  }

  const db = readDb();

  // First-time setup: if no password hash exists, register email and password
  if (!db.superAdmin.passwordHash) {
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Sila masukkan e-mel yang sah.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Kata laluan mestilah sekurang-kurangnya 6 aksara.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    db.superAdmin.email = cleanEmail;
    db.superAdmin.passwordHash = await hashPassword(password);
    writeDb(db);

    const session = await getSuperAdminSession();
    session.role = 'superadmin';
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ ok: true, firstTime: true, email: cleanEmail });
  }

  // Normal login: verify email if superadmin email is set
  if (db.superAdmin.email && email) {
    const inputEmail = email.trim().toLowerCase();
    if (inputEmail !== db.superAdmin.email.toLowerCase()) {
      return NextResponse.json({ error: 'E-mel atau kata laluan tidak sah.' }, { status: 401 });
    }
  }

  const valid = await verifyPassword(password, db.superAdmin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'E-mel atau kata laluan tidak sah.' }, { status: 401 });
  }

  const session = await getSuperAdminSession();
  session.role = 'superadmin';
  session.isLoggedIn = true;
  await session.save();

  return NextResponse.json({ ok: true, email: db.superAdmin.email });
}

export async function DELETE() {
  const session = await getSuperAdminSession();
  session.destroy();
  const coupleSession = await getCoupleSession();
  coupleSession.destroy();
  return NextResponse.json({ ok: true });
}
