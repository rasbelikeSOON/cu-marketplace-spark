
import { supabase } from "@/integrations/supabase/client";

interface NotificationPreferences {
  email_order_updates: boolean;
  email_marketing: boolean;
  push_order_updates: boolean;
  push_chat_messages: boolean;
  push_marketing: boolean;
}

export const notificationService = {
  /**
   * Request permission for push notifications
   */
  requestPermission: async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !window.OneSignal) {
      console.error('OneSignal not loaded');
      return false;
    }

    try {
      const result = await window.OneSignal.Notifications.requestPermission();
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  },

  /**
   * Initialize OneSignal with user information
   */
  initializeUser: async (userId: string, email?: string) => {
    if (typeof window === 'undefined' || !window.OneSignal) {
      console.error('OneSignal not loaded');
      return;
    }

    try {
      // Set external user id for OneSignal
      await window.OneSignal.login(userId);
      
      // Set user email if available
      if (email) {
        await window.OneSignal.User.addEmail(email);
      }

      console.log('OneSignal user initialized successfully');
    } catch (error) {
      console.error('Error initializing OneSignal user:', error);
    }
  },

  /**
   * Set user tags for segmentation
   */
  setUserTags: async (tags: Record<string, string>) => {
    if (typeof window === 'undefined' || !window.OneSignal) {
      console.error('OneSignal not loaded');
      return;
    }

    try {
      await window.OneSignal.User.addTags(tags);
      console.log('OneSignal tags set successfully');
    } catch (error) {
      console.error('Error setting OneSignal tags:', error);
    }
  },

  /**
   * Get user notification preferences
   */
  getUserPreferences: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data as NotificationPreferences;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return null;
    }
  },

  /**
   * Save user notification preferences
   */
  saveUserPreferences: async (userId: string, preferences: NotificationPreferences) => {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      // Update OneSignal tags based on preferences
      await notificationService.setUserTags({
        order_updates: preferences.push_order_updates ? 'true' : 'false',
        chat_messages: preferences.push_chat_messages ? 'true' : 'false',
        marketing: preferences.push_marketing ? 'true' : 'false',
      });

      return true;
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      return false;
    }
  },

  /**
   * Send a push notification via Supabase Edge Function
   */
  sendPushNotification: async (userId: string, title: string, message: string, data: any = {}) => {
    try {
      const { data: result, error } = await supabase.functions.invoke('send-push-notification', {
        body: { userId, title, message, data }
      });
      
      if (error) throw error;
      return { success: true, data: result };
    } catch (error) {
      console.error('Error sending push notification:', error);
      return { success: false, error };
    }
  },

  /**
   * Send a Telegram notification via Supabase Edge Function
   */
  sendTelegramNotification: async (userId: string, notificationType: string, data: any) => {
    try {
      const { data: result, error } = await supabase.functions.invoke('send-telegram-notification', {
        body: { userId, notificationType, data }
      });
      
      if (error) throw error;
      return { success: true, data: result };
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
      return { success: false, error };
    }
  }
};

// Add typings for OneSignal to avoid TypeScript errors
declare global {
  interface Window {
    OneSignal: {
      init: (config: any) => void;
      login: (userId: string) => Promise<void>;
      User: {
        addEmail: (email: string) => Promise<void>;
        addTags: (tags: Record<string, string>) => Promise<void>;
      };
      Notifications: {
        requestPermission: () => Promise<string>;
      };
    };
  }
}

export type { NotificationPreferences };
