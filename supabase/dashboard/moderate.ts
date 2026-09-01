/* ============================================================================
   moderate — PASTE-READY for the Supabase dashboard editor.

   ⚠️ This is functions/moderate/index.ts with _shared/sign.ts inlined, so it has
   no imports and works in a single-file editor. If you change one, change the
   other; they are the same function twice.

   ⚠️ Deploy as: moderate — and turn JWT verification OFF for this one.
   It is opened by tapping a link in Telegram, which carries no auth header, so
   a JWT check makes every button fail. The HMAC in the URL authorises it.
   ============================================================================ */

const SECRET = Deno.env.get('MODERATION_SECRET') ?? '';
const SB_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const enc = new TextEncoder();

function b64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function sign(secret: string, id: string, action: string, exp: number): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(`${id}:${action}:${exp}`)));
}

/** Constant time. A fast-exit compare leaks how much of a forged signature was
    right, which is enough to rebuild one a byte at a time. */
async function valid(
  secret: string,
  id: string,
  action: string,
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

const SITE = Deno.env.get('SITE_URL') ?? 'https://adebola.me';

/* The Supabase functions gateway rewrites Content-Type to text/plain and sends
   nosniff with it, so an HTML body from here renders as source rather than as a
   page. Redirect to a static page on the site instead: it gets served with a
   real content type, and it arrives in the site's own type and colours.

   `r` selects one of a fixed set of messages on that page. It never carries
   text to display — reflecting a URL parameter into the DOM would be an XSS
   hole for the sake of a status line. */
function done(outcome: 'approved' | 'dismissed' | 'invalid' | 'gone' | 'error'): Response {
  return Response.redirect(`${SITE}/moderated.html?r=${outcome}`, 302);
}

Deno.serve(async (req) => {
  if (!SECRET) return done('error');

  const u = new URL(req.url);
  const id = u.searchParams.get('id') ?? '';
  const a = u.searchParams.get('a') ?? '';
  const exp = Number(u.searchParams.get('e') ?? '0');
  const token = u.searchParams.get('t') ?? '';

  if (a !== 'approve' && a !== 'dismiss') return done('invalid');

  if (!(await valid(SECRET, id, a, exp, token))) {
    /* One message for a bad signature and for an expired link on purpose:
       telling an attacker which they got wrong is free information. */
    return done('invalid');
  }

  const patch =
    a === 'approve' ? { approved: true, dismissed: false } : { approved: false, dismissed: true };

  const res = await fetch(`${SB_URL}/rest/v1/notes?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      apikey: SERVICE,
      Authorization: `Bearer ${SERVICE}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(patch),
  });

  if (!res.ok) {
    console.error('moderate: patch failed', res.status, await res.text());
    return done('error');
  }

  const rows = (await res.json()) as unknown[];
  if (rows.length === 0) return done('gone');

  return done(a === 'approve' ? 'approved' : 'dismissed');
});
