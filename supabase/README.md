# Section 05 — the Log

Visitor notes with Telegram moderation. A note arrives, the bot messages you the
full text with two buttons, you tap one. The Supabase dashboard is never part of
the daily loop.

```
visitor signs  →  notes (approved = false)  →  webhook  →  notify  →  Telegram
                                                                        │
                     board shows it  ←  moderate  ←  you tap a button  ─┘
```

## What is already done

`notes.sql` is applied and the site is live. Anyone can insert an unapproved
row, only approved rows are readable, and there is no update or delete policy
for `anon` at all.

## Setting up the bot

**1 — make the bot.** In Telegram, message [@BotFather](https://t.me/BotFather),
send `/newbot`, follow the prompts. It gives you a token like
`8123456789:AAH...`. That token is a password: it goes in Supabase secrets, not
in this repo.

**2 — get your chat id.** Send your new bot any message first (it cannot message
you until you do), then open:

```
https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
```

Read `result[0].message.chat.id` — a number, possibly negative. That is
`TELEGRAM_CHAT_ID`.

**3 — schema.** Run `moderation.sql` in the SQL editor. Adds `dismissed` and a
`notes_pending` view.

**4 — secrets.** Generate a signing secret and set all three:

```bash
openssl rand -base64 32
```

```bash
supabase login
supabase link --project-ref qmwwypruaidzsxgrezsh
supabase secrets set TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... MODERATION_SECRET=...
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically — do
not set those yourself.

**5 — deploy.** The flags matter:

```bash
supabase functions deploy notify
```

```bash
supabase functions deploy moderate --no-verify-jwt
```

`notify` keeps its JWT check, because the webhook sends the service_role key and
nobody else should be able to make your phone buzz. `moderate` cannot have one —
it is opened by tapping a link, which carries no auth header — so it is
protected by the HMAC in the URL instead.

**6 — the webhook.** Dashboard → Database → Webhooks → Create a new hook:

| Field | Value |
|---|---|
| Name | `notes_notify` |
| Table | `public.notes` |
| Events | Insert |
| Type | Supabase Edge Functions |
| Function | `notify` |
| Headers | `Authorization: Bearer <service_role key>` |

## Trying it

Sign the log at [adebola.me](https://adebola.me/#log). The bot should message you
within a second or two. Tap **Put it up**, reload, and the note is on the board.

If nothing arrives: Dashboard → Edge Functions → `notify` → Logs. The usual
causes are a missing `Authorization` header on the webhook, or having never sent
the bot a first message in step 2.

## Notes on the design

- **Dismiss does not delete.** It sets `dismissed`, so you can change your mind
  and the record of what was said survives.
- **Links expire after seven days** and are signed with `MODERATION_SECRET`. An
  unsigned `?id=…&a=approve` would be guessable by anyone who saw the pattern
  once, which would hand your board to a stranger.
- **Notifications stop above 12 an hour.** A spam run should not bury your
  inbox; the queue is still there via `select * from notes_pending`.
- **Rotating `MODERATION_SECRET` invalidates every outstanding link.** That is
  the fix if one ever leaks.

## Turning it all off

Delete the two GitHub repository secrets and push. The section stops rendering
and the site returns to exactly what it was before the Log existed. The table
and its notes are untouched.
