import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export interface SessionData {
  role?: 'superadmin' | 'couple';
  coupleId?: string;
  isLoggedIn?: boolean;
}

const SESSION_OPTIONS = {
  password: process.env.SESSION_SECRET || 'ewedding-super-secret-key-min-32-chars!!',
  cookieName: 'ewedding_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
}

export async function getSuperAdminSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, {
    ...SESSION_OPTIONS,
    cookieName: 'ewedding_superadmin_session',
  });
}

export async function getCoupleSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, {
    ...SESSION_OPTIONS,
    cookieName: 'ewedding_couple_session',
  });
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
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
