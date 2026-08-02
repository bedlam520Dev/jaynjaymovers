-- Supabase database schema for Jay N Jay Movers
-- This schema reflects the current production database state.
-- Run this against a fresh database to initialize the schema.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = TRUE
    )
  );

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- ============================================
-- BOOKINGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  home_size TEXT NOT NULL,
  moving_date DATE NOT NULL,
  time_window TEXT NOT NULL,
  origin_address TEXT NOT NULL,
  destination_address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  estimated_cost DECIMAL(10,2),
  crew_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own bookings" ON public.bookings
  FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = TRUE
    )
  );

-- ============================================
-- TIME SLOTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.time_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time_window TEXT NOT NULL,
  max_bookings INTEGER DEFAULT 4,
  current_bookings INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, time_window)
);

ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view time slots" ON public.time_slots
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage time slots" ON public.time_slots
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = TRUE
    )
  );

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  provider_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Admins can manage all payments" ON public.payments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = TRUE
    )
  );

-- ============================================
-- QUOTE REQUESTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  home_size TEXT NOT NULL,
  moving_date DATE,
  origin_address TEXT NOT NULL,
  destination_address TEXT,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create quote requests" ON public.quote_requests
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users can view their own quotes" ON public.quote_requests
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own quote_requests" ON public.quote_requests
  FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Admins can view all quote_requests" ON public.quote_requests
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND COALESCE(p.is_admin, false) = true
    )
  );

CREATE POLICY "Admins can update all quote_requests" ON public.quote_requests
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND COALESCE(p.is_admin, false) = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND COALESCE(p.is_admin, false) = true
    )
  );

CREATE POLICY "Admin can delete all quote_requests" ON public.quote_requests
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND COALESCE(p.is_admin, false) = true
    )
  );

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT DEFAULT 'internal',
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  external_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage reviews" ON public.reviews
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = TRUE
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to increment slot booking count
CREATE OR REPLACE FUNCTION public.increment_slot_booking(
  slot_date DATE,
  slot_window TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.time_slots
  SET current_bookings = current_bookings + 1
  WHERE date = slot_date AND time_window = slot_window;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to update updated_at columns
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_bookings ON public.bookings;
CREATE TRIGGER set_updated_at_bookings
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_time_slots ON public.time_slots;
CREATE TRIGGER set_updated_at_time_slots
  BEFORE UPDATE ON public.time_slots
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_payments ON public.payments;
CREATE TRIGGER set_updated_at_payments
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_quote_requests ON public.quote_requests;
CREATE TRIGGER set_updated_at_quote_requests
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_reviews ON public.reviews;
CREATE TRIGGER set_updated_at_reviews
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_moving_date ON public.bookings(moving_date);

CREATE INDEX IF NOT EXISTS idx_time_slots_date ON public.time_slots(date);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

CREATE INDEX IF NOT EXISTS idx_quote_requests_user_id ON public.quote_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON public.quote_requests(status);

CREATE INDEX IF NOT EXISTS idx_reviews_source ON public.reviews(source);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- ============================================
-- SEED DATA
-- ============================================
INSERT INTO public.time_slots (date, time_window, max_bookings, current_bookings, is_available)
VALUES
  (CURRENT_DATE + INTERVAL '1 day', '08:00-12:00', 4, 0, TRUE),
  (CURRENT_DATE + INTERVAL '1 day', '12:00-16:00', 4, 0, TRUE),
  (CURRENT_DATE + INTERVAL '1 day', '16:00-20:00', 4, 0, TRUE),
  (CURRENT_DATE + INTERVAL '2 days', '08:00-12:00', 4, 0, TRUE),
  (CURRENT_DATE + INTERVAL '2 days', '12:00-16:00', 4, 0, TRUE),
  (CURRENT_DATE + INTERVAL '2 days', '16:00-20:00', 4, 0, TRUE),
  (CURRENT_DATE + INTERVAL '3 days', '08:00-12:00', 4, 0, TRUE),
  (CURRENT_DATE + INTERVAL '3 days', '12:00-16:00', 4, 0, TRUE),
  (CURRENT_DATE + INTERVAL '3 days', '16:00-20:00', 4, 0, TRUE)
ON CONFLICT (date, time_window) DO NOTHING;
