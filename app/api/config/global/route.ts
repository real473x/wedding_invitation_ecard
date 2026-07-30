import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json({ globalTextOverrides: db.globalTextOverrides || {} });
  } catch (err) {
    console.error('Error fetching global config:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
