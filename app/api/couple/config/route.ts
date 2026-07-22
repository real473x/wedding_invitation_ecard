import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, WeddingConfig } from '@/lib/db';
import { getCoupleSession } from '@/lib/auth';

async function requireCouple() {
  const session = await getCoupleSession();
  if (!session.isLoggedIn || session.role !== 'couple' || !session.coupleId) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), coupleId: '' };
  }
  return { error: null, coupleId: session.coupleId };
}

// GET /api/couple/config — get own wedding config
export async function GET() {
  const { error, coupleId } = await requireCouple();
  if (error) return error;

  const db = readDb();
  const couple = db.couples.find(c => c.id === coupleId);
  if (!couple) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Calculate default values if not explicitly set
  const expiresAt = couple.expiresAt ?? new Date(new Date(couple.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const daysRemaining = Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return NextResponse.json({
    config: couple.config,
    loginId: couple.loginId,
    id: couple.id,
    mustChangePassword: couple.mustChangePassword ?? false,
    expiresAt,
    daysRemaining,
    packageName: couple.packageName ?? '30 Hari',
    statusMode: couple.statusMode ?? 'auto',
  });
}

// PATCH /api/couple/config — update own wedding config (partial)
export async function PATCH(req: NextRequest) {
  const { error, coupleId } = await requireCouple();
  if (error) return error;

  const body = await req.json() as Partial<WeddingConfig>;
  const db = readDb();
  const idx = db.couples.findIndex(c => c.id === coupleId);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Deep merge config
  const current = db.couples[idx].config;
  db.couples[idx].config = { ...current, ...body };
  writeDb(db);

  return NextResponse.json({ ok: true, config: db.couples[idx].config });
}
