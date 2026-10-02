import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';
const localHosts = new Set(['localhost', '127.0.0.1', '[::1]']);

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (process.env.NODE_ENV !== 'development' ||
      !localHosts.has(request.nextUrl.hostname) ||
      !origin || origin !== request.nextUrl.origin ||
      request.headers.get('sec-fetch-site') !== 'same-origin') {
    return new NextResponse(null, { status: 404 });
  }
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 2_000_000) return new NextResponse(null, { status: 413 });
  let data;
  try { data = JSON.parse(raw); }
  catch { return new NextResponse(null, { status: 400 }); }
  if (!data || typeof data.tabId !== 'string' ||
      !/^[a-f0-9-]{36}$/.test(data.tabId) ||
      typeof data.path !== 'string' || !data.path.startsWith('/') ||
      typeof data.html !== 'string') return new NextResponse(null, { status: 400 });
  const directory = path.join(process.cwd(), '.next', 'dev-dom');
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, data.tabId + '.json'),
    JSON.stringify({ ...data, receivedAt: new Date().toISOString() }, null, 2), 'utf8');
  return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}
