import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSuperAdminSession, hashPassword, generatePassword } from '@/lib/auth';

async function requireSuperAdmin() {
  const session = await getSuperAdminSession();
  if (!session.isLoggedIn || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// PATCH /api/super-admin/users/[id] — Update user details or reset password
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const body = await req.json();
    const db = await readDb();

    if (id === 'superadmin') {
      const { username, password, resetPassword } = body;
      if (username) {
        if (username.trim().length < 3) {
          return NextResponse.json({ error: 'Username must be at least 3 characters.' }, { status: 400 });
        }
        db.superAdmin.username = username.trim();
      }

      let newPassword = null;
      if (resetPassword) {
        newPassword = generatePassword();
        db.superAdmin.passwordHash = await hashPassword(newPassword);
      } else if (password) {
        if (password.length < 6) {
          return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
        }
        db.superAdmin.passwordHash = await hashPassword(password);
      }

      await writeDb(db);
      return NextResponse.json({ ok: true, username: db.superAdmin.username, newPassword });
    }

    // Couple User
    const coupleIndex = db.couples.findIndex(c => c.id === id);
    if (coupleIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const couple = db.couples[coupleIndex];
    const { username, password, resetPassword, packageName, statusMode, expiresAt } = body;

    if (username && username.trim() !== couple.loginId) {
      const existing = db.couples.find(c => c.loginId === username.trim() && c.id !== id);
      if (existing) {
        return NextResponse.json({ error: 'Login ID is already taken.' }, { status: 400 });
      }
      couple.loginId = username.trim();
    }

    let newPassword = null;
    if (resetPassword) {
      newPassword = generatePassword();
      couple.passwordHash = await hashPassword(newPassword);
      couple.mustChangePassword = true;
    } else if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
      }
      couple.passwordHash = await hashPassword(password);
    }

    if (packageName) couple.packageName = packageName;
    if (statusMode) couple.statusMode = statusMode;
    if (expiresAt) couple.expiresAt = expiresAt;

    db.couples[coupleIndex] = couple;
    await writeDb(db);

    return NextResponse.json({ ok: true, couple, newPassword });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

// DELETE /api/super-admin/users/[id] — Delete user
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  try {
    const { id } = await params;
    if (id === 'superadmin') {
      return NextResponse.json(
        { error: 'Super Admin account cannot be deleted individually. Use Drop Process / Reset System to reset the system.' },
        { status: 400 }
      );
    }

    const db = await readDb();
    const initialLength = db.couples.length;
    db.couples = db.couples.filter(c => c.id !== id);

    if (db.couples.length === initialLength) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await writeDb(db);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
