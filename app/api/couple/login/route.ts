import { NextRequest, NextResponse } from 'next/server';
import { getCoupleByLoginId } from '@/lib/db';
import { getCoupleSession, verifyPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { loginId, password } = body;
    if (!loginId || !password) {
      return NextResponse.json({ error: 'Login ID and password are required' }, { status: 400 });
    }

    const cleanLoginId = loginId.trim();
    const couple = await getCoupleByLoginId(cleanLoginId);
    if (!couple) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!couple.isActive) {
      return NextResponse.json({ error: 'Your invitation site is currently inactive. Please contact the administrator.' }, { status: 403 });
    }

    const valid = await verifyPassword(password, couple.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const session = await getCoupleSession();
    session.role = 'couple';
    session.coupleId = couple.id;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({
      ok: true,
      coupleId: couple.id,
      mustChangePassword: couple.mustChangePassword ?? false,
    });
  } catch (err: any) {
    console.error('POST /api/couple/login error:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getCoupleSession();
    session.destroy();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: true });
  }
}
