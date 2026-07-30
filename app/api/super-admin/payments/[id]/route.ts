import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSuperAdminSession } from '@/lib/auth';

async function requireSuperAdmin() {
  const session = await getSuperAdminSession();
  if (!session.isLoggedIn || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// PATCH /api/super-admin/payments/[id] - Update a payment
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  const { id } = await params;
  try {
    const body = await req.json();
    const { amount, packageName, notes } = body;

    const db = readDb();
    if (!db.payments) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const paymentIndex = db.payments.findIndex(p => p.id === id);
    if (paymentIndex === -1) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (amount !== undefined) db.payments[paymentIndex].amount = Number(amount);
    if (packageName !== undefined) db.payments[paymentIndex].packageName = packageName;
    if (notes !== undefined) db.payments[paymentIndex].notes = notes;

    writeDb(db);

    return NextResponse.json({ ok: true, payment: db.payments[paymentIndex] });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/super-admin/payments/[id] - Delete a payment
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  const { id } = await params;
  try {
    const db = readDb();
    if (!db.payments) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const initialLength = db.payments.length;
    db.payments = db.payments.filter(p => p.id !== id);

    if (db.payments.length === initialLength) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    writeDb(db);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
