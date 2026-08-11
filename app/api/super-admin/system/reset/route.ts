import { NextResponse } from 'next/server';
import { getSuperAdminSession, destroyAllSessions } from '@/lib/auth';
import { dropAllData } from '@/lib/db';

async function requireSuperAdmin() {
  const session = await getSuperAdminSession();
  if (!session.isLoggedIn || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// POST /api/super-admin/system/reset — Drop database, purge cache, logout all users & restart from scratch
export async function POST() {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  try {
    // Drop all DB data, delete local db.json, flush Redis key
    await dropAllData();

    // Destroy all sessions (logout superadmin and all couple users)
    await destroyAllSessions();

    return NextResponse.json({
      ok: true,
      setupRequired: true,
      message: 'System successfully reset. All data purged and sessions destroyed.'
    });
  } catch (err: any) {
    console.error('System reset error:', err);
    return NextResponse.json({ error: err?.message || 'Server error during system reset' }, { status: 500 });
  }
}
