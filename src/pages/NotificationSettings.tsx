
import React, { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Check, X, AlertTriangle, MessageCircle, ShoppingBag, Megaphone } from 'lucide-react';
import { type NotificationPreferences } from '@/services/notificationService';

const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('');
  
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_order_updates: true,
    email_marketing: false,
    push_order_updates: true,
    push_chat_messages: true,
    push_marketing: false,
  });

  useEffect(() => {
    if (!user) return;
    
    const fetchPreferences = async () => {
      setIsLoading(true);
      
      try {
        // Get permission status
        if (typeof window !== 'undefined' && window.Notification) {
          setPermissionStatus(Notification.permission);
        }
        
        // Get user preferences
        const prefs = await notificationService.getUserPreferences(user.id);
        
        if (prefs) {
          setPreferences(prefs);
        }
      } catch (error) {
        console.error('Error fetching notification preferences:', error);
        toast({
          title: "Error",
          description: "Failed to load notification preferences",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPreferences();
  }, [user, toast]);
  
  const handleSavePreferences = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const success = await notificationService.saveUserPreferences(user.id, preferences);
      
      if (success) {
        toast({
          title: "Success",
          description: "Notification preferences saved successfully",
        });
      } else {
        throw new Error("Failed to save preferences");
      }
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const requestNotificationPermission = async () => {
    try {
      const granted = await notificationService.requestPermission();
      setPermissionStatus(granted ? 'granted' : 'denied');
      
      if (granted) {
        toast({
          title: "Permission Granted",
          description: "You will now receive push notifications",
        });
      } else {
        toast({
          title: "Permission Denied",
          description: "You won't receive push notifications unless you enable them in your browser settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Error",
        description: "Failed to request notification permission",
        variant: "destructive",
      });
    }
  };
  
  const renderPermissionStatus = () => {
    switch (permissionStatus) {
      case 'granted':
        return (
          <div className="flex items-center text-green-500 gap-1">
            <Check className="h-4 w-4" />
            <span>Notifications enabled</span>
          </div>
        );
      case 'denied':
        return (
          <div className="flex items-center text-red-500 gap-1">
            <X className="h-4 w-4" />
            <span>Notifications blocked</span>
          </div>
        );
      case 'default':
        return (
          <div className="flex items-center text-yellow-500 gap-1">
            <AlertTriangle className="h-4 w-4" />
            <span>Permission not requested</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">Notification Settings</h1>
        
        <div className="grid gap-6">
          {/* Push Notification Permission */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Push Notifications</CardTitle>
              </div>
              <CardDescription>
                Allow browser notifications to stay updated with important activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  {renderPermissionStatus()}
                </div>
                {permissionStatus !== 'granted' && (
                  <Button 
                    variant="outline" 
                    onClick={requestNotificationPermission}
                    disabled={permissionStatus === 'denied'}
                  >
                    {permissionStatus === 'denied' 
                      ? 'Enable in Browser Settings' 
                      : 'Enable Notifications'}
                  </Button>
                )}
              </div>
              
              {permissionStatus === 'denied' && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md mt-3 text-sm">
                  <p>You've blocked notifications for this site. To enable them:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Click the lock/info icon in your browser's address bar</li>
                    <li>Find the notifications setting</li>
                    <li>Change it from "Block" to "Allow"</li>
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose which notifications you'd like to receive and how
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse text-center">
                    <p className="text-sm text-muted-foreground">Loading preferences...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Order Updates */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Order Updates</h3>
                    </div>
                    
                    <div className="space-y-3 ml-7">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Email notifications</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Get notified about order status updates via email
                          </p>
                        </div>
                        <Switch
                          checked={preferences.email_order_updates}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({ ...prev, email_order_updates: checked }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Push notifications</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Get notified about order status updates via browser notifications
                          </p>
                        </div>
                        <Switch
                          checked={preferences.push_order_updates}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({ ...prev, push_order_updates: checked }))
                          }
                          disabled={permissionStatus !== 'granted'}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Chat Messages */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Chat Messages</h3>
                    </div>
                    
                    <div className="space-y-3 ml-7">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Push notifications</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Get notified when you receive new messages
                          </p>
                        </div>
                        <Switch
                          checked={preferences.push_chat_messages}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({ ...prev, push_chat_messages: checked }))
                          }
                          disabled={permissionStatus !== 'granted'}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Marketing & Promotions */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Megaphone className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Marketing & Promotions</h3>
                    </div>
                    
                    <div className="space-y-3 ml-7">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Email notifications</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Receive promotional emails and special offers
                          </p>
                        </div>
                        <Switch
                          checked={preferences.email_marketing}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({ ...prev, email_marketing: checked }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Push notifications</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Receive promotional notifications and special offers
                          </p>
                        </div>
                        <Switch
                          checked={preferences.push_marketing}
                          onCheckedChange={(checked) => 
                            setPreferences(prev => ({ ...prev, push_marketing: checked }))
                          }
                          disabled={permissionStatus !== 'granted'}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSavePreferences} 
                disabled={isLoading || isSaving}
                className="ml-auto"
              >
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotificationSettings;
