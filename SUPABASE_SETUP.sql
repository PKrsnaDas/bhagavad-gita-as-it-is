-- ── Flowcharts (public read, open write — password gate is in the frontend) ──
create table if not exists public.chapter_flowcharts (
  chapter_id  integer primary key,
  nodes       jsonb not null default '[]',
  edges       jsonb not null default '[]',
  updated_at  timestamptz not null default now()
);

alter table public.chapter_flowcharts enable row level security;

create policy "flowcharts_public_read"
  on public.chapter_flowcharts
  for select using (true);

create policy "flowcharts_public_write"
  on public.chapter_flowcharts
  for all using (true) with check (true);

-- ── Custom chapters (user-created) ──────────────────────────────────────────
create table if not exists public.custom_chapters (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sanskrit    text default '',
  english     text default '',
  theme       text default '',
  summary     text default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.custom_chapters enable row level security;

create policy "custom_chapters_public_read"
  on public.custom_chapters for select using (true);

create policy "custom_chapters_public_write"
  on public.custom_chapters for all using (true) with check (true);

-- ── Chapter content overrides (inline editing) ───────────────────────────────
create table if not exists public.chapter_content (
  chapter_id  integer primary key,
  data        jsonb not null default '{}',
  updated_at  timestamptz not null default now()
);

alter table public.chapter_content enable row level security;

create policy "chapter_content_public_read"
  on public.chapter_content
  for select using (true);

create policy "chapter_content_public_write"
  on public.chapter_content
  for all using (true) with check (true);

-- ── Notes ────────────────────────────────────────────────────────────────────
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
