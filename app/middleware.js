
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!session && req.nextUrl.pathname.startsWith('/calendar')) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  return NextResponse.next();
}