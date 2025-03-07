
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { notificationService } from '@/services/notificationService';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BellRing, Mail, MessageSquare, ShoppingBag } from 'lucide-react';

interface NotificationPreferences {
  email_order_updates: boolean;
  email_marketing: boolean;
  push_order_updates: boolean;
  push_chat_messages: boolean;
  push_marketing: boolean;
}

const NotificationSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_order_updates: true,
    email_marketing: false,
    push_order_updates: true,
    push_chat_messages: true,
    push_marketing: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notification preferences.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Update OneSignal tags
      notificationService.setUserTags({
        order_updates: preferences.push_order_updates ? 'true' : 'false',
        chat_messages: preferences.push_chat_messages ? 'true' : 'false',
        marketing: preferences.push_marketing ? 'true' : 'false',
      });

      toast({
        title: 'Success',
        description: 'Notification preferences saved successfully.',
      });
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification preferences.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const requestPushPermission = async () => {
    const result = await notificationService.requestPermission();
    if (result) {
      toast({
        title: 'Success',
        description: 'Push notifications enabled successfully!',
      });
    } else {
      toast({
        title: 'Notice',
        description: 'You need to allow notifications in your browser settings.',
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="skeleton h-6 w-48 mb-2"></CardTitle>
          <CardDescription className="skeleton h-4 w-64"></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center justify-between">
              <div className="skeleton h-4 w-40"></div>
              <div className="skeleton h-5 w-10 rounded-full"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Control how and when you receive notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Email Notifications</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <label htmlFor="email_order_updates" className="text-sm">
                  Order updates
                </label>
              </div>
              <Switch
                id="email_order_updates"
                checked={preferences.email_order_updates}
                onCheckedChange={() => handleToggle('email_order_updates')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <label htmlFor="email_marketing" className="text-sm">
                  Marketing emails
                </label>
              </div>
              <Switch
                id="email_marketing"
                checked={preferences.email_marketing}
                onCheckedChange={() => handleToggle('email_marketing')}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Push Notifications</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <label htmlFor="push_order_updates" className="text-sm">
                  Order updates
                </label>
              </div>
              <Switch
                id="push_order_updates"
                checked={preferences.push_order_updates}
                onCheckedChange={() => handleToggle('push_order_updates')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <label htmlFor="push_chat_messages" className="text-sm">
                  Chat messages
                </label>
              </div>
              <Switch
                id="push_chat_messages"
                checked={preferences.push_chat_messages}
                onCheckedChange={() => handleToggle('push_chat_messages')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="h-4 w-4 text-muted-foreground" />
                <label htmlFor="push_marketing" className="text-sm">
                  Promotions and offers
                </label>
              </div>
              <Switch
                id="push_marketing"
                checked={preferences.push_marketing}
                onCheckedChange={() => handleToggle('push_marketing')}
              />
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={requestPushPermission}
            className="w-full mt-2"
          >
            Enable Push Notifications
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={savePreferences} disabled={isSaving} className="w-full">
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationSettings;
