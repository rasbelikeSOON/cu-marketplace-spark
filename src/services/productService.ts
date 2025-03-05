
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
