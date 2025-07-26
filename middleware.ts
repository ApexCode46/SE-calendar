// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // ถ้าไม่มี token ให้ redirect ไปหน้า login
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // ดึง role จาก token พร้อม type safety
    const userRole = (token?.role as string)?.toLowerCase();
    const allowedRoles = ['teacher', 'student', 'admin'];

    // ตรวจสอบว่า role ที่ได้รับอนุญาต
    if (!userRole || !allowedRoles.includes(userRole)) {
      console.warn(`Unauthorized role attempted access: ${userRole} to ${pathname}`);
      return NextResponse.redirect(new URL('/', req.url));
    }

    // กำหนด permissions สำหรับแต่ละ role
    const rolePermissions = {
      admin: {
        pages: ['/calendar', '/reserve', '/admin', '/dashboard'],
        apis: ['/api/event', '/api/myReserve', '/api/item', '/api/admin', '/api/users', '/api/reports']
      },
      teacher: {
        pages: ['/calendar', '/reserve', '/dashboard'],
        apis: ['/api/event', '/api/myReserve', '/api/item', '/api/reports']
      },
      student: {
        pages: ['/calendar', '/reserve'],
        apis: ['/api/event', '/api/myReserve', '/api/item']
      }
    };

    const userPermissions = rolePermissions[userRole as keyof typeof rolePermissions];

    // ตรวจสอบ API access
    if (pathname.startsWith('/api/')) {
      const hasApiAccess = userPermissions?.apis.some(api => 
        pathname.startsWith(api) || pathname === api
      );

      if (!hasApiAccess) {
        console.warn(`Role ${userRole} attempted unauthorized API access: ${pathname}`);
        return NextResponse.json(
          { 
            error: 'Forbidden', 
            message: `Role ${userRole} ไม่มีสิทธิ์เข้าถึง API นี้`,
            code: 'INSUFFICIENT_PERMISSIONS'
          }, 
          { status: 403 }
        );
      }
    }

    // ตรวจสอบ Page access
    if (!pathname.startsWith('/api/') && pathname !== '/') {
      const hasPageAccess = userPermissions?.pages.some(page => 
        pathname.startsWith(page) || pathname === page
      );

      if (!hasPageAccess) {
        console.warn(`Role ${userRole} attempted unauthorized page access: ${pathname}`);
        return NextResponse.redirect(new URL('/calendar', req.url));
      }
    }

    // เพิ่ม headers สำหรับ debugging และ logging
    const response = NextResponse.next();
    response.headers.set('X-User-Role', userRole);
    response.headers.set('X-User-ID', String(token?.id || 'unknown'));
    response.headers.set('X-Access-Time', new Date().toISOString());

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // อนุญาตให้เข้าหน้า login เสมอ
        if (pathname === '/') {
          return true;
        }

        // ตรวจสอบว่ามี token หรือไม่
        if (!token) {
          return false;
        }

        // ตรวจสอบว่ามี role ที่ถูกต้องหรือไม่
        const userRole = (token?.role as string)?.toLowerCase();
        const allowedRoles = ['teacher', 'student', 'admin'];
        
        return !!userRole && allowedRoles.includes(userRole);
      },
    },
    pages: {
      signIn: '/', // หน้า login
      error: '/', // หน้า error redirect ไปหน้า login
    },
  }
);

export const config = {
  matcher: [
    // Protected pages
    '/calendar/:path*',
    '/reserve/:path*',
    '/admin/:path*',
    '/dashboard/:path*',
    
    // Protected APIs
    '/api/event/:path*',
    '/api/myReserve/:path*',
    '/api/item/:path*',
    '/api/admin/:path*',
    '/api/users/:path*',
    '/api/reports/:path*',
    
    // Auth APIs (อนุญาตให้ทุกคนเข้าถึง - ไม่ต้องใส่ในนี้)
    // '/api/auth/:path*' - excluded intentionally
  ],
};
