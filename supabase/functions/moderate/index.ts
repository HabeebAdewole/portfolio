import { type Action, valid } from '../_shared/sign.ts';

/* ============================================================================
   moderate — the Approve / Dismiss buttons land here.

   ⚠️ Deploy this one with --no-verify-jwt. It is opened by tapping a link in
   Telegram, so there is no Authorization header to check. The HMAC in the URL
   is what authorises it, and it is verified before anything is written.

   Dismiss does not delete. It sets `dismissed`, so a note you turned down is
   still there if you change your mind — the same reasoning as flipping
   `approved` back rather than deleting a row.
   ============================================================================ */

const SECRET = Deno.env.get('MODERATION_SECRET') ?? '';
const SB_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

function page(title: string, detail: string, ok: boolean): Response {
  /* Rendered in whatever browser Telegram opens, so it stands alone: no
     external CSS, no fonts to fetch, and it reads in either colour scheme. */
  const html = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
  :root{color-scheme:light dark}
  body{margin:0;min-height:100vh;display:grid;place-items:center;
       background:Canvas;color:CanvasText;
       font:16px/1.6 ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}
  main{max-width:34ch;padding:32px 26px;text-align:center}
  h1{margin:0 0 8px;font-size:1.35rem;font-weight:600;
     color:${ok ? '#1f7a3d' : '#8a3f12'}}
  p{margin:0;opacity:.72;font-size:.95rem}
  code{font-family:ui-monospace,Consolas,monospace;font-size:.85em}
</style></head><body><main>
<h1>${title}</h1><p>${detail}</p></main></body></html>`;
  return new Response(html, {
    status: ok ? 200 : 400,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

Deno.serve(async (req) => {
  if (!SECRET) return page('Not configured', 'MODERATION_SECRET is missing.', false);

  const u = new URL(req.url);
  const id = u.searchParams.get('id') ?? '';
  const a = u.searchParams.get('a') ?? '';
  const exp = Number(u.searchParams.get('e') ?? '0');
  const token = u.searchParams.get('t') ?? '';

  if (a !== 'approve' && a !== 'dismiss') return page('Unknown action', 'That link is malformed.', false);
  const action = a as Action;

  if (!(await valid(SECRET, id, action, exp, token))) {
    /* One message for a bad signature and for an expired link on purpose:
       telling an attacker which one they got wrong is free information. */
    return page('Link not valid', 'It has expired, or it was not signed by this bot.', false);
  }

  const patch =
    action === 'approve' ? { approved: true, dismissed: false } : { approved: false, dismissed: true };

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
    return page('That did not save', 'Supabase refused the update. Try again shortly.', false);
  }

  const rows = (await res.json()) as unknown[];
  if (rows.length === 0) return page('Already gone', 'That note is no longer in the table.', false);

  return action === 'approve'
    ? page('Put up', 'It is on the board now. Reload adebola.me to see it.', true)
    : page('Dismissed', 'It stays off the board. Nothing was deleted.', true);
});
