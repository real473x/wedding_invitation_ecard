import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, getCoupleById, RSVP, Wish } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// POST /api/couple/rsvp?coupleId=xxx — public RSVP submission
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const coupleId = searchParams.get('coupleId');
  if (!coupleId) return NextResponse.json({ error: 'coupleId required' }, { status: 400 });

  const couple = getCoupleById(coupleId);
  if (!couple || !couple.isActive) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json();
  const { name, phone, attending, paxCount, wishes: wishText, type } = body;

  const db = readDb();
  const idx = db.couples.findIndex(c => c.id === coupleId);

  if (type === 'wish') {
    // Just a wish submission
    if (!name || !wishText) return NextResponse.json({ error: 'Name and message required' }, { status: 400 });
    const wish: Wish = {
      id: uuidv4(),
      name,
      message: wishText,
      createdAt: new Date().toISOString(),
    };
    db.couples[idx].config.wishes.push(wish);
    writeDb(db);
    return NextResponse.json({ ok: true, wish });
  }

  // Full RSVP
  if (!name || !attending) return NextResponse.json({ error: 'Name and attendance required' }, { status: 400 });
  const rsvp: RSVP = {
    id: uuidv4(),
    name,
    phone: phone || '',
    attending,
    paxCount: Number(paxCount) || 1,
    wishes: wishText || '',
    createdAt: new Date().toISOString(),
  };
  db.couples[idx].config.rsvps.push(rsvp);
  if (wishText) {
    const wish: Wish = { id: uuidv4(), name, message: wishText, createdAt: new Date().toISOString() };
    db.couples[idx].config.wishes.push(wish);
  }
  writeDb(db);
  return NextResponse.json({ ok: true, rsvp });
}
