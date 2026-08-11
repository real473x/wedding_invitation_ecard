import { NextResponse } from 'next/server';
import { getSuperAdminSession } from '@/lib/auth';
import { getStorageInfo, deleteLocalDbFile } from '@/lib/db';

async function requireSuperAdmin() {
  const session = await getSuperAdminSession();
  if (!session.isLoggedIn || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// GET /api/super-admin/system/storage — Get storage & DB backend info
export async function GET() {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  try {
    const info = await getStorageInfo();
    return NextResponse.json({ ok: true, info });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

// DELETE /api/super-admin/system/storage — Delete local db.json file
export async function DELETE() {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  try {
    const deleted = deleteLocalDbFile();
    const info = await getStorageInfo();
    return NextResponse.json({ ok: true, deleted, info });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
