import { NextRequest, NextResponse } from 'next/server';
import { ApiEndpoints } from '@/configs/endpoints';
import { getToken } from 'next-auth/jwt';
import axios from 'axios';

/**
 * Authenticated API Proxy
 *
 * Forwards requests to the backend with the session accessToken injected.
 * The client never needs to handle the token directly.
 *
 * Usage (client): GET/POST/... /api/admin-proxy/users/paged-list
 *   → forwards to: NEXT_PUBLIC_API_URL/users/paged-list
 *   → with header: Authorization: Bearer <accessToken>
 */

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const token = await getToken({ req });

  if (!token || !token.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const targetService = req.headers.get('x-target-service') || 'main';

  const pathArray = (await params).path || [];
  const path = pathArray.join('/');
  const searchParams = new URL(req.url).search;
  const targetUrl = `${ApiEndpoints[targetService as keyof typeof ApiEndpoints]}/${path}${searchParams}`;

  let body = undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const arrayBuffer = await req.arrayBuffer();
    body = arrayBuffer.byteLength ? Buffer.from(arrayBuffer) : undefined;
  }

  const response = await axios({
    method: req.method,
    url: targetUrl,
    data: body,
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      'Content-Type': req.headers.get('content-type') || 'application/json',
    },
    responseType: 'arraybuffer',
    validateStatus: () => true,
  });

  const responseHeaders = new Headers();

  const contentType = response.headers['content-type'];
  if (contentType) responseHeaders.set('Content-Type', contentType);

  const contentDisposition = response.headers['content-disposition'];
  if (contentDisposition)
    responseHeaders.set('Content-Disposition', contentDisposition);

  if (response.status === 204 || req.method === 'HEAD') {
    return new NextResponse(null, {
      status: response.status,
      headers: responseHeaders,
    });
  }

  return new NextResponse(response.data, {
    status: response.status,
    headers: responseHeaders,
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
