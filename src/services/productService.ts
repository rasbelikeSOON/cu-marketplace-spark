
import { supabase } from "@/integrations/supabase/client";

export const productService = {
  // Get all products
  getAllProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        seller:profiles(id, username, avatar_url)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Get product by ID
  getProductById: async (id: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        seller:profiles(id, username, avatar_url)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Create new product
  createProduct: async (productData: any, images: File[]) => {
    // First upload images
    const imageUrls = [];
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    if (!userId) throw new Error("User not authenticated");
    
    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('product_images')
        .upload(fileName, image);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(fileName);
      
      imageUrls.push(publicUrl);
    }
    
    // Then create product with image URLs
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...productData,
        seller_id: userId,
        images: imageUrls
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Send notification about new product
    if (data) {
      try {
        // Get the seller details for the notification
        const { data: sellerData } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', userId)
          .single();
          
        await supabase.functions.invoke('send-product-notification', {
          body: { 
            productTitle: data.title, 
            productId: data.id,
            sellerName: sellerData?.username || 'Unknown seller'
          }
        });
        
        // Optional: Send Telegram notifications to all users about new product
        await notifyUsersAboutNewProduct(data, sellerData);
      } catch (notifyError) {
        // Just log the error but don't fail the product creation
        console.error("Error sending product notification:", notifyError);
      }
    }
    
    return data;
  },
  
  // Get products by category
  getProductsByCategory: async (category: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        seller:profiles(id, username, avatar_url)
      `)
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Get user's products (for seller dashboard)
  getUserProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        seller:profiles(id, username, avatar_url)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Delete product
  deleteProduct: async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Helper function to notify users about new products via Telegram
async function notifyUsersAboutNewProduct(product: any, seller: any): Promise<void> {
  try {
    // Get all users who have linked their Telegram accounts
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, telegram_id')
      .not('telegram_id', 'is', null);
    
    if (error || !profiles) {
      console.error("Error fetching profiles with Telegram IDs:", error);
      return;
    }
    
    // Send Telegram notification to each user
    for (const profile of profiles) {
      if (profile.telegram_id && profile.id !== product.seller_id) {
        try {
          await supabase.functions.invoke('send-telegram-notification', {
            body: {
              userId: profile.id,
              notificationType: "new_product",
              data: {
                ...product,
                seller
              }
            }
          });
        } catch (notifyError) {
          console.error(`Error notifying user ${profile.id}:`, notifyError);
        }
      }
    }
  } catch (error) {
    console.error("Error in notifyUsersAboutNewProduct:", error);
  }
}
