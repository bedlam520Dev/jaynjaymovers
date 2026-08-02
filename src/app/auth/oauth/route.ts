import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const isPopup = searchParams.get('popup') === 'true';

  let next = searchParams.get('next') ?? '/';
  if (!next.startsWith('/')) {
    next = '/';
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (isPopup) {
        return new Response(
          `<html><body><script>
            window.opener?.postMessage({ type: 'supabase-auth', event: 'SIGNED_IN' }, '${origin}');
            window.close();
          </script></body></html>`,
          { headers: { 'content-type': 'text/html' } }
        );
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  if (isPopup) {
    return new Response(
      `<html><body><script>
        window.opener?.postMessage({ type: 'supabase-auth', event: 'SIGNED_IN_FAILED' }, '${origin}');
        window.close();
      </script></body></html>`,
      { headers: { 'content-type': 'text/html' } }
    );
  }

  return NextResponse.redirect(`${origin}/auth/error`);
}
