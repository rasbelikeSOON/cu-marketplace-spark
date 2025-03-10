
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Button } from "../components/ui-components/Button";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Heart, HeartOff, ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { categories } from "@/data/mockData";
import SocialShare from "@/components/ui-components/SocialShare";
import { productService } from "@/services/productService";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useQuery } from "@tanstack/react-query";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist } = useWishlistStore();
  
  const [selectedImage, setSelectedImage] = useState<string>("");
  
  // Fetch product data using React Query
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => id ? productService.getProductById(id) : null,
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch wishlist data when component mounts
  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [fetchWishlist, user]);
  
  // Set selected image when product data loads
  useEffect(() => {
    if (product?.images && product.images.length > 0) {
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
    
    // In a real app, this would be an API call to add the product to the cart
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
    
    // First add to cart
    handleAddToCart();
    
    // Then navigate to cart
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

  const shareUrl = window.location.href;
  const isFavorited = id ? isInWishlist(id) : false;

  // Find similar products (in a real app, this would be an API call)
  // For now, we're just creating dummy related products
  const relatedProducts = [
    { ...product, id: product.id + "-related-1" },
    { ...product, id: product.id + "-related-2" },
    { ...product, id: product.id + "-related-3" },
    { ...product, id: product.id + "-related-4" }
  ];

  return (
    <MainLayout>
      <div className="container-custom py-8 md:py-12">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to products
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border border-border dark:border-gray-700 bg-white dark:bg-gray-800">
              <img
                src={selectedImage || (product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg")}
                alt={product.title}
                className="h-full w-full object-contain"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image: string, index: number) => (
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
                      alt={`${product.title} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-semibold">{product.title}</h1>
              <div className="flex items-center mt-2 space-x-2">
                <p className="text-xl font-semibold text-primary dark:text-covenant-lavender">
                  ₦{product.price?.toLocaleString()}
                </p>
                
                {product.discount > 0 && (
                  <>
                    <p className="text-sm text-muted-foreground line-through">
                      ₦{((product.price / (1 - product.discount / 100))).toLocaleString()}
                    </p>
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800">
                      {product.discount}% OFF
                    </Badge>
                  </>
                )}
              </div>
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {product.category}
              </Badge>
            </div>
            
            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
            
            {/* Actions */}
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
            
            {/* Seller Information */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Seller Information</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                  {product.seller?.username?.[0]?.toUpperCase() || "S"}
                </div>
                <div>
                  <p className="font-medium">{product.seller?.username || "Seller"}</p>
                  <p className="text-sm text-muted-foreground">{product.seller?.matric_number || "Verified Seller"}</p>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={handleContactSeller}>
                  <MessageCircle size={16} className="mr-2" />
                  Message Seller
                </Button>
                
                {product.seller?.telegram_username && (
                  <Button variant="outline" size="sm" onClick={handleContactTelegram}>
                    Contact on Telegram
                  </Button>
                )}
                
                {product.seller?.phone_number && (
                  <Button variant="outline" size="sm" onClick={handleContactPhone}>
                    <Phone size={16} className="mr-2" />
                    Call Seller
                  </Button>
                )}
              </div>
            </div>
            
            {/* Social Sharing */}
            <div className="pt-2">
              <SocialShare 
                title={product.title} 
                description={product.description || ""} 
                url={shareUrl} 
              />
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-xl font-display font-semibold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct, index) => (
              <div 
                key={`${relatedProduct.id}-${index}`}
                className="cursor-pointer group"
                onClick={() => {
                  if (relatedProduct.id !== product.id) {
                    navigate(`/product/${relatedProduct.id.split('-')[0]}`);
                  }
                }}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary mb-2">
                  <img 
                    src={relatedProduct.images?.[0] || "/placeholder.svg"} 
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
