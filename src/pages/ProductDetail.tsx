
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { products } from "../data/mockData";
import { Button } from "../components/ui-components/Button";
import { ArrowLeft, Heart, Share, Flag, MessageCircle, ShoppingBag } from "lucide-react";
import ProductCard from "../components/ui-components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Find the product with the matching ID
  const product = products.find((p) => p.id === Number(id));
  
  // Get related products (same category, excluding current product)
  const relatedProducts = products
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);
  
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
  
  // Sample images (in a real app, these would come from the product data)
  const productImages = [
    product.image,
    "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80",
  ];

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
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 bg-secondary text-xs font-medium rounded-full">
                  {product.category}
                </span>
                <span className="text-muted-foreground text-sm">
                  Posted on {product.postedDate}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-display font-semibold mt-3">
                {product.title}
              </h1>
              
              <div className="flex items-baseline mt-2">
                <span className="text-2xl font-semibold">
                  ₦{product.price.toLocaleString()}
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
                  {product.sellerName.charAt(0)}
                </div>
              </div>
              <div>
                <h3 className="font-medium">Seller: {product.sellerName}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.sellerEmail}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button className="flex-1">
                <ShoppingBag size={18} className="mr-2" />
                Buy Now
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
                  <ProductCard {...relatedProduct} />
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
