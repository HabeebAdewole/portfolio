-- ============================================================================
-- Telegram moderation — schema half.
--
-- Run this in the Supabase SQL editor AFTER notes.sql. The other half is two
-- edge functions and one webhook; see supabase/README.md.
-- ============================================================================

-- Dismiss is not delete. A note you turned down stays in the table so you can
-- change your mind, and so there is a record of what was actually said.
alter table public.notes
  add column if not exists dismissed boolean not null default false;

-- Reading the pending queue is a common enough thing to have a name for it.
-- It is a view over your own rows; anon cannot see it, because anon cannot see
-- unapproved rows in the first place.
create or replace view public.notes_pending as
  select id, name, body, created_at
  from public.notes
  where not approved and not dismissed
  order by created_at desc;

-- ---------------------------------------------------------------------------
-- ⚠️ The webhook is NOT created here on purpose.
--
-- Supabase's Database Webhooks store the service_role key in the trigger
-- definition. Writing that as SQL in this repo would commit the one key that
-- bypasses every policy — the exact thing .env.example was just cleaned up for.
-- Create it in the dashboard instead, where the key stays server-side:
--
--   Database → Webhooks → Create a new hook
--     Name       notes_notify
--     Table      public.notes
--     Events     Insert
--     Type       Supabase Edge Functions
--     Function   notify
--     Headers    Authorization: Bearer <service_role key>
--
-- ---------------------------------------------------------------------------

-- Handy while setting up — what is waiting on you right now:
--   select * from public.notes_pending;
