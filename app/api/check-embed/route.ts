// app/api/check-embed/route.ts

import type { NextRequest } from 'next/server';

interface EmbedCheckResponse {
  canEmbed: boolean;
  reason?: string;
}

export async function GET(req: NextRequest): Promise<Response> {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    const json: EmbedCheckResponse = { canEmbed: false, reason: 'URL 参数缺失或格式错误' };
    return new Response(JSON.stringify(json), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(url, { method: 'HEAD' });
    const xFrameOptions = response.headers.get('X-Frame-Options');
    const contentSecurityPolicy = response.headers.get('Content-Security-Policy');

    if (xFrameOptions) {
      if (xFrameOptions.includes('DENY')) {
        const json: EmbedCheckResponse = { canEmbed: false, reason: 'X-Frame-Options 设置为 DENY，禁止嵌入' };
        return new Response(JSON.stringify(json), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (xFrameOptions.includes('SAMEORIGIN')) {
        const json: EmbedCheckResponse = { canEmbed: false, reason: 'X-Frame-Options 设置为 SAMEORIGIN，仅允许同源嵌入' };
        return new Response(JSON.stringify(json), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    if (contentSecurityPolicy) {
      const frameAncestorsMatch = contentSecurityPolicy.match(/frame-ancestors\s+([^;]+)/);
      if (frameAncestorsMatch) {
        const allowedOrigins = frameAncestorsMatch[1]
          .split(' ')
          .map(origin => origin.replace(/['"]/g, ''));
        const json: EmbedCheckResponse = {
          canEmbed: false,
          reason: `Content-Security-Policy 限制了 frame-ancestors: ${allowedOrigins.join(', ')}`,
        };
        return new Response(JSON.stringify(json), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // 如果没有检测到阻止嵌入的头部
    const json: EmbedCheckResponse = { canEmbed: true };
    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error checking embed permissions:', error);
    const json: EmbedCheckResponse = { canEmbed: false, reason: '服务器错误，无法检查嵌入权限' };
    return new Response(JSON.stringify(json), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
