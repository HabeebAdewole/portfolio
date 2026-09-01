/* ============================================================================
   Signed moderation links.

   The approve and dismiss URLs arrive in a Telegram message and are opened by
   a plain browser tap, so they cannot carry an auth header. That makes the
   signature the only thing standing between a stranger and your board: without
   it, `?id=<uuid>&a=approve` is guessable by anyone who sees the pattern once.

   So each link carries an HMAC-SHA256 over `id:action:expiry`, keyed with a
   secret that lives only in the function's environment. The id is a v4 uuid,
   the action is fixed vocabulary, and the expiry is checked before the
   signature is even compared.
   ============================================================================ */

const enc = new TextEncoder();

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ]);
}

function b64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export type Action = 'approve' | 'dismiss';

export async function sign(secret: string, id: string, action: Action, exp: number): Promise<string> {
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${id}:${action}:${exp}`));
  return b64url(sig);
}

/**
 * Compares in constant time. A fast-exit compare leaks how much of a forged
 * signature was right, which is enough to reconstruct one a byte at a time.
 */
export async function valid(
  secret: string,
  id: string,
  action: Action,
  exp: number,
  token: string,
): Promise<boolean> {
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = await sign(secret, id, action, exp);
  if (expected.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}

/** Seven days. Long enough to catch a note you saw on a bad week. */
export const TTL_MS = 7 * 24 * 60 * 60 * 1000;
