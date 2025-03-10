
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

type WishlistItem = {
  id: string;
  product_id: string;
  user_id: string;
  created_at: string;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    category: string;
    seller: {
      username: string;
      avatar_url: string;
    };
  };
};

interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  fetchWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      
      fetchWishlist: async () => {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) {
          set({ error: "User not authenticated" });
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          // Use a raw SQL query to fetch the data since 'wishlists' is not in the types
          const { data, error } = await supabase.rpc('get_user_wishlist', {
            user_id_param: user.id
          });
            
          if (error) throw error;
          
          // Transform the data to match our expected format
          const wishlistItems = data as WishlistItem[] || [];
          set({ items: wishlistItems, isLoading: false });
        } catch (error: any) {
          console.error('Error fetching wishlist:', error);
          set({ error: error.message, isLoading: false });
        }
      },
      
      addToWishlist: async (productId: string) => {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) {
          set({ error: "User not authenticated" });
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          // Check if already in wishlist
          if (get().isInWishlist(productId)) {
            set({ isLoading: false });
            return;
          }
          
          // Use a raw SQL query to insert since 'wishlists' is not in the types
          const { error } = await supabase.rpc('add_to_wishlist', {
            user_id_param: user.id,
            product_id_param: productId
          });
            
          if (error) throw error;
          
          // Refetch wishlist to get updated data
          await get().fetchWishlist();
        } catch (error: any) {
          console.error('Error adding to wishlist:', error);
          set({ error: error.message, isLoading: false });
        }
      },
      
      removeFromWishlist: async (productId: string) => {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) {
          set({ error: "User not authenticated" });
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          // Use a raw SQL query to delete since 'wishlists' is not in the types
          const { error } = await supabase.rpc('remove_from_wishlist', {
            user_id_param: user.id,
            product_id_param: productId
          });
            
          if (error) throw error;
          
          // Update local state
          set({
            items: get().items.filter(item => item.product_id !== productId),
            isLoading: false
          });
        } catch (error: any) {
          console.error('Error removing from wishlist:', error);
          set({ error: error.message, isLoading: false });
        }
      },
      
      isInWishlist: (productId: string) => {
        return get().items.some(item => item.product_id === productId);
      }
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
