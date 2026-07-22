import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSuperAdminSession, getCoupleSession, hashPassword, verifyPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 });

  const db = readDb();

  // First-time setup: if no password hash exists, set it
  if (!db.superAdmin.passwordHash) {
    db.superAdmin.passwordHash = await hashPassword(password);
    writeDb(db);
    const session = await getSuperAdminSession();
    session.role = 'superadmin';
    session.isLoggedIn = true;
    await session.save();
    return NextResponse.json({ ok: true, firstTime: true });
  }

  const valid = await verifyPassword(password, db.superAdmin.passwordHash);
  if (!valid) return NextResponse.json({ error: 'Invalid password' }, { status: 401 });

  const session = await getSuperAdminSession();
  session.role = 'superadmin';
  session.isLoggedIn = true;
  await session.save();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await getSuperAdminSession();
  session.destroy();
  const coupleSession = await getCoupleSession();
  coupleSession.destroy();
  return NextResponse.json({ ok: true });
}
