import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export interface SessionData {
  role?: 'superadmin' | 'couple';
  coupleId?: string;
  isLoggedIn?: boolean;
}

function getSessionPassword(): string {
  const secret = process.env.SESSION_SECRET || '';
  if (secret.length >= 32) return secret;
  return 'ewedding-super-secret-key-min-32-chars-long-secure-fallback!';
}

const SESSION_OPTIONS = {
  password: getSessionPassword(),
  cookieName: 'ewedding_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, {
    ...SESSION_OPTIONS,
    password: getSessionPassword(),
  });
}

export async function getSuperAdminSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, {
    ...SESSION_OPTIONS,
    password: getSessionPassword(),
    cookieName: 'ewedding_superadmin_session',
  });
}

export async function getCoupleSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, {
    ...SESSION_OPTIONS,
    password: getSessionPassword(),
    cookieName: 'ewedding_couple_session',
  });
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

export function generateCoupleId(groomName: string, brideName: string, year: string): string {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
  return `${clean(groomName)}-${clean(brideName)}-${year}`;
}

export function generatePassword(length = 10): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function destroyAllSessions(): Promise<void> {
  try {
    const s1 = await getSuperAdminSession();
    s1.destroy();
  } catch (_) {}
  try {
    const s2 = await getCoupleSession();
    s2.destroy();
  } catch (_) {}
  try {
    const s3 = await getSession();
    s3.destroy();
  } catch (_) {}
}

