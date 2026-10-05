import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If we want to add Role-based authorization later (e.g. blocking non-admins from /admin)
    // we can check req.nextauth.token?.role here.
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/en/auth",
    },
  }
);

export const config = {
  matcher: [
    "/:locale/directory/:path*",
    "/:locale/register/:path*",
    "/:locale/admin/:path*"
  ],
};
