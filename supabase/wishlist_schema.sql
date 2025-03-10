
-- Create wishlists table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Add RLS policies to wishlists table
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Users can view their own wishlist items
CREATE POLICY "Users can view their own wishlist items"
ON public.wishlists
FOR SELECT
USING (auth.uid() = user_id);

-- Users can add items to their own wishlist
CREATE POLICY "Users can add items to their own wishlist"
ON public.wishlists
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete items from their own wishlist
CREATE POLICY "Users can delete items from their own wishlist"
ON public.wishlists
FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id
ON public.wishlists(user_id);

CREATE INDEX IF NOT EXISTS idx_wishlists_product_id
ON public.wishlists(product_id);
