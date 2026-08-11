import { NextRequest, NextResponse } from 'next/server';
import { getCoupleSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

async function requireCouple() {
  const session = await getCoupleSession();
  if (!session.isLoggedIn || session.role !== 'couple' || !session.coupleId) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), coupleId: '' };
  }
  return { error: null, coupleId: session.coupleId };
}

// POST /api/couple/upload — Upload a background image
export async function POST(req: NextRequest) {
  const { error } = await requireCouple();
  if (error) return error;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'Tiada fail terpilih.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const targetDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, filename);
    fs.writeFileSync(targetPath, buffer);

    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ ok: true, url: fileUrl });
  } catch (err) {
    return NextResponse.json({ error: 'File upload error.' }, { status: 500 });
  }
}
