/* ============================================================================
   notify — PASTE-READY for the Supabase dashboard editor.

   ⚠️ This is functions/notify/index.ts with _shared/sign.ts inlined, so it has
   no imports and works in a single-file editor. If you change one, change the
   other; they are the same function twice.

   Deploy as: notify — leave JWT verification ON.
   ============================================================================ */

const BOT = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? '';
const CHAT = Deno.env.get('TELEGRAM_CHAT_ID') ?? '';
const SECRET = Deno.env.get('MODERATION_SECRET') ?? '';
const SB_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const HOURLY_CAP = 12;
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

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

/** Telegram's HTML mode is strict: these break the parser if left raw. */
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function recentCount(): Promise<number> {
  const since = new Date(Date.now() - 3_600_000).toISOString();
  const res = await fetch(`${SB_URL}/rest/v1/notes?select=id&created_at=gte.${since}`, {
    headers: {
      apikey: SERVICE,
      Authorization: `Bearer ${SERVICE}`,
      Prefer: 'count=exact',
      Range: '0-0',
    },
  });
  return Number((res.headers.get('content-range') ?? '*/0').split('/')[1] ?? 0);
}

Deno.serve(async (req) => {
  if (!BOT || !CHAT || !SECRET) {
    console.error('notify: missing TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID or MODERATION_SECRET');
    return new Response('not configured', { status: 500 });
  }

  let note: { id?: string; name?: string; body?: string } | undefined;
  try {
    note = (await req.json())?.record;
  } catch {
    return new Response('bad payload', { status: 400 });
  }
  if (!note?.id || !note.name || !note.body) return new Response('ignored', { status: 200 });

  if ((await recentCount()) > HOURLY_CAP) {
    console.warn(`notify: over ${HOURLY_CAP}/hour, staying quiet`);
    return new Response('capped', { status: 200 });
  }

  const exp = Date.now() + TTL_MS;
  const link = async (a: 'approve' | 'dismiss') =>
    `${SB_URL}/functions/v1/moderate?id=${note!.id}&a=${a}&e=${exp}&t=${await sign(SECRET, note!.id!, a, exp)}`;

  const text =
    `<b>${esc(note.name)}</b> signed the log\n\n` +
    `${esc(note.body)}\n\n` +
    `<i>Held. Nothing is public until you approve it.</i>`;

  const res = await fetch(`https://api.telegram.org/bot${BOT}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✓  Put it up', url: await link('approve') },
            { text: '✕  Dismiss', url: await link('dismiss') },
          ],
        ],
      },
    }),
  });

  if (!res.ok) {
    console.error('notify: telegram rejected the message', res.status, await res.text());
    return new Response('telegram failed', { status: 502 });
  }
  return new Response('sent', { status: 200 });
});
