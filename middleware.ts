import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATH = ['/sign-in', '/sign-up', '/map'];

export default function middleware(request: NextRequest) {
  const { cookies } = request;

  const url = new URL(request.url);

  const isPublicPathRequest = PUBLIC_PATH.includes(url.pathname);
  const hasAccessToken = cookies.has('accessToken');

  if (!hasAccessToken && !isPublicPathRequest) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}
