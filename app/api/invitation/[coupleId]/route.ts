import { NextRequest, NextResponse } from 'next/server';
import { readDb, getDefaultConfig, isCoupleActive } from '@/lib/db';

// GET /api/invitation/[coupleId] — public config (no sensitive data)
export async function GET(_req: NextRequest, { params }: { params: Promise<{ coupleId: string }> }) {
  const { coupleId } = await params;


  const db = await readDb();
  const couple = db.couples.find(c => c.loginId === coupleId || c.id === coupleId);
  
  if (!couple) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!isCoupleActive(couple)) return NextResponse.json({ error: 'inactive' }, { status: 403 });

  // Strip sensitive fields
  const { passwordHash: _ph, ...safe } = couple;
  return NextResponse.json({ couple: safe });
}
