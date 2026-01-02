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

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, updated_at)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'username',
    now()
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RPC Function to safely update assessment results
create or replace function public.update_assessment_results(
  p_scores jsonb,
  p_level int
)
returns void as $$
begin
  update public.profiles
  set 
    scores = p_scores,
    level = p_level,
    updated_at = now()
  where id = auth.uid();
end;
$$ language plpgsql security definer;
