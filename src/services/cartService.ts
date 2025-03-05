
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Interface for cart items
export interface CartItem {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  product?: {
    id: string;
    title: string;
    price: number;
    images: string[];
    seller?: {
      username: string;
    };
  };
}

export const cartService = {
  // Get user's cart
  getUserCart: async (): Promise<CartItem[]> => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");
      
      // Get cart items with product details using a join approach
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // If we have cart items, fetch product details for each
      if (data && data.length > 0) {
        const cartItems = await Promise.all(
          data.map(async (item) => {
            // Get product details
            const { data: productData, error: productError } = await supabase
              .from('products')
              .select(`
                id, 
                title, 
                price, 
                images,
                seller:profiles(username)
              `)
              .eq('id', item.product_id)
              .single();
            
            if (productError) {
              console.error("Error fetching product details:", productError);
              return item as CartItem;
            }
            
            return {
              ...item,
              product: productData
            } as CartItem;
          })
        );
        
        return cartItems;
      }
      
      return data as CartItem[];
    } catch (error) {
      console.error("Error getting cart:", error);
      toast.error("Failed to load cart");
      return [];
    }
  },
  
  // Add item to cart
  addToCart: async (productId: string, quantity: number = 1): Promise<void> => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");
      
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();
      
      if (existingItem) {
        // Update quantity if item exists
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);
        
        if (error) throw error;
        toast.success("Cart updated successfully");
      } else {
        // Add new item if it doesn't exist
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity
          });
        
        if (error) throw error;
        toast.success("Item added to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  },
  
  // Update cart item quantity
  updateCartItemQuantity: async (itemId: string, quantity: number): Promise<void> => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      toast.success("Cart updated successfully");
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    }
  },
  
  // Remove item from cart
  removeFromCart: async (itemId: string): Promise<void> => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  },
  
  // Clear cart
  clearCart: async (): Promise<void> => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      toast.success("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  }
};
