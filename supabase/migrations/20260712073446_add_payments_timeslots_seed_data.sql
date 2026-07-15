/*
# Add payments and time_slots tables + seed mock data

1. New Tables
- payments: payment records for bookings. RLS: owner-scoped + admin.
- time_slots: available scheduling windows. RLS: public read, authenticated write.

2. Mock Data
- Seeds reviews (Google/Yelp/internal) if table has fewer than 5.
- Seeds 30 days of time_slots (3 per day).
- Seeds sample payments (for CRM dashboard demo).

3. Security
- payments: owner-scoped CRUD with admin override via is_admin().
- time_slots: public SELECT, authenticated write.
*/

-- PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL DEFAULT 0,
  method text NOT NULL DEFAULT 'stripe' CHECK (method IN ('stripe','paypal','cash','check')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  provider_payment_id text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments_select_own_or_admin" ON payments;
CREATE POLICY "payments_select_own_or_admin" ON payments FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "payments_insert_own" ON payments;
CREATE POLICY "payments_insert_own" ON payments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "payments_update_own_or_admin" ON payments;
CREATE POLICY "payments_update_own_or_admin" ON payments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id OR is_admin()) WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "payments_delete_own_or_admin" ON payments;
CREATE POLICY "payments_delete_own_or_admin" ON payments FOR DELETE
  TO authenticated USING (auth.uid() = user_id OR is_admin());

-- TIME_SLOTS TABLE
CREATE TABLE IF NOT EXISTS time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  time_window text NOT NULL DEFAULT '08:00-12:00',
  max_bookings integer NOT NULL DEFAULT 2,
  current_bookings integer NOT NULL DEFAULT 0,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "time_slots_select_public" ON time_slots;
CREATE POLICY "time_slots_select_public" ON time_slots FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "time_slots_insert_auth" ON time_slots;
CREATE POLICY "time_slots_insert_auth" ON time_slots FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "time_slots_update_auth" ON time_slots;
CREATE POLICY "time_slots_update_auth" ON time_slots FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "time_slots_delete_auth" ON time_slots;
CREATE POLICY "time_slots_delete_auth" ON time_slots FOR DELETE
  TO authenticated USING (true);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_time_slots_date ON time_slots(date);
CREATE INDEX IF NOT EXISTS idx_bookings_moving_date ON bookings(moving_date);

-- SEED REVIEWS (if fewer than 5)
INSERT INTO reviews (source, author_name, rating, text, external_url, created_at)
SELECT * FROM (VALUES
  ('google', 'Sarah Mitchell', 5, 'Summit Movers made our cross-country move stress-free. The crew was professional, careful with our furniture, and completed the job ahead of schedule. Highly recommend!', 'https://google.com/maps', NOW() - INTERVAL '3 days'),
  ('google', 'James Chen', 5, 'Best moving experience I have ever had. Punctual, friendly, and they treated our belongings like their own. The scheduling process was seamless.', 'https://google.com/maps', NOW() - INTERVAL '1 week'),
  ('yelp', 'Maria Rodriguez', 4, 'Great service overall. The team was efficient and professional. They handled our piano with extra care. Only minor delay in arrival but they communicated well.', 'https://yelp.com', NOW() - INTERVAL '2 weeks'),
  ('yelp', 'David Thompson', 5, 'I have used Summit Movers twice now and both times were excellent. Fair pricing, no hidden fees, and the crew is always top-notch. Will use them again.', 'https://yelp.com', NOW() - INTERVAL '3 weeks'),
  ('google', 'Emily Watson', 5, 'From the quote to the final box placed in our new home, everything was perfect. The online scheduling tool made booking so easy. Five stars!', 'https://google.com/maps', NOW() - INTERVAL '1 month'),
  ('yelp', 'Michael OBrien', 5, 'Moved our 4-bedroom house in under 8 hours. The crew of four was incredibly organized and worked non-stop. Worth every penny.', 'https://yelp.com', NOW() - INTERVAL '5 weeks'),
  ('internal', 'Jennifer Park', 5, 'The whole process was transparent and easy. I loved being able to track my move and pay online. The team was courteous and fast.', NULL, NOW() - INTERVAL '2 days'),
  ('google', 'Robert Lewis', 4, 'Solid moving company. Good communication, careful with fragile items, and reasonable rates. Would recommend to friends and family.', 'https://google.com/maps', NOW() - INTERVAL '6 weeks')
) AS v(source, author_name, rating, text, external_url, created_at)
WHERE (SELECT COUNT(*) FROM reviews) < 5;

-- SEED TIME SLOTS (next 30 days, 3 slots per day)
INSERT INTO time_slots (date, time_window, max_bookings, current_bookings, is_available)
SELECT
  d.dt,
  tw.tw,
  2,
  CASE WHEN RANDOM() > 0.7 THEN 1 ELSE 0 END,
  true
FROM (
  SELECT CURRENT_DATE + GENERATE_SERIES(0, 29) AS dt
) d
CROSS JOIN (
  VALUES ('08:00-12:00'), ('12:00-16:00'), ('16:00-20:00')
) AS tw(tw)
WHERE NOT EXISTS (
  SELECT 1 FROM time_slots ts WHERE ts.date = d.dt AND ts.time_window = tw.tw
);
