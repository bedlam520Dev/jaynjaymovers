const SITE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstileToken(
  token: string | undefined | null
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET;

  if (!token || !secret) return false;

  try {
    const res = await fetch(SITE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }).toString(),
    });

    if (!res.ok) return false;

    const body: unknown = await res.json();
    if (typeof body !== 'object' || body === null || !('success' in body)) {
      return false;
    }
    return body.success === true;
  } catch {
    return false;
  }
}
