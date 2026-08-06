import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, Wish } from '@/lib/db';
import { getCoupleSession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

// GET /api/couple/wishes — get wishes for current authenticated couple
export async function GET(req: NextRequest) {
  const session = await getCoupleSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = readDb();
  const couple = db.couples.find(c => c.id === session.coupleId);
  if (!couple) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ wishes: couple.config.wishes || [] });
}

// POST /api/couple/wishes — add new manual wish record
export async function POST(req: NextRequest) {
  const session = await getCoupleSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, message } = body;
  if (!name || !message) {
    return NextResponse.json({ error: 'Name and message required' }, { status: 400 });
  }

  const db = readDb();
  const idx = db.couples.findIndex(c => c.id === session.coupleId);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const newWish: Wish = {
    id: uuidv4(),
    name: name.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  if (!db.couples[idx].config.wishes) {
    db.couples[idx].config.wishes = [];
  }
  db.couples[idx].config.wishes.push(newWish);
  writeDb(db);

  return NextResponse.json({ ok: true, wish: newWish });
}

// PATCH /api/couple/wishes — edit or toggle visibility of existing wish record
export async function PATCH(req: NextRequest) {
  const session = await getCoupleSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, name, message, isHidden } = body;
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const db = readDb();
  const idx = db.couples.findIndex(c => c.id === session.coupleId);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const wishes = db.couples[idx].config.wishes || [];
  const wishIdx = wishes.findIndex(w => w.id === id);
  if (wishIdx === -1) return NextResponse.json({ error: 'Wish not found' }, { status: 404 });

  db.couples[idx].config.wishes[wishIdx] = {
    ...wishes[wishIdx],
    ...(name !== undefined ? { name: name.trim() } : {}),
    ...(message !== undefined ? { message: message.trim() } : {}),
    ...(isHidden !== undefined ? { isHidden: Boolean(isHidden) } : {}),
  };
  writeDb(db);

  return NextResponse.json({ ok: true, wish: db.couples[idx].config.wishes[wishIdx] });
}

// DELETE /api/couple/wishes — delete wish record
export async function DELETE(req: NextRequest) {
  const session = await getCoupleSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const db = readDb();
  const idx = db.couples.findIndex(c => c.id === session.coupleId);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  db.couples[idx].config.wishes = (db.couples[idx].config.wishes || []).filter(w => w.id !== id);
  writeDb(db);

  return NextResponse.json({ ok: true });
}
