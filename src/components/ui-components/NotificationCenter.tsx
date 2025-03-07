
import React, { useState, useEffect } from 'react';
import { Bell, Settings, Trash2 } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'chat' | 'system' | 'marketing';
  read: boolean;
  created_at: string;
};

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  // For demo purposes, using mock data
  useEffect(() => {
    if (user) {
      // In a real app, this would fetch from the database
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'New order placed',
          message: 'Someone purchased your "Chemistry Textbook"',
          type: 'order',
          read: false,
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '2',
          title: 'New message received',
          message: 'You have a new message about your "Calculator" listing',
          type: 'chat',
          read: false,
          created_at: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: '3',
          title: 'Price drop alert',
          message: 'An item on your wishlist is now 20% off',
          type: 'marketing',
          read: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    }
  }, [user]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // In a real app, this would update the database
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
    
    toast({
      title: "All notifications marked as read",
      description: "Your notification center is now clear",
    });
    
    // In a real app, this would update the database
  };

  const deleteNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    toast({
      title: "Notification removed",
      description: "The notification has been deleted",
    });
    
    // In a real app, this would delete from the database
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Badge variant="default">Order</Badge>;
      case 'chat':
        return <Badge variant="secondary">Message</Badge>;
      case 'marketing':
        return <Badge variant="outline">Promo</Badge>;
      default:
        return <Badge variant="outline">System</Badge>;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 z-50 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No notifications yet
              </div>
            ) : (
              <ul className="space-y-3">
                {notifications.map((notification) => (
                  <li 
                    key={notification.id}
                    className={`p-3 rounded-lg border ${notification.read ? 'bg-background' : 'bg-muted/30 border-primary/20'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(notification.type)}
                          <h4 className="font-medium text-sm">
                            {notification.title}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatTime(notification.created_at)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <Button 
                            size="icon" 
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <span className="sr-only">Mark as read</span>
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                          </Button>
                        )}
                        <Button 
                          size="icon" 
                          variant="ghost"
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <span className="sr-only">Delete</span>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/profile'}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default NotificationCenter;
