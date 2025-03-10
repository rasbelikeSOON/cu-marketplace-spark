
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Heart, Share2, MessageCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import SocialShare from "@/components/ui-components/SocialShare";
import { useWishlistStore } from "@/store/useWishlistStore";

// Define interfaces for our data types
interface ProductImage {
  url: string;
  alt: string;
}

interface SellerProfile {
  id: string;
  username: string;
  avatar_url: string;
  telegram_username?: string;
  phone_number?: string;
  matric_number?: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  created_at: string;
  updated_at: string;
  seller_id: string;
  images: ProductImage[] | string[];
  discount?: number;
  seller: SellerProfile;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  
  const [activeImage, setActiveImage] = useState<string>("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, seller:seller_id(id, username, avatar_url, telegram_username, phone_number, matric_number)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Product;
    }
  });

  // Set active image when product data loads
  useEffect(() => {
    if (product && product.images && Array.isArray(product.images) && product.images.length > 0) {
      // Check if the image is an object with a url property or a string
      const firstImage = typeof product.images[0] === 'object' && 'url' in product.images[0] 
        ? (product.images[0] as ProductImage).url 
        : product.images[0] as string;
      
      setActiveImage(firstImage);
    }
  }, [product]);

  // Add to cart handler
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please sign in to add items to your cart");
      return;
    }

    // Add to cart logic
    toast.success("Item added to cart");
  };

  // Message seller handler
  const handleMessageSeller = () => {
    if (!user) {
      toast.error("Please sign in to message the seller");
      return;
    }

    // Message seller logic
    toast.success("Message sent to seller");
  };
  
  // Toggle wishlist handler
  const toggleWishlist = () => {
    if (!user) {
      toast.error("Please sign in to add items to your wishlist");
      return;
    }
    
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
        toast.success("Removed from wishlist");
      } else {
        addToWishlist(product.id);
        toast.success("Added to wishlist");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[450px] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-10 w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-custom py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasContactInfo = product.seller?.telegram_username || product.seller?.phone_number;

  return (
    <div className="container-custom py-8 animate-fade-in">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft size={14} />
        Back to Products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg bg-muted aspect-square">
            <img
              src={activeImage || "/placeholder.svg"}
              alt={product.title}
              className="object-cover object-center w-full h-full"
            />
          </div>
          
          {/* Thumbnail Gallery */}
          {Array.isArray(product.images) && product.images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => {
                const imgSrc = typeof image === 'object' && 'url' in image ? image.url : image;
                
                return (
                  <button
                    key={index}
                    className={`relative overflow-hidden rounded-md aspect-square w-20 h-20 border ${
                      activeImage === imgSrc ? "border-primary" : "border-muted"
                    }`}
                    onClick={() => setActiveImage(imgSrc)}
                  >
                    <img
                      src={imgSrc}
                      alt={`Product thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">{product.title}</h1>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">{product.category}</Badge>
              <Badge variant="outline">{product.condition}</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {product.discount ? (
                <>
                  <span className="text-2xl font-bold">
                    ₦{(product.price - (product.price * product.discount / 100)).toLocaleString()}
                  </span>
                  <span className="text-muted-foreground line-through">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <Badge className="bg-green-500 hover:bg-green-600">
                    {product.discount}% OFF
                  </Badge>
                </>
              ) : (
                <span className="text-2xl font-bold">₦{product.price.toLocaleString()}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleAddToCart} 
              className="flex-1"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            
            <Button 
              variant="outline" 
              onClick={toggleWishlist}
              className="w-10 p-0 flex-shrink-0"
            >
              <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setIsShareModalOpen(true)}
              className="w-10 p-0 flex-shrink-0"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Seller Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={product.seller.avatar_url || "/placeholder.svg"}
                alt={product.seller.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-medium">{product.seller.username}</div>
                {product.seller.matric_number && (
                  <div className="text-xs text-muted-foreground">
                    {product.seller.matric_number}
                  </div>
                )}
              </div>
            </div>
            
            {hasContactInfo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                {product.seller.telegram_username && (
                  <div className="text-sm">
                    <div className="font-medium">Telegram:</div>
                    <div>@{product.seller.telegram_username}</div>
                  </div>
                )}
                
                {product.seller.phone_number && (
                  <div className="text-sm">
                    <div className="font-medium">Phone:</div>
                    <div>{product.seller.phone_number}</div>
                  </div>
                )}
              </div>
            )}
            
            <Button 
              onClick={handleMessageSeller} 
              variant="secondary" 
              className="w-full mt-3"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message Seller
            </Button>
          </div>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="mt-10">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Delivery</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <div className="prose prose-sm max-w-none">
              <p>{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="mt-4">
            <div className="prose prose-sm max-w-none">
              <h4>Delivery Information</h4>
              <p>
                This product is available for pickup on campus. The seller will arrange delivery
                details after purchase confirmation.
              </p>
              <p className="font-medium mt-4">
                Note: Always meet in public places for transaction safety.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Social Share Modal */}
      {isShareModalOpen && (
        <SocialShare
          url={window.location.href}
          title={`Check out ${product.title} on CU Marketplace`}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductDetail;
