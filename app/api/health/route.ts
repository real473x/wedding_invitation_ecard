import { NextResponse } from 'next/server';
import { readDb, getRedisClient } from '@/lib/db';

export async function GET() {
  try {
    const redis = getRedisClient();
    let isRedisConnected = false;
    if (redis) {
      try {
        await redis.ping();
        isRedisConnected = true;
      } catch (_) {
        isRedisConnected = false;
      }
    }

    const db = await readDb();
    const isVercel = !!(process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV);
    const environment = isVercel
      ? `Vercel Serverless (${process.env.VERCEL_ENV || process.env.NODE_ENV || 'production'})`
      : `Local Development (${process.env.NODE_ENV || 'development'})`;

    const superAdminConfigured = !!(db.superAdmin?.username && db.superAdmin?.passwordHash);

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment,
      isVercel,
      database: {
        backend: isRedisConnected ? 'Upstash Redis (ewedding:db)' : 'File / In-Memory Storage',
        redisConnected: isRedisConnected,
      },
      superAdmin: {
        configured: superAdminConfigured,
        username: db.superAdmin?.username || null,
        status: superAdminConfigured ? '🟢 Active Account Configured' : '🔴 Uninitialized (Setup Required)',
      },
      totalCouples: db.couples?.length || 0,
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'error',
      error: err?.message || 'Server error',
    }, { status: 500 });
  }
}
