-- Add email column if it doesn't exist (Migration)
alter table profiles add column if not exists email text;

-- Ensure RLS is enabled
alter table profiles enable row level security;

-- Re-create policies to safely update them
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on profiles;
create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);
