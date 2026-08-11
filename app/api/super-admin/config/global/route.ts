import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSuperAdminSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSuperAdminSession();
    if (!session.isLoggedIn || session.role !== 'superadmin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { globalTextOverrides, importedJsonBase } = await req.json();

    const db = await readDb();
    if (globalTextOverrides !== undefined) db.globalTextOverrides = globalTextOverrides;
    if (importedJsonBase !== undefined) db.importedJsonBase = importedJsonBase;
    await writeDb(db);

    return NextResponse.json({ 
      success: true, 
      globalTextOverrides: db.globalTextOverrides, 
      importedJsonBase: db.importedJsonBase 
    });
  } catch (err) {
    console.error('Error updating global config:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
