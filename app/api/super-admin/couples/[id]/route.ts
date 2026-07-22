import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSuperAdminSession, hashPassword, generatePassword } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

async function requireSuperAdmin() {
  const session = await getSuperAdminSession();
  if (!session.isLoggedIn || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

function deleteUploadedFiles(config: any) {
  if (!config) return;
  const publicDir = path.join(process.cwd(), 'public');

  const scanAndDelete = (obj: any) => {
    if (typeof obj === 'string') {
      if (obj.includes('/uploads/')) {
        try {
          // Resolve url path relative to /public directory
          // e.g. /uploads/172350... -> public/uploads/172350...
          const cleanPath = obj.split('?')[0].replace(/^\/+/, ''); // remove leading slashes
          const diskPath = path.join(publicDir, cleanPath);
          if (fs.existsSync(diskPath)) {
            fs.unlinkSync(diskPath);
          }
        } catch (e) {
          console.error('Failed to delete file:', obj, e);
        }
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(item => scanAndDelete(item));
    } else if (typeof obj === 'object' && obj !== null) {
      Object.values(obj).forEach(val => scanAndDelete(val));
    }
  };

  scanAndDelete(config);
}

// PATCH /api/super-admin/couples/[id] — toggle active, reset password, update package info
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  const { id } = await params;
  const body = await req.json();
  const db = readDb();
  const idx = db.couples.findIndex(c => c.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Couple not found' }, { status: 404 });

  let newPassword: string | undefined;

  if (typeof body.isActive === 'boolean') {
    db.couples[idx].isActive = body.isActive;
  }
  if (body.statusMode) {
    db.couples[idx].statusMode = body.statusMode;
  }
  if (body.packageName) {
    db.couples[idx].packageName = body.packageName;
  }
  if (body.expiresAt) {
    db.couples[idx].expiresAt = body.expiresAt;
  }
  if (body.resetPassword) {
    newPassword = generatePassword();
    db.couples[idx].passwordHash = await hashPassword(newPassword);
    db.couples[idx].mustChangePassword = true; // force change on login
  }

  writeDb(db);
  return NextResponse.json({ ok: true, newPassword });
}

// DELETE /api/super-admin/couples/[id] — delete couple and all their data
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authErr = await requireSuperAdmin();
  if (authErr) return authErr;

  const { id } = await params;
  const db = readDb();
  const idx = db.couples.findIndex(c => c.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Couple not found' }, { status: 404 });

  // Clean up uploaded media files
  deleteUploadedFiles(db.couples[idx].config);

  db.couples.splice(idx, 1);
  writeDb(db);
  return NextResponse.json({ ok: true });
}
