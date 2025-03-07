
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../components/ui-components/Button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { chatService } from "@/services/chatService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import ChatInterface from "../components/ui-components/ChatInterface";
import { Search, MessageCircle } from "lucide-react";

const Messages = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) return;
    
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        // Get unique users I've chatted with
        const { data: sentMessages, error: sentError } = await supabase
          .from('chat_messages')
          .select('receiver_id, receiver:profiles!receiver_id(id, username, avatar_url, telegram_username, phone_number)')
          .eq('sender_id', user.id);
        
        const { data: receivedMessages, error: receivedError } = await supabase
          .from('chat_messages')
          .select('sender_id, sender:profiles!sender_id(id, username, avatar_url, telegram_username, phone_number)')
          .eq('receiver_id', user.id);
        
        if (sentError || receivedError) {
          throw new Error("Failed to fetch conversations");
        }
        
        const chatPartners = new Map();
        
        // Add receivers
        sentMessages?.forEach(msg => {
          if (msg.receiver) {
            chatPartners.set(msg.receiver_id, msg.receiver);
          }
        });
        
        // Add senders
        receivedMessages?.forEach(msg => {
          if (msg.sender) {
            chatPartners.set(msg.sender_id, msg.sender);
          }
        });
        
        // Get unread counts for each conversation
        const counts: Record<string, number> = {};
        for (const [partnerId] of chatPartners) {
          const { data } = await supabase
            .from('chat_messages')
            .select('id', { count: 'exact' })
            .eq('sender_id', partnerId)
            .eq('receiver_id', user.id)
            .eq('is_read', false);
          
          counts[partnerId] = data?.length || 0;
        }
        
        setUnreadCounts(counts);
        
        // Get last message for each conversation to sort by most recent
        const conversationsWithLastMessage = await Promise.all(
          Array.from(chatPartners.entries()).map(async ([partnerId, partnerInfo]) => {
            const { data: lastMessage } = await supabase
              .from('chat_messages')
              .select('*')
              .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
              .order('created_at', { ascending: false })
              .limit(1);
            
            return {
              partner: partnerInfo,
              lastMessage: lastMessage?.[0] || null,
              unreadCount: counts[partnerId] || 0
            };
          })
        );
        
        // Sort by most recent message
        const sortedConversations = conversationsWithLastMessage
          .filter(conv => conv.lastMessage !== null)
          .sort((a, b) => {
            const dateA = new Date(a.lastMessage?.created_at || 0);
            const dateB = new Date(b.lastMessage?.created_at || 0);
            return dateB.getTime() - dateA.getTime();
          });
        
        setConversations(sortedConversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast({
          title: "Error",
          description: "Failed to load your conversations.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversations();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const filteredConversations = conversations.filter(convo => 
    convo.partner.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectChat = (conversation: any) => {
    setSelectedChat(conversation);
    
    // Mark messages as read when selecting a chat
    if (conversation.unreadCount > 0) {
      chatService.markAsRead(conversation.partner.id);
      
      // Update unread count in UI
      setUnreadCounts(prev => ({
        ...prev,
        [conversation.partner.id]: 0
      }));
      
      // Update the conversation object
      const updatedConversations = conversations.map(c => {
        if (c.partner.id === conversation.partner.id) {
          return { ...c, unreadCount: 0 };
        }
        return c;
      });
      
      setConversations(updatedConversations);
    }
  };

  const handleNewMessage = () => {
    // For simplicity, we'll navigate to products where they can find sellers
    navigate('/products');
    toast({
      title: "Start a new conversation",
      description: "Find a product and click 'Chat with Seller' to start a new conversation."
    });
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container-custom py-12 flex justify-center">
          <Card className="w-full max-w-xl">
            <CardContent className="py-8 text-center">
              <p>Please sign in to view your messages.</p>
              <Button onClick={() => navigate('/signin')} className="mt-4">Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container-custom py-6 md:py-12">
        <h1 className="text-2xl md:text-3xl font-display font-semibold mb-6">Messages</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Conversation list */}
          <div className={`flex-shrink-0 w-full ${selectedChat ? 'hidden md:block' : ''} md:w-80 lg:w-96`}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Conversations</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleNewMessage}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1.5 flex-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No conversations found</p>
                    {searchQuery ? (
                      <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">
                        Clear search
                      </Button>
                    ) : (
                      <Button variant="link" onClick={handleNewMessage} className="mt-2">
                        Start a new conversation
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1 -mx-2">
                    {filteredConversations.map((conversation) => (
                      <button
                        key={conversation.partner.id}
                        className={`flex items-center gap-3 p-3 w-full text-left rounded-lg transition-colors ${
                          selectedChat?.partner.id === conversation.partner.id
                            ? 'bg-primary/10'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => handleSelectChat(conversation)}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{conversation.partner.username?.[0] || '?'}</AvatarFallback>
                            {conversation.partner.avatar_url && (
                              <AvatarImage src={conversation.partner.avatar_url} />
                            )}
                          </Avatar>
                          {conversation.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <h4 className="font-medium truncate">{conversation.partner.username}</h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(conversation.lastMessage.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage.sender_id === user.id ? 'You: ' : ''}
                            {conversation.lastMessage.message}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Chat interface */}
          <div className={`flex-grow ${!selectedChat ? 'hidden md:block' : ''}`}>
            {selectedChat ? (
              <ChatInterface
                receiverId={selectedChat.partner.id}
                receiverName={selectedChat.partner.username || 'User'}
                receiverProfile={selectedChat.partner}
                onBack={() => setSelectedChat(null)}
              />
            ) : (
              <Card className="h-[600px] flex flex-col items-center justify-center text-center p-6">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
                <p className="text-muted-foreground mb-6">
                  Select a conversation from the sidebar or start a new one.
                </p>
                <Button onClick={handleNewMessage}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start a new conversation
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Messages;
