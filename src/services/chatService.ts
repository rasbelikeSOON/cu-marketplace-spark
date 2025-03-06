
import { supabase } from "@/integrations/supabase/client";

export const chatService = {
  // Get chat history between current user and another user
  getChatHistory: async (otherUserId: string, productId?: string) => {
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;
    
    if (!currentUserId) throw new Error("User not authenticated");
    
    let query = supabase
      .from('chat_messages')
      .select(`
        *,
        sender:profiles!sender_id(id, username, avatar_url),
        receiver:profiles!receiver_id(id, username, avatar_url)
      `)
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
      .or(`sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId}`)
      .order('created_at', { ascending: true });
    
    // Filter by product if specified
    if (productId) {
      query = query.eq('product_id', productId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },
  
  // Send a message
  sendMessage: async (receiverId: string, message: string, productId?: string) => {
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;
    
    if (!currentUserId) throw new Error("User not authenticated");
    
    const messageData: any = {
      sender_id: currentUserId,
      receiver_id: receiverId,
      message
    };
    
    if (productId) {
      messageData.product_id = productId;
    }
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([messageData])
      .select();
    
    if (error) throw error;
    
    // Send notification to the receiver if they have telegram
    try {
      const { data: receiverProfile } = await supabase
        .from('profiles')
        .select('telegram_id, username')
        .eq('id', receiverId)
        .single();
      
      if (receiverProfile?.telegram_id) {
        await supabase.functions.invoke('send-telegram-notification', {
          body: {
            userId: receiverId,
            notificationType: "new_message",
            data: {
              senderName: (await supabase.from('profiles').select('username').eq('id', currentUserId).single()).data?.username,
              message,
              productId
            }
          }
        });
      }
    } catch (notifyError) {
      console.error("Error sending notification:", notifyError);
    }
    
    return data[0];
  },
  
  // Mark messages as read
  markAsRead: async (senderId: string) => {
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;
    
    if (!currentUserId) throw new Error("User not authenticated");
    
    const { error } = await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', currentUserId)
      .eq('is_read', false);
    
    if (error) throw error;
    return true;
  },
  
  // Get unread message count
  getUnreadCount: async () => {
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;
    
    if (!currentUserId) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select('id', { count: 'exact' })
      .eq('receiver_id', currentUserId)
      .eq('is_read', false);
    
    if (error) throw error;
    return data.length;
  }
};
