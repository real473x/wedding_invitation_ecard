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

// GET /api/super-admin/account — Get super admin profile info
export async function GET() {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  const db = readDb();
  return NextResponse.json({
    email: db.superAdmin.email || '',
  });
}

// PATCH /api/super-admin/account — Change super admin email / password
export async function PATCH(req: NextRequest) {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  try {
    const { currentPassword, newEmail, newPassword } = await req.json();
    if (!currentPassword) {
      return NextResponse.json({ error: 'Sila isi kata laluan semasa untuk pengesahan.' }, { status: 400 });
    }

    const db = readDb();
    
    // Verify current password
    const valid = await verifyPassword(currentPassword, db.superAdmin.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Kata laluan semasa tidak betul.' }, { status: 400 });
    }

    if (newEmail) {
      if (!newEmail.includes('@')) {
        return NextResponse.json({ error: 'Sila masukkan e-mel yang sah.' }, { status: 400 });
      }
      db.superAdmin.email = newEmail.trim().toLowerCase();
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Kata laluan baru mestilah sekurang-kurangnya 6 aksara.' }, { status: 400 });
      }
      db.superAdmin.passwordHash = await hashPassword(newPassword);
    }

    writeDb(db);

    return NextResponse.json({ ok: true, email: db.superAdmin.email });
  } catch (err) {
    return NextResponse.json({ error: 'Ralat pelayan. Cuba semula.' }, { status: 500 });
  }
}
