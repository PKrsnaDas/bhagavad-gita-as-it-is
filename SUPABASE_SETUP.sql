create table if not exists public.chapter_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id integer not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, chapter_id)
);

create table if not exists public.verse_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id integer not null,
  verse_number integer not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, chapter_id, verse_number)
);

alter table public.chapter_notes enable row level security;
alter table public.verse_notes enable row level security;

create policy "users_can_select_own_chapter_notes"
  on public.chapter_notes
  for select
  using (auth.uid() = user_id);

create policy "users_can_insert_own_chapter_notes"
  on public.chapter_notes
  for insert
  with check (auth.uid() = user_id);

create policy "users_can_update_own_chapter_notes"
  on public.chapter_notes
  for update
  using (auth.uid() = user_id);

create policy "users_can_select_own_verse_notes"
  on public.verse_notes
  for select
  using (auth.uid() = user_id);

create policy "users_can_insert_own_verse_notes"
  on public.verse_notes
  for insert
  with check (auth.uid() = user_id);

create policy "users_can_update_own_verse_notes"
  on public.verse_notes
  for update
  using (auth.uid() = user_id);
