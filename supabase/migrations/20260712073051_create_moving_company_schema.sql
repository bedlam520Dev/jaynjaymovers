/*
# Moving Company Platform — Core Schema

## Overview
Creates the full data layer for a moving company customer-facing app + CRM.
Supports authenticated customer accounts (CRM sign-ups), booking scheduling,
quote requests, and aggregated reviews from Google, Yelp, and internal sources.

## New Tables
1. `profiles` — extends auth.users with customer info (full name, phone, admin flag)
2. `bookings` — confirmed moving jobs tied to a customer, with date/time, addresses, status, cost estimate
3. `quote_requests` — pre-booking lead capture; may convert into a booking
4. `reviews` — aggregated reviews from Google, Yelp, and in-app; shown on landing page

## Security (RLS)
- `profiles`: owner-scoped. Admins read all.
- `bookings`: owner-scoped CRUD for customers; admins manage all.
- `quote_requests`: owner-scoped read; anon can insert (lead capture without login).
- `reviews`: public read; admins manage via service role / edge functions.

## Notes
1. `user_id` columns default to `auth.uid()` so frontend inserts that omit user_id satisfy WITH CHECK.
2. The `is_admin()` helper is created right after `profiles` so subsequent policies can use it.
3. `quote_requests` allows anon INSERT so the public quote form works before sign-up.
*/

-- ---------- profiles ----------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  avatar_url text,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- helper: is current user an admin? (created before any policy uses it) ----------
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = uid),
    false
  );
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_insert_self" ON public.profiles;
CREATE POLICY "profiles_insert_self"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ---------- bookings ----------
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type text NOT NULL DEFAULT 'residential'
    CHECK (service_type IN ('residential','commercial','long_distance','packing','storage','specialty')),
  home_size text NOT NULL DEFAULT '2br'
    CHECK (home_size IN ('studio','1br','2br','3br','4br_plus','office','custom')),
  moving_date date NOT NULL,
  time_window text NOT NULL DEFAULT '08:00-12:00',
  origin_address text NOT NULL,
  destination_address text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','in_progress','completed','cancelled')),
  estimated_cost numeric(10,2),
  crew_size integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bookings_select_own_or_admin" ON public.bookings;
CREATE POLICY "bookings_select_own_or_admin"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "bookings_insert_own" ON public.bookings;
CREATE POLICY "bookings_insert_own"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "bookings_update_own_or_admin" ON public.bookings;
CREATE POLICY "bookings_update_own_or_admin"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "bookings_delete_own_or_admin" ON public.bookings;
CREATE POLICY "bookings_delete_own_or_admin"
  ON public.bookings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_moving_date_idx ON public.bookings(moving_date);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON public.bookings(status);

-- ---------- quote_requests ----------
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  service_type text NOT NULL DEFAULT 'residential'
    CHECK (service_type IN ('residential','commercial','long_distance','packing','storage','specialty')),
  home_size text NOT NULL DEFAULT '2br'
    CHECK (home_size IN ('studio','1br','2br','3br','4br_plus','office','custom')),
  moving_date date,
  origin_address text NOT NULL,
  destination_address text NOT NULL,
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','responded','converted','archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quotes_insert_public" ON public.quote_requests;
CREATE POLICY "quotes_insert_public"
  ON public.quote_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "quotes_select_own_or_admin" ON public.quote_requests;
CREATE POLICY "quotes_select_own_or_admin"
  ON public.quote_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "quotes_update_own_or_admin" ON public.quote_requests;
CREATE POLICY "quotes_update_own_or_admin"
  ON public.quote_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "quotes_delete_own_or_admin" ON public.quote_requests;
CREATE POLICY "quotes_delete_own_or_admin"
  ON public.quote_requests FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

CREATE INDEX IF NOT EXISTS quotes_user_id_idx ON public.quote_requests(user_id);
CREATE INDEX IF NOT EXISTS quotes_status_idx ON public.quote_requests(status);
CREATE INDEX IF NOT EXISTS quotes_created_at_idx ON public.quote_requests(created_at DESC);

-- ---------- reviews ----------
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL CHECK (source IN ('google','yelp','internal')),
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text text NOT NULL,
  external_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_select_public" ON public.reviews;
CREATE POLICY "reviews_select_public"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "reviews_insert_admin" ON public.reviews;
CREATE POLICY "reviews_insert_admin"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "reviews_update_admin" ON public.reviews;
CREATE POLICY "reviews_update_admin"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "reviews_delete_admin" ON public.reviews;
CREATE POLICY "reviews_delete_admin"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (public.is_admin());

CREATE INDEX IF NOT EXISTS reviews_source_idx ON public.reviews(source);
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON public.reviews(created_at DESC);

-- ---------- seed sample reviews ----------
INSERT INTO public.reviews (source, author_name, rating, text, external_url)
VALUES
  ('internal', 'Sarah M.', 5, 'The crew was on time, professional, and treated our furniture like their own. Best moving experience we''ve had!', NULL),
  ('internal', 'David K.', 5, 'Packed and moved our 3-bedroom house in one day. Not a single item damaged. Highly recommend.', NULL),
  ('internal', 'The Pattersons', 4, 'Great long-distance move from the city to the suburbs. Fair pricing and no hidden fees.', NULL),
  ('internal', 'Maria L.', 5, 'The office move was seamless. They worked around our schedule and minimized downtime.', NULL)
ON CONFLICT DO NOTHING;
