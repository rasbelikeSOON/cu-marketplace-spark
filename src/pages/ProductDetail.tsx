
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Button } from "../components/ui-components/Button";
import { ArrowLeft, Heart, Share, Flag, MessageCircle, ShoppingBag, ExternalLink, Phone, ShoppingCart } from "lucide-react";
import ProductCard from "../components/ui-components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import ChatInterface from "../components/ui-components/ChatInterface";
import { cartService } from "@/services/cartService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();
  const { user, isSellerVerified } = useAuth();
  
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        // Fetch product details
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select(`
            *,
            seller:profiles(id, username, avatar_url, phone_number, telegram_username, is_verified_seller)
          `)
          .eq('id', id)
          .single();
        
        if (productError) throw productError;
        setProduct(productData);
        setSeller(productData.seller);
        
        // Fetch related products (same category, excluding current product)
        const { data: relatedData, error: relatedError } = await supabase
          .from('products')
          .select(`
            *,
            seller:profiles(id, username, avatar_url)
          `)
          .eq('category', productData.category)
          .neq('id', id)
          .limit(4);
        
        if (relatedError) throw relatedError;
        setRelatedProducts(relatedData);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Failed to load product details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchProduct();
    }
  }, [id, toast]);

  // Buy now / place order function
  const placeOrder = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase this item",
        variant: "destructive",
      });
      return;
    }

    if (product) {
      setIsOrdering(true);
      try {
        // Create an order
        const { data, error } = await supabase
          .from('orders')
          .insert([
            {
              product_id: product.id,
              buyer_id: user.id,
              seller_id: product.seller_id,
              status: 'pending'
            }
          ])
          .select();
        
        if (error) throw error;
        
        // Notify the seller
        try {
          await supabase.functions.invoke('send-telegram-notification', {
            body: {
              userId: product.seller_id,
              notificationType: "new_order",
              data: {
                productTitle: product.title,
                buyerName: user.email, // Use email as fallback
                orderId: data[0].id
              }
            }
          });
        } catch (notifyError) {
          console.error("Error notifying seller:", notifyError);
        }
        
        toast({
          title: "Order placed",
          description: `You've successfully placed an order for ${product.title}.`,
        });
        
        setIsOrdering(false);
      } catch (error) {
        console.error("Error placing order:", error);
        toast({
          title: "Error",
          description: "Failed to place order. Please try again.",
          variant: "destructive",
        });
        setIsOrdering(false);
      }
    }
  };

  // Add to cart function
  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    if (product) {
      setIsAddingToCart(true);
      try {
        await cartService.addToCart(product.id, 1);
        toast({
          title: "Added to cart",
          description: `${product.title} has been added to your cart.`,
        });
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container-custom py-8 md:py-12">
          <div className="mb-6">
            <Link
              to="/products"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={14} className="mr-2" />
              Back to Products
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <Skeleton className="aspect-square rounded-2xl w-full" />
              <div className="flex gap-3">
                {[1, 2, 3].map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <Skeleton className="h-6 w-1/4 mb-2" />
                <Skeleton className="h-8 w-3/4 mb-3" />
                <Skeleton className="h-6 w-1/3" />
              </div>
              
              <Skeleton className="h-32 w-full" />
              
              <div className="pt-4">
                <Skeleton className="h-10 w-full" />
                <div className="flex gap-4 mt-4">
                  <Skeleton className="h-10 w-1/2" />
                  <Skeleton className="h-10 w-1/2" />
                </div>
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
        <div className="container-custom py-12">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Get product images or use placeholders
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : ["/placeholder.svg"];

  // Check if current user is the seller
  const isCurrentUserSeller = user && product.seller_id === user.id;

  return (
    <MainLayout>
      <div className="container-custom py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} className="mr-2" />
            Back to Products
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-subtle">
              <img
                src={productImages[activeImage]}
                alt={product.title}
                className="w-full h-full object-cover animate-fade-in"
              />
            </div>
            
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`flex-none w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === index
                        ? "border-primary shadow-sm"
                        : "border-transparent opacity-70"
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.title} - view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 bg-secondary text-xs font-medium rounded-full">
                  {product.category}
                </span>
                <span className="text-muted-foreground text-sm">
                  Posted on {new Date(product.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-display font-semibold mt-3">
                {product.title}
              </h1>
              
              <div className="flex items-baseline mt-2">
                <span className="text-2xl font-semibold">
                  ₦{Number(product.price).toLocaleString()}
                </span>
                {product.condition && (
                  <span className="ml-3 text-muted-foreground text-sm">
                    Condition: {product.condition}
                  </span>
                )}
              </div>
            </div>
            
            <div className="pt-2 pb-4 border-t border-b border-border">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {product.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div>
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-medium">
                  {seller?.username?.[0] || seller?.id?.[0] || '?'}
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center">
                  <h3 className="font-medium">
                    {seller?.username || "Anonymous"}
                  </h3>
                  {seller?.is_verified_seller && (
                    <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Verified Seller
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(seller?.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {!isCurrentUserSeller && (
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button className="flex-1" onClick={placeOrder} disabled={isOrdering}>
                  <ShoppingBag size={18} className="mr-2" />
                  {isOrdering ? "Processing..." : "Buy Now"}
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  <ShoppingCart size={18} className="mr-2" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            )}
            
            {!isCurrentUserSeller && (
              <div className="flex flex-wrap gap-3 pt-1">
                <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MessageCircle size={16} className="mr-2" />
                      Chat on Site
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-lg p-0">
                    <ChatInterface 
                      receiverId={product.seller_id} 
                      receiverName={seller?.username || "Seller"}
                      productId={product.id}
                      productTitle={product.title}
                      onBack={() => setIsChatOpen(false)}
                    />
                  </SheetContent>
                </Sheet>
                
                {seller?.telegram_username && (
                  <a 
                    href={`https://t.me/${seller.telegram_username.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200">
                      <ExternalLink size={16} className="mr-2" />
                      Chat on Telegram
                    </Button>
                  </a>
                )}
                
                {seller?.phone_number && (
                  <a 
                    href={`tel:${seller.phone_number}`}
                  >
                    <Button variant="outline" size="sm" className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200">
                      <Phone size={16} className="mr-2" />
                      Call Seller
                    </Button>
                  </a>
                )}
              </div>
            )}
            
            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
                className={isFavorite ? "text-primary" : ""}
              >
                <Heart
                  size={18}
                  className={`mr-2 ${isFavorite ? "fill-primary" : ""}`}
                />
                {isFavorite ? "Saved" : "Save"}
              </Button>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.title,
                      text: `Check out this product: ${product.title}`,
                      url: window.location.href,
                    }).catch((error) => console.log('Error sharing', error));
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Link copied",
                      description: "Product link copied to clipboard!",
                    });
                  }
                }}>
                  <Share size={18} className="mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  toast({
                    title: "Report submitted",
                    description: "Thank you for reporting this product. We'll review it soon.",
                  });
                }}>
                  <Flag size={18} className="mr-2" />
                  Report
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 md:mt-24">
            <h2 className="text-2xl font-display font-semibold mb-6">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="animate-scale">
                  <ProductCard 
                    id={relatedProduct.id}
                    title={relatedProduct.title}
                    price={relatedProduct.price}
                    image={relatedProduct.images && relatedProduct.images.length > 0 
                      ? relatedProduct.images[0] 
                      : "/placeholder.svg"}
                    category={relatedProduct.category}
                    sellerName={relatedProduct.seller?.username || "Unknown Seller"}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
