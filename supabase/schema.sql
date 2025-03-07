
-- Add telegram_id column to profiles table if it doesn't exist
ALTER TABLE IF EXISTS public.profiles
ADD COLUMN IF NOT EXISTS telegram_id TEXT;

-- Create an index on telegram_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_telegram_id
ON public.profiles(telegram_id);

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  email_order_updates BOOLEAN NOT NULL DEFAULT TRUE,
  email_marketing BOOLEAN NOT NULL DEFAULT FALSE,
  push_order_updates BOOLEAN NOT NULL DEFAULT TRUE,
  push_chat_messages BOOLEAN NOT NULL DEFAULT TRUE,
  push_marketing BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Add RLS policies to notification_preferences table
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view their own notification preferences
CREATE POLICY "Users can view their own notification preferences"
ON public.notification_preferences
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own notification preferences
CREATE POLICY "Users can insert their own notification preferences"
ON public.notification_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own notification preferences
CREATE POLICY "Users can update their own notification preferences"
ON public.notification_preferences
FOR UPDATE
USING (auth.uid() = user_id);
