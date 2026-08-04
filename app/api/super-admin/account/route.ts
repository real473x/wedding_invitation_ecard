import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSuperAdminSession, hashPassword, verifyPassword } from '@/lib/auth';

async function requireSuperAdmin() {
  const session = await getSuperAdminSession();
  if (!session.isLoggedIn || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// PATCH /api/super-admin/account — Change super admin password
export async function PATCH(req: NextRequest) {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  try {
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Sila isi kata laluan semasa dan kata laluan baru.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Kata laluan baru mestilah sekurang-kurangnya 6 aksara.' }, { status: 400 });
    }

    const db = readDb();
    
    // Verify current password
    const valid = await verifyPassword(currentPassword, db.superAdmin.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Kata laluan semasa tidak betul.' }, { status: 400 });
    }

    // Update with new password
    db.superAdmin.passwordHash = await hashPassword(newPassword);
    writeDb(db);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Ralat pelayan. Cuba semula.' }, { status: 500 });
  }
}
