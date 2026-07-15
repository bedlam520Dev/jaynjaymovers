/*
# Expand payment methods and review sources

## Overview
Updates the `payments` table CHECK constraint to support all requested payment methods
(Stripe, PayPal/Venmo, CashApp Pay, Google Pay, Apple Pay, Zelle, crypto via Stripe, cash, check).
Also adds `avatar_url` to `reviews` and expands the `source` CHECK to include `trustadvisor`.

## Changes
1. `payments` table — drop and recreate the `method` CHECK constraint to include:
   stripe, paypal, cashapp, googlepay, applepay, zelle, crypto, cash, check
2. `reviews` table — add `avatar_url` column (nullable text) if not present
3. `reviews` table — drop and recreate the `source` CHECK constraint to include `trustadvisor`

## Security
No RLS policy changes — existing policies remain in effect.
*/

-- 1. Expand payments method CHECK constraint
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_method_check;
ALTER TABLE payments ADD CONSTRAINT payments_method_check
  CHECK (method IN ('stripe','paypal','cashapp','googlepay','applepay','zelle','crypto','cash','check'));

-- 2. Add avatar_url to reviews if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE reviews ADD COLUMN avatar_url text;
  END IF;
END $$;

-- 3. Expand reviews source CHECK to include trustadvisor
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_source_check;
ALTER TABLE reviews ADD CONSTRAINT reviews_source_check
  CHECK (source IN ('google','yelp','trustadvisor','internal'));
