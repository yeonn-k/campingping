import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATH = ['/sign-in', '/sign-up', '/map'];

export default async function middleware(request: NextRequest) {
  const { cookies } = request;

  const url = new URL(request.url);

  const isPublicPathRequest = PUBLIC_PATH.includes(url.pathname);
  const hasAccessToken = cookies.has('accessToken');
  const hasRefreshToken = cookies.has('refreshToken');

  if (!hasAccessToken && hasRefreshToken) {
    const refreshToken = cookies.get('refreshToken');

    const res = await fetch(`${process.env.BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    if (res.ok) {
      const { accessToken } = await res.json();

      const response = NextResponse.next();
      response.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });

      return response;
    } else {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (!hasAccessToken && !isPublicPathRequest) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}
