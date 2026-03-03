import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { ApiEndpoints } from '@/configs/endpoints';

/**
 * Authenticated API Proxy
 *
 * Forwards requests to the backend with the session accessToken injected.
 * The client never needs to handle the token directly.
 *
 * Usage (client): GET/POST/... /api/proxy/users/paged-list
 *   → forwards to: NEXT_PUBLIC_API_URL/users/paged-list
 *   → with header: Authorization: Bearer <accessToken>
 */

const BACKEND_BASE = ApiEndpoints.main.replace(/\/$/, '');

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { path } = await params;
  const backendUrl = new URL(`${BACKEND_BASE}/${path.join('/')}`);

  // Forward query string
  req.nextUrl.searchParams.forEach((value, key) => {
    backendUrl.searchParams.set(key, value);
  });

  // Forward request body for non-GET methods
  let body: string | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.text();
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.accessToken}`,
  };

  const backendRes = await fetch(backendUrl.toString(), {
    method: req.method,
    headers,
    body: body || undefined,
    cache: 'no-store',
  });

  const data = await backendRes.text();

  return new NextResponse(data, {
    status: backendRes.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
