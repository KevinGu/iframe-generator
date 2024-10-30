// app/api/check-embed/route.ts

import type { NextRequest } from 'next/server';

interface EmbedCheckResponse {
  headers: {
    'x-frame-options': string | null;
    'content-security-policy': string | null;
  };
}

export async function GET(req: NextRequest): Promise<Response> {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    const json: EmbedCheckResponse = { headers: { 'x-frame-options': null, 'content-security-policy': null } };
    return new Response(JSON.stringify(json), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(url, { method: 'GET' });
    const headers = {
      'x-frame-options': response.headers.get('X-Frame-Options'),
      'content-security-policy': response.headers.get('Content-Security-Policy')
    };
    
    // 返回完整的头信息供前端处理
    const json = { headers };
    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error checking embed permissions:', error);
    const json: EmbedCheckResponse = { headers: { 'x-frame-options': null, 'content-security-policy': null } };
    return new Response(JSON.stringify(json), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
