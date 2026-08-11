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
      return NextResponse.json({ error: 'Please enter current password and new password.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long.' }, { status: 400 });
    }

    const db = await readDb();
    const idx = db.couples.findIndex(c => c.id === coupleId);
    if (idx === -1) return NextResponse.json({ error: 'Account not found.' }, { status: 404 });

    // Verify current password
    const valid = await verifyPassword(currentPassword, db.couples[idx].passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    // Update with new password & clear force flag
    db.couples[idx].passwordHash = await hashPassword(newPassword);
    db.couples[idx].mustChangePassword = false;
    await writeDb(db);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
