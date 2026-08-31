-- ============================================================================
-- Section 05 — the Log.
--
-- Run this once in the Supabase SQL editor. It creates the table, locks it
-- down, and leaves you as the only person who can see or approve anything.
--
-- The security model in one line: anyone may INSERT, nobody anonymous may
-- SELECT a row that is not approved. That is enforced here, in the database —
-- not in the React app — which is why it still holds even though the front end
-- is public, static, and ships the anon key in its bundle.
-- ============================================================================

create table if not exists public.notes (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  body        text        not null,
  created_at  timestamptz not null default now(),
  approved    boolean     not null default false,

  -- Length is capped here as well as in the form. The form can be bypassed;
  -- this cannot. Trimmed length, so whitespace padding does not buy anything.
  constraint name_len check (char_length(btrim(name)) between 1 and 40),
  constraint body_len check (char_length(btrim(body)) between 1 and 280)
);

-- The board reads newest-approved-first, so index exactly that.
create index if not exists notes_approved_created_idx
  on public.notes (created_at desc)
  where approved;

alter table public.notes enable row level security;

-- ---------------------------------------------------------------------------
-- Policies. Note there is deliberately no UPDATE or DELETE policy for anon:
-- with RLS on, an operation with no policy is simply denied. A visitor cannot
-- edit or remove a note, including their own — approving is yours alone.
-- ---------------------------------------------------------------------------

drop policy if exists "anyone signs" on public.notes;
create policy "anyone signs"
  on public.notes for insert
  to anon
  with check (
    -- A visitor may never set this. Without the check, anyone could POST
    -- {"approved": true} and publish straight to the board.
    approved = false
  );

drop policy if exists "read approved" on public.notes;
create policy "read approved"
  on public.notes for select
  to anon
  using (approved = true);

-- ---------------------------------------------------------------------------
-- Approving, from the Supabase dashboard:
--   Table editor → notes → flip `approved` to true on the row.
-- It appears on the board on the next page load. To take one down, flip it
-- back rather than deleting, so you keep the record of what was said.
--
-- To see what is waiting:
--   select name, body, created_at from public.notes
--   where not approved order by created_at desc;
-- ---------------------------------------------------------------------------
