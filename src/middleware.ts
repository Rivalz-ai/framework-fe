
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {

  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  const pathname = url.pathname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);
  requestHeaders.set('x-origin', url.origin);
  requestHeaders.set('x-pathname', pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  //Only allow iframe from trusted domains
  const allowedOrigins = [
    'https://rivalz.ai',
    'http://localhost:3000',
  ];
  if (origin && !allowedOrigins.includes(origin)) {
    response.headers.set('X-Frame-Options', 'DENY'); //Deny iframe from other domains
    response.headers.set('Content-Security-Policy', "frame-ancestors 'none'"); //Deny iframe from other domains
  } else {
    response.headers.set('X-Frame-Options', 'SAMEORIGIN'); //Allow iframe from same origin
    //Allow iframe from trusted domains
    response.headers.set(
      'Content-Security-Policy',
      "frame-ancestors 'self' https://rivalz.ai https://stake.rivalz.ai https://znode.rivalz.ai http://localhost:3000",
    );
  }

  response.headers.set('X-Content-Type-Options', 'nosniff'); //Deny MIME type sniffing
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin'); //Deny leakage referrer
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()'); //Deny access camera, microphone, geolocation
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload'); //Deny downgrade attack
  response.headers.set('X-XSS-Protection', '1; mode=block'); //Deny XSS
  response.headers.set('X-DNS-Prefetch-Control', 'on'); //Disable DNS prefetch

  return response;
}

export const config = {
  matcher: ['/:path*'],
};
