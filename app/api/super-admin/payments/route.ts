import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, Payment } from '@/lib/db';
import { getSuperAdminSession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

async function requireSuperAdmin() {
  const session = await getSuperAdminSession();
  if (!session.isLoggedIn || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// GET /api/super-admin/payments — List all payment records
export async function GET() {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  const db = await readDb();
  const payments = db.payments ?? [];
  
  // Sort payments by date descending
  const sorted = [...payments].sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());

  return NextResponse.json({ payments: sorted });
}

// POST /api/super-admin/payments — Record a manual offline payment
export async function POST(req: NextRequest) {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { coupleId, amount, packageName, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Jumlah bayaran mestilah melebihi 0.' }, { status: 400 });
    }

    const db = await readDb();
    
    // Find couple name if coupleId is provided, or default to general
    let coupleName = 'Bayaran Am';
    if (coupleId) {
      const couple = db.couples.find(c => c.id === coupleId);
      if (couple) {
        coupleName = `${couple.config.groomName} & ${couple.config.brideName}`;
      }
    }

    const newPayment: Payment = {
      id: uuidv4(),
      coupleId: coupleId || 'general',
      coupleName,
      packageName: packageName || 'Lain-lain / Tambahan',
      amount: Number(amount),
      paymentDate: new Date().toISOString(),
      notes: notes || '',
    };

    if (!db.payments) {
      db.payments = [];
    }
    db.payments.push(newPayment);
    await writeDb(db);

    return NextResponse.json({ ok: true, payment: newPayment });
  } catch (err) {
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
