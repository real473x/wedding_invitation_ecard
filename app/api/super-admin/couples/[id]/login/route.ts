import { NextRequest, NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import { getSuperAdminSession, getCoupleSession } from '@/lib/auth';

async function requireSuperAdmin() {
  const session = await getSuperAdminSession();
  if (!session.isLoggedIn || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// POST /api/super-admin/couples/[id]/login — Impersonate login as this couple (to edit their dashboard)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  const { id } = await params;
  const db = readDb();
  const couple = db.couples.find(c => c.id === id);
  if (!couple) {
    return NextResponse.json({ error: 'Couple not found' }, { status: 404 });
  }

  // Set couple session cookie
  const session = await getCoupleSession();
  session.role = 'couple';
  session.coupleId = couple.id;
  session.isLoggedIn = true;
  await session.save();

  return NextResponse.json({ ok: true });
}
