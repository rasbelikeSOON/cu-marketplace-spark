import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { chatService } from '@/services/chatService';
import { useToast } from '@/hooks/use-toast';
import { Send, ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface ChatInterfaceProps {
  receiverId: string;
  receiverName: string;
  productId?: string;
  productTitle?: string;
  onBack?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  receiverId, 
  receiverName, 
  productId, 
  productTitle,
  onBack 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      if (!user || !receiverId) return;
      
      setIsLoading(true);
      try {
        const data = await chatService.getChatHistory(receiverId, productId);
        setMessages(data);
        await chatService.markAsRead(receiverId);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load messages. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
    
    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `receiver_id=eq.${user?.id}`,
        },
        (payload) => {
          if (payload.new.sender_id === receiverId) {
            chatService.getChatHistory(receiverId, productId).then((data) => {
              setMessages(data);
              chatService.markAsRead(receiverId);
            });
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, receiverId, productId, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    try {
      const sentMessage = await chatService.sendMessage(receiverId, newMessage.trim(), productId);
      setMessages([...messages, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <div className="bg-background border-b p-3 flex items-center">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft size={18} />
          </Button>
        )}
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>{receiverName?.[0] || '?'}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{receiverName}</h3>
            {productTitle && (
              <p className="text-xs text-muted-foreground">
                Regarding: {productTitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-muted/30">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : ''}`}>
                <div className={`max-w-[75%] ${i % 2 === 0 ? 'bg-primary/20' : 'bg-background'} rounded-lg p-3`}>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-2">No messages yet</p>
            <p className="text-sm">Start the conversation by sending a message.</p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isMyMessage = message.sender_id === user?.id;
              
              return (
                <div
                  key={message.id}
                  className={`flex mb-4 ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMyMessage && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarFallback>
                        {message.sender?.username?.[0] || '?'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      isMyMessage
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p>{message.message}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isSending}
          className="flex-1"
        />
        <Button type="submit" disabled={isSending || !newMessage.trim()}>
          {isSending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
