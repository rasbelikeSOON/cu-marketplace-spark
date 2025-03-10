
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  title: string;
  price: number;
  images: any; // Using any here as the images can be in different formats
  category: string;
  seller?: {
    username: string;
    avatar_url: string;
  };
}

export interface WishlistItem {
  id: string;
  product_id: string;
  user_id: string;
  created_at: string;
  product: Product;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,
  
  isInWishlist: (productId: string) => {
    return get().items.some(item => item.product_id === productId);
  },
  
  fetchWishlist: async () => {
    const { user } = await supabase.auth.getUser();
    if (!user.data) return;
    
    try {
      set({ isLoading: true });
      
      // Use the RPC function to get the wishlist
      const { data, error } = await supabase.rpc('get_user_wishlist', {
        user_id_param: user.data.id
      });
      
      if (error) throw error;
      
      set({ 
        items: data as WishlistItem[], 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      set({ isLoading: false });
    }
  },
  
  addToWishlist: async (productId: string) => {
    const { user } = await supabase.auth.getUser();
    if (!user.data) return;
    
    try {
      // Use the RPC function to add to wishlist
      const { error } = await supabase.rpc('add_to_wishlist', {
        user_id_param: user.data.id,
        product_id_param: productId
      });
      
      if (error) throw error;
      
      // Refresh the wishlist
      await get().fetchWishlist();
      
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  },
  
  removeFromWishlist: async (productId: string) => {
    const { user } = await supabase.auth.getUser();
    if (!user.data) return;
    
    try {
      // Use the RPC function to remove from wishlist
      const { error } = await supabase.rpc('remove_from_wishlist', {
        user_id_param: user.data.id,
        product_id_param: productId
      });
      
      if (error) throw error;
      
      // Refresh the wishlist
      await get().fetchWishlist();
      
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  }
}));
