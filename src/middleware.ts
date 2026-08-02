import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const publicPaths = [
  '/',
  '/home',
  '/api/coming-soon',
  '/auth/login',
  '/auth/sign-up',
  '/auth/forgot-password',
  '/auth/update-password',
  '/auth/confirm',
  '/auth/oauth',
  '/auth/error',
  '/auth/sign-up-success',
  '/services',
  '/about',
  '/contact',
  '/quote',
  '/reviews',
  '/faq',
  '/terms',
  '/privacy',
  '/data-policy',
  '/refund-policy',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.webmanifest',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicPath = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
  const isStaticAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/img/') ||
    pathname === '/favicon.ico';

  if (isStaticAsset) {
    return supabaseResponse;
  }

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  if (user && pathname.startsWith('/admin-dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile?.is_admin) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
