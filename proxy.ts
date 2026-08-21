import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

const { auth } = NextAuth(authConfig);

export const proxy = auth((request) => {
    const { pathname } = request.nextUrl;

    const isAdminRoute = pathname.startsWith('/admin') &&
        pathname !== '/admin/login';

    if (isAdminRoute) {
        const session = request.auth;

        if (!session) {
            return NextResponse.redirect(
                new URL('/admin/login', request.url)
            );
        }

        if (session.user?.role !== 'admin') {
            return NextResponse.redirect(
                new URL('/', request.url)
            );
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/admin/:path*'],
};




