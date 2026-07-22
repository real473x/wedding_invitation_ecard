import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getCoupleSession, hashPassword, verifyPassword } from '@/lib/auth';

async function requireCouple() {
  const session = await getCoupleSession();
  if (!session.isLoggedIn || session.role !== 'couple' || !session.coupleId) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), coupleId: '' };
  }
  return { error: null, coupleId: session.coupleId };
}

// PATCH /api/couple/account — Change couple admin password
export async function PATCH(req: NextRequest) {
  const { error, coupleId } = await requireCouple();
  if (error) return error;

  try {
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Sila isi kata laluan semasa dan kata laluan baru.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Kata laluan baru mestilah sekurang-kurangnya 6 aksara.' }, { status: 400 });
    }

    const db = readDb();
    const idx = db.couples.findIndex(c => c.id === coupleId);
    if (idx === -1) return NextResponse.json({ error: 'Akaun tidak dijumpai.' }, { status: 404 });

    // Verify current password
    const valid = await verifyPassword(currentPassword, db.couples[idx].passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Kata laluan semasa tidak betul.' }, { status: 400 });
    }

    // Update with new password & clear force flag
    db.couples[idx].passwordHash = await hashPassword(newPassword);
    db.couples[idx].mustChangePassword = false;
    writeDb(db);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Ralat pelayan. Cuba semula.' }, { status: 500 });
  }
}
