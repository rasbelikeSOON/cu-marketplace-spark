
import { supabase } from "@/integrations/supabase/client";

// Interface for cart items
export interface CartItem {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    seller: {
      username: string;
    };
  };
}

export const cartService = {
  // Get user's cart
  getUserCart: async (): Promise<CartItem[]> => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");
    
    // Get cart items with product details
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(
          id, 
          title, 
          price, 
          images,
          seller:profiles(username)
        )
      `)
      .eq('user_id', user.id);
    
    if (error) throw error;
    return data as CartItem[];
  },
  
  // Add item to cart
  addToCart: async (productId: string, quantity: number = 1): Promise<void> => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");
    
    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();
    
    if (existingItem) {
      // Update quantity if item exists
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);
      
      if (error) throw error;
    } else {
      // Add new item if it doesn't exist
      const { error } = await supabase
        .from('cart_items')
        .insert([{
          user_id: user.id,
          product_id: productId,
          quantity
        }]);
      
      if (error) throw error;
    }
  },
  
  // Update cart item quantity
  updateCartItemQuantity: async (itemId: string, quantity: number): Promise<void> => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");
    
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .eq('user_id', user.id);
    
    if (error) throw error;
  },
  
  // Remove item from cart
  removeFromCart: async (itemId: string): Promise<void> => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id);
    
    if (error) throw error;
  },
  
  // Clear cart
  clearCart: async (): Promise<void> => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("User not authenticated");
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);
    
    if (error) throw error;
  }
};
