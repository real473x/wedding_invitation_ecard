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

  const db = await readDb();
  return NextResponse.json({
    username: db.superAdmin.username || '',
  });
}

// PATCH /api/super-admin/account — Change super admin username / password
export async function PATCH(req: NextRequest) {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  try {
    const { currentPassword, newUsername, newPassword } = await req.json();
    if (!currentPassword) {
      return NextResponse.json({ error: 'Please enter your current password for verification.' }, { status: 400 });
    }

    const db = await readDb();
    
    // Verify current password
    const valid = await verifyPassword(currentPassword, db.superAdmin.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    if (newUsername) {
      if (newUsername.trim().length < 3) {
        return NextResponse.json({ error: 'Username must be at least 3 characters long.' }, { status: 400 });
      }
      db.superAdmin.username = newUsername.trim();
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters long.' }, { status: 400 });
      }
      db.superAdmin.passwordHash = await hashPassword(newPassword);
    }

    await writeDb(db);

    return NextResponse.json({ ok: true, username: db.superAdmin.username });
  } catch (err) {
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
