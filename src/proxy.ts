import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { AppRoutes } from '@/configs/routes';
import { hasPermission, resolvePagePermission } from '@/lib/rbac';

const authPages = [
  AppRoutes.SignIn,
  AppRoutes.SignUp,
  AppRoutes.ForgotPassword,
  AppRoutes.OTP,
] as const;

const publicPrefixes = ['/errors'];

function isPublicPath(pathname: string) {
  if (authPages.includes(pathname as (typeof authPages)[number])) {
    return true;
  }

  return publicPrefixes.some((prefix) => pathname.startsWith(prefix));
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = Boolean(token);
  const isAuthPage = authPages.includes(pathname as (typeof authPages)[number]);

  if (!isAuthenticated && !isPublicPath(pathname)) {
    const signInUrl = new URL(AppRoutes.SignIn, req.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL(AppRoutes.Dashboard, req.url));
  }

  if (isAuthenticated) {
    const requiredPermission = resolvePagePermission(pathname);
    if (
      requiredPermission &&
      !hasPermission(token?.permissions, requiredPermission)
    ) {
      return NextResponse.redirect(new URL(AppRoutes.Forbidden, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
