
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, X, Send, Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface AIAssistantProps {
  position?: 'bottom-right' | 'bottom-left';
  title?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  position = 'bottom-right',
  title = 'CU Marketplace Assistant'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you with CU Marketplace today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { user } = useAuth();

  // Mock function that would be replaced with actual Dialogflow API call
  const getDialogflowResponse = async (text: string): Promise<string> => {
    // In a real implementation, this would call the Dialogflow API
    setIsTyping(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple mock responses
    const responses: Record<string, string> = {
      'hi': 'Hello there! How can I assist you with CU Marketplace today?',
      'hello': 'Hi! How can I help you with your shopping or selling on CU Marketplace?',
      'help': 'I can help with questions about buying, selling, payments, delivery, and more. What do you need assistance with?',
      'order': 'To place an order, browse products and click "Buy Now" or "Add to Cart". You can check your order status in your profile.',
      'sell': 'To sell products, you need to create a verified seller account. Go to your profile and click "Become a Seller".',
      'payment': 'We support multiple payment methods including bank transfers, mobile money, and cash on delivery.',
      'delivery': 'Delivery is typically handled directly by the seller. You can discuss delivery details in the chat with the seller.',
      'default': "I'm not sure I understand. Could you rephrase your question? You can ask about buying, selling, delivery, or payments."
    };
    
    const lowerText = text.toLowerCase();
    let response = '';
    
    for (const [key, value] of Object.entries(responses)) {
      if (lowerText.includes(key)) {
        response = value;
        break;
      }
    }
    
    if (!response) {
      response = responses.default;
    }
    
    setIsTyping(false);
    return response;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Get bot response
    const botResponse = await getDialogflowResponse(inputText);
    
    // Add bot message
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
  };

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Position classes
  const positionClasses = position === 'bottom-right' 
    ? 'bottom-4 right-4' 
    : 'bottom-4 left-4';

  return (
    <>
      {/* Chat button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed ${positionClasses} z-50 rounded-full h-14 w-14 p-0 shadow-lg`}
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>
      
      {/* Chat window */}
      {isOpen && (
        <Card className={`fixed ${positionClasses} z-40 w-80 sm:w-96 h-[450px] flex flex-col shadow-xl`} style={{ bottom: '80px' }}>
          {/* Chat header */}
          <div className="p-3 border-b flex items-center justify-between bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-medium">{title}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full text-primary-foreground hover:bg-primary/90"
            >
              <ChevronDown size={18} />
            </Button>
          </div>
          
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/placeholder.svg" alt="AI Assistant" />
                    <AvatarFallback><Bot size={16} /></AvatarFallback>
                  </Avatar>
                )}
                
                <div 
                  className={`max-w-[80%] px-3 py-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-secondary text-secondary-foreground rounded-tl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback><Bot size={16} /></AvatarFallback>
                </Avatar>
                <div className="bg-secondary text-secondary-foreground rounded-lg rounded-tl-none px-3 py-2">
                  <div className="flex gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>•</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="p-3 border-t">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!inputText.trim()}>
                <Send size={18} />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
};

export default AIAssistant;
