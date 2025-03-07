
import { supabase } from "@/integrations/supabase/client";

export const emailService = {
  /**
   * Send an email using Brevo through our Supabase Edge Function
   */
  sendEmail: async (email: string, templateId: number, params: Record<string, any> = {}) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-brevo-email', {
        body: { email, templateId, params }
      });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }
  },
  
  /**
   * Send a welcome email to a new user
   */
  sendWelcomeEmail: async (email: string, username: string) => {
    return emailService.sendEmail(email, 1, { username });
  },
  
  /**
   * Send an order confirmation email
   */
  sendOrderConfirmationEmail: async (email: string, orderDetails: any) => {
    return emailService.sendEmail(email, 2, { orderDetails });
  },
  
  /**
   * Send a password reset email
   */
  sendPasswordResetEmail: async (email: string, resetLink: string) => {
    return emailService.sendEmail(email, 3, { resetLink });
  },
  
  /**
   * Send an email verification email
   */
  sendVerificationEmail: async (email: string, verificationLink: string) => {
    return emailService.sendEmail(email, 4, { verificationLink });
  }
};
