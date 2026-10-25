import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

interface CookieItem {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieItem[]) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options as any);
        });
      },
    },
  });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isLoginPage = request.nextUrl.pathname === '/admin/login';
    const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

    if (isAdminPath && !isLoginPage && !user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (isLoginPage && user) {
      return NextResponse.redirect(new URL('/admin/packages', request.url));
    }
  } catch {
    return response;
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
