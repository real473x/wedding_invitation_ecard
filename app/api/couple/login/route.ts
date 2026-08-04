import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, getCoupleByLoginId } from '@/lib/db';
import { getCoupleSession, verifyPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { loginId, password } = await req.json();
  if (!loginId || !password) return NextResponse.json({ error: 'Login ID and password required' }, { status: 400 });

  const couple = getCoupleByLoginId(loginId);
  if (!couple) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  if (!couple.isActive) return NextResponse.json({ error: 'Your invitation site is currently inactive. Please contact the administrator.' }, { status: 403 });

  const valid = await verifyPassword(password, couple.passwordHash);
  if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const session = await getCoupleSession();
  session.role = 'couple';
  session.coupleId = couple.id;
  session.isLoggedIn = true;
  await session.save();
  return NextResponse.json({ ok: true, coupleId: couple.id, mustChangePassword: couple.mustChangePassword ?? false });
}

export async function DELETE() {
  const session = await getCoupleSession();
  session.destroy();
  return NextResponse.json({ ok: true });
}
