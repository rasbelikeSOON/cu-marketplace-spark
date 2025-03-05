
-- Add telegram_id column to profiles table if it doesn't exist
ALTER TABLE IF EXISTS public.profiles
ADD COLUMN IF NOT EXISTS telegram_id TEXT;

-- Create an index on telegram_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_telegram_id
ON public.profiles(telegram_id);
