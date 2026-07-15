/*
# Auto-create profile on signup

## Overview
Adds a trigger that creates a `profiles` row whenever a new user signs up via
Supabase Auth. The profile inherits `full_name` from the signup metadata if present.

## Changes
- `handle_new_user()` trigger function: inserts a profile row for the new auth.users row.
- `on_auth_user_created` trigger: fires AFTER INSERT on auth.users.
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
