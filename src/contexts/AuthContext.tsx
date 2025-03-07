
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { emailService } from '@/services/emailService';
import { notificationService } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';

type SellerProfile = {
  phone_number: string;
  telegram_username: string;
  matric_number: string;
  hall: string;
  room_number: string;
  is_verified_seller: boolean;
  is_admin: boolean;
}

export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  telegram_id: string | null;
  phone_number: string | null;
  telegram_username: string | null;
  matric_number: string | null;
  hall: string | null;
  room_number: string | null;
  is_verified_seller: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: any | null, data: any | null }>;
  signInWithGoogle: () => Promise<{ error: any | null, data: any | null }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any | null, data: any | null }>;
  resetPassword: (email: string) => Promise<{ error: any | null, data: any | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isSellerVerified: boolean;
  isAdmin: boolean;
  sendVerificationEmail: () => Promise<{ success: boolean, error?: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSellerVerified, setIsSellerVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const refreshProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setProfile(data as Profile);
        setIsSellerVerified(data.is_verified_seller || false);
        setIsAdmin(data.is_admin || false);
        
        // Set user ID for OneSignal
        notificationService.setUserId(user.id);
        
        // Set user tags for segmented notifications
        if (data.is_verified_seller) {
          notificationService.setUserTags({ 
            user_type: 'seller',
            is_verified: 'true',
            is_admin: data.is_admin ? 'true' : 'false'
          });
        } else {
          notificationService.setUserTags({ 
            user_type: 'buyer',
            is_admin: data.is_admin ? 'true' : 'false'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Initialize OneSignal
    if (typeof window !== 'undefined') {
      notificationService.init();
    }
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        refreshProfile();
      }
      
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);

        // Get profile data if user is logged in
        if (session?.user) {
          await refreshProfile();
          
          // Show welcome back toast on sign-in
          if (event === 'SIGNED_IN') {
            toast({
              title: 'Welcome back!',
              description: `You're now signed in as ${session.user.email}`,
            });
          }
        } else {
          setProfile(null);
          setIsSellerVerified(false);
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithMagicLink = async (email: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/signin',
      }
    });
    
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/signin',
      }
    });
    
    return { data, error };
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: window.location.origin + '/signin',
      },
    });

    // If sign up was successful and no error, send welcome email using Brevo
    if (!error && data.user) {
      try {
        await emailService.sendWelcomeEmail(
          email,
          userData?.username || email.split('@')[0]
        );
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // We don't return this error as it's not critical for sign up
      }
    }

    return { data, error };
  };
  
  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    
    // If password reset email was successfully sent, also send via Brevo
    if (!error) {
      try {
        // Note: This is just for demonstration. In a real implementation,
        // you would not send a second email, but rely on Supabase's email
        // or completely replace it with Brevo.
        await emailService.sendPasswordResetEmail(
          email,
          `${window.location.origin}/reset-password`
        );
      } catch (emailError) {
        console.error('Error sending password reset email via Brevo:', emailError);
      }
    }
    
    return { data, error };
  };
  
  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    return { error };
  };
  
  const sendVerificationEmail = async () => {
    if (!user || !user.email) {
      return { success: false, error: 'No user logged in or email not available' };
    }
    
    try {
      // In a real implementation, you would generate a verification token
      // and store it in the database, then use it to verify the email
      const verificationLink = `${window.location.origin}/verify-email?token=example-token`;
      
      const result = await emailService.sendVerificationEmail(
        user.email,
        verificationLink
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signIn,
    signInWithMagicLink,
    signInWithGoogle,
    signUp,
    resetPassword,
    updatePassword,
    signOut,
    refreshProfile,
    isSellerVerified,
    isAdmin,
    sendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
