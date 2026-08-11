import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

// POST /api/couple/gift — Public endpoint to update suggested gifts from guests
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const coupleId = searchParams.get('coupleId');
    if (!coupleId) {
      return NextResponse.json({ error: 'coupleId diperlukan.' }, { status: 400 });
    }

    const { gifts } = await req.json();
    if (!Array.isArray(gifts)) {
      return NextResponse.json({ error: 'Format data tidak sah.' }, { status: 400 });
    }

    const db = await readDb();
    const idx = db.couples.findIndex(c => c.id === coupleId || c.loginId === coupleId);
    if (idx === -1) {
      return NextResponse.json({ error: 'Couple not found.' }, { status: 404 });
    }

    // Save the suggested gifts
    db.couples[idx].config.gifts = gifts;
    await writeDb(db);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Error saving gift registry.' }, { status: 500 });
  }
}
