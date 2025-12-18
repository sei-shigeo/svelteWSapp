import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// Supabase接続設定
const client = postgres(env.DATABASE_URL, {
	max: 10, // 最大接続数
	idle_timeout: 20, // アイドルタイムアウト（秒）
	connect_timeout: 10, // 接続タイムアウト（秒）
	prepare: false // Supabase Transaction mode (port 6543) では必須
});

export const db = drizzle(client, { schema });
