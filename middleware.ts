// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // ถ้าผ่าน authorized callback แล้วจะมาถึงตรงนี้ (คือผู้ใช้ล็อกอินแล้ว)
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
    pages: {
      signIn: '/', // เปลี่ยน URL 
    },
  }
);

// ระบุว่า Middleware นี้จะทำงานกับเส้นทางไหนบ้าง
export const config = {
  matcher: [
    '/api/:path*',          // ป้องกันทุก API
    '/'
  ],
};
