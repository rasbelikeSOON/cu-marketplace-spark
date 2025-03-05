
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Button } from "../components/ui-components/Button";
import { ArrowLeft, Heart, Share, Flag, MessageCircle, ShoppingBag } from "lucide-react";
import ProductCard from "../components/ui-components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
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
            seller:profiles(id, username, avatar_url)
          `)
          .eq('id', id)
          .single();
        
        if (productError) throw productError;
        setProduct(productData);
        
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

  // Add to cart function
  const addToCart = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    if (product) {
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      });
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
                  {product.seller?.username?.[0] || product.seller?.id?.[0] || '?'}
                </div>
              </div>
              <div>
                <h3 className="font-medium">Seller: {product.seller?.username || "Anonymous"}</h3>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(product.seller?.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button className="flex-1" onClick={addToCart}>
                <ShoppingBag size={18} className="mr-2" />
                Add to Cart
              </Button>
              <Button variant="secondary" className="flex-1">
                <MessageCircle size={18} className="mr-2" />
                Message Seller
              </Button>
            </div>
            
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
                <Button variant="outline" size="sm">
                  <Share size={18} className="mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
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
