
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Button } from "../components/ui-components/Button";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Heart, HeartOff, ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { mockProducts } from "@/data/mockData";
import SocialShare from "@/components/ui-components/SocialShare";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call to get the product data
    const selectedProduct = mockProducts.find(p => p.id === parseInt(id || "0"));
    
    if (selectedProduct) {
      setProduct(selectedProduct);
      setSelectedImage(selectedProduct.images[0]);
      // Check if product is in user's favorites
      // This would come from an API call in a real app
      setIsFavorited(false);
    }
    
    setLoading(false);
  }, [id]);

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
      description: `${product.name} has been added to your cart.`,
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

  const toggleFavorite = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to save favorites",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }
    
    setIsFavorited(!isFavorited);
    
    // In a real app, this would be an API call to toggle favorite status
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited 
        ? `${product.name} has been removed from your favorites.`
        : `${product.name} has been added to your favorites.`,
    });
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
    
    navigate("/messages", { state: { sellerId: product.sellerId } });
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

  if (loading) {
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

  if (!product) {
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
                src={selectedImage || product.images[0]}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
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
                      alt={`${product.name} thumbnail ${index + 1}`}
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
              <h1 className="text-2xl md:text-3xl font-display font-semibold">{product.name}</h1>
              <div className="flex items-center mt-2 space-x-2">
                <p className="text-xl font-semibold text-primary dark:text-covenant-lavender">₦{product.price.toLocaleString()}</p>
                
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
              {product.categories.map((category: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {category}
                </Badge>
              ))}
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
                className="rounded-full"
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
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
                title={product.name} 
                description={product.description} 
                url={shareUrl} 
              />
            </div>
          </div>
        </div>
        
        {/* Related Products - Would be implemented with actual data in a real app */}
        <div className="mt-16">
          <h2 className="text-xl font-display font-semibold mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockProducts.slice(0, 4).map((relatedProduct) => (
              <div 
                key={relatedProduct.id} 
                className="cursor-pointer group"
                onClick={() => {
                  if (relatedProduct.id !== product.id) {
                    navigate(`/product/${relatedProduct.id}`);
                  }
                }}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary mb-2">
                  <img 
                    src={relatedProduct.images[0]} 
                    alt={relatedProduct.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="font-medium text-sm line-clamp-1">{relatedProduct.name}</h3>
                <p className="text-sm text-primary dark:text-covenant-lavender">₦{relatedProduct.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
