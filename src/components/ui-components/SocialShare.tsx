
import React from 'react';
import { Button } from './Button';
import { Share, Twitter, Instagram, MessageCircle } from 'lucide-react';

interface SocialShareProps {
  title: string;
  description?: string;
  url: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ title, description, url }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');
  
  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, '_blank');
  };
  
  const shareOnInstagram = () => {
    // Instagram doesn't have a direct share URL, but we can copy to clipboard
    // and alert the user to paste it on Instagram
    navigator.clipboard.writeText(`${title}\n${url}`);
    alert('Link copied to clipboard. Open Instagram to share!');
  };
  
  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, '_blank');
  };
  
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        <Share size={14} /> Share:
      </span>
      <Button 
        onClick={shareOnTwitter} 
        variant="outline" 
        size="sm" 
        className="rounded-full"
      >
        <Twitter size={16} />
        <span className="sr-only">Share on Twitter</span>
      </Button>
      <Button 
        onClick={shareOnInstagram} 
        variant="outline" 
        size="sm" 
        className="rounded-full"
      >
        <Instagram size={16} />
        <span className="sr-only">Share on Instagram</span>
      </Button>
      <Button 
        onClick={shareOnWhatsApp} 
        variant="outline" 
        size="sm" 
        className="rounded-full"
      >
        <MessageCircle size={16} />
        <span className="sr-only">Share on WhatsApp</span>
      </Button>
    </div>
  );
};

export default SocialShare;
