import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Button } from "../components/ui-components/Button";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Heart, HeartOff, ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import SocialShare from "@/components/ui-components/SocialShare";
import { productService } from "@/services/productService";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useQuery } from "@tanstack/react-query";

interface ProductWithSeller {
  id: string;
  title: string;
  price: number;
  description: string | null;
  images: string[];
  category: string;
  condition: string;
  created_at: string;
  updated_at: string;
  seller_id: string;
  seller: {
    id: string;
    username: string | null;
    avatar_url: string | null;
    matric_number?: string | null;
    telegram_username?: string | null;
    phone_number?: string | null;
  };
  discount?: number;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist } = useWishlistStore();
  
  const [selectedImage, setSelectedImage] = useState<string>("");
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => id ? productService.getProductById(id) : null,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [fetchWishlist, user]);

  useEffect(() => {
    if (product && product.images && Array.isArray(product.images) && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to add items to your cart",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }
    
    toast({
      title: "Added to cart",
      description: `${product?.title} has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to purchase items",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }
    
    handleAddToCart();
    navigate("/cart");
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to save favorites",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }
    
    if (!id) return;
    
    try {
      if (isInWishlist(id)) {
        await removeFromWishlist(id);
        toast({
          title: "Removed from wishlist",
          description: `${product?.title} has been removed from your wishlist.`,
        });
      } else {
        await addToWishlist(id);
        toast({
          title: "Added to wishlist",
          description: `${product?.title} has been added to your wishlist.`,
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContactSeller = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to contact sellers",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }
    
    if (product?.seller_id) {
      navigate("/messages", { state: { sellerId: product.seller_id } });
    }
  };

  const handleContactTelegram = () => {
    if (product?.seller?.telegram_username) {
      window.open(`https://t.me/${product.seller.telegram_username.replace('@', '')}`, '_blank');
    } else {
      toast({
        title: "Contact info unavailable",
        description: "This seller has not provided Telegram contact information.",
        variant: "destructive",
      });
    }
  };

  const handleContactPhone = () => {
    if (product?.seller?.phone_number) {
      window.open(`tel:${product.seller.phone_number}`, '_blank');
    } else {
      toast({
        title: "Contact info unavailable",
        description: "This seller has not provided phone contact information.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container-custom py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-secondary rounded-lg"></div>
              <div className="space-y-6">
                <div className="h-10 bg-secondary rounded w-3/4"></div>
                <div className="h-6 bg-secondary rounded w-1/4"></div>
                <div className="h-24 bg-secondary rounded"></div>
                <div className="h-12 bg-secondary rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="container-custom py-20 text-center">
          <h1 className="text-2xl font-semibold mb-4">Product Not Found</h1>
          <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/products")}>
            Browse Products
          </Button>
        </div>
      </MainLayout>
    );
  }

  const typedProduct = product as unknown as ProductWithSeller;
  const productImages = Array.isArray(typedProduct.images) ? typedProduct.images : [];

  const shareUrl = window.location.href;
  const isFavorited = id ? isInWishlist(id) : false;

  const relatedProducts = [
    { ...typedProduct, id: typedProduct.id + "-related-1" },
    { ...typedProduct, id: typedProduct.id + "-related-2" },
    { ...typedProduct, id: typedProduct.id + "-related-3" },
    { ...typedProduct, id: typedProduct.id + "-related-4" }
  ];

  return (
    <MainLayout>
      <div className="container-custom py-8 md:py-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to products
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border border-border dark:border-gray-700 bg-white dark:bg-gray-800">
              <img
                src={selectedImage || (productImages.length > 0 ? productImages[0] : "/placeholder.svg")}
                alt={typedProduct.title}
                className="h-full w-full object-contain"
              />
            </div>
            
            {productImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {productImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
                      selectedImage === image
                        ? "border-primary dark:border-covenant-lavender ring-2 ring-primary dark:ring-covenant-lavender ring-offset-2"
                        : "border-border dark:border-gray-700"
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image}
                      alt={`${typedProduct.title} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-semibold">{typedProduct.title}</h1>
              <div className="flex items-center mt-2 space-x-2">
                <p className="text-xl font-semibold text-primary dark:text-covenant-lavender">
                  ₦{typedProduct.price?.toLocaleString()}
                </p>
                
                {typedProduct.discount && typedProduct.discount > 0 && (
                  <>
                    <p className="text-sm text-muted-foreground line-through">
                      ₦{((typedProduct.price / (1 - typedProduct.discount / 100))).toLocaleString()}
                    </p>
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800">
                      {typedProduct.discount}% OFF
                    </Badge>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {typedProduct.category}
              </Badge>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{typedProduct.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                onClick={handleBuyNow}
                size="lg"
                className="flex-1"
                variant="covenant"
              >
                Buy Now
              </Button>
              
              <Button
                onClick={handleAddToCart}
                size="lg"
                variant="outline"
                className="flex-1"
              >
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </Button>
              
              <Button
                onClick={toggleFavorite}
                size="icon"
                variant="outline"
                className={`rounded-full ${isFavorited ? 'bg-red-50 hover:bg-red-100 text-red-500' : ''}`}
                aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isFavorited ? <HeartOff size={18} /> : <Heart size={18} />}
              </Button>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-lg font-semibold mb-3">Seller Information</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                  {typedProduct.seller?.username?.[0]?.toUpperCase() || "S"}
                </div>
                <div>
                  <p className="font-medium">{typedProduct.seller?.username || "Seller"}</p>
                  <p className="text-sm text-muted-foreground">{typedProduct.seller?.matric_number || "Verified Seller"}</p>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={handleContactSeller}>
                  <MessageCircle size={16} className="mr-2" />
                  Message Seller
                </Button>
                
                {typedProduct.seller?.telegram_username && (
                  <Button variant="outline" size="sm" onClick={handleContactTelegram}>
                    Contact on Telegram
                  </Button>
                )}
                
                {typedProduct.seller?.phone_number && (
                  <Button variant="outline" size="sm" onClick={handleContactPhone}>
                    <Phone size={16} className="mr-2" />
                    Call Seller
                  </Button>
                )}
              </div>
            </div>
            
            <div className="pt-2">
              <SocialShare 
                title={typedProduct.title} 
                description={typedProduct.description || ""} 
                url={shareUrl} 
              />
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-xl font-display font-semibold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct, index) => (
              <div 
                key={`${relatedProduct.id}-${index}`}
                className="cursor-pointer group"
                onClick={() => {
                  if (relatedProduct.id !== typedProduct.id) {
                    navigate(`/product/${relatedProduct.id.split('-')[0]}`);
                  }
                }}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary mb-2">
                  <img 
                    src={Array.isArray(relatedProduct.images) && relatedProduct.images.length > 0 ? relatedProduct.images[0] : "/placeholder.svg"} 
                    alt={relatedProduct.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="font-medium text-sm line-clamp-1">{relatedProduct.title}</h3>
                <p className="text-sm text-primary dark:text-covenant-lavender">₦{relatedProduct.price?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
