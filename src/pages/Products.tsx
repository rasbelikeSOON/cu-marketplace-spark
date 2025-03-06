import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { categories } from "../data/mockData";
import ProductCard from "../components/ui-components/ProductCard";
import CategoriesSection from "../components/sections/CategoriesSection";
import SearchBar from "../components/ui-components/SearchBar";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Products = () => {
  const [activeCategory, setActiveCategory] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            seller:profiles(id, username, avatar_url)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast]);
  
  const handleCategoryChange = (categoryId: number) => {
    setActiveCategory(categoryId);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };
  
  useEffect(() => {
    let result = [...products];
    
    if (activeCategory !== 1) {
      const categoryName = categories.find(cat => cat.id === activeCategory)?.name;
      result = result.filter(product => product.category === categoryName);
    }
    
    if (searchQuery) {
      result = result.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    setFilteredProducts(result);
  }, [activeCategory, searchQuery, priceRange, products]);

  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-subtle">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="container-custom py-8 md:py-12">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-4">
            Browse Products
          </h1>
          <p className="text-muted-foreground">
            Discover what fellow Covenant University students are selling, from textbooks to electronics and more.
          </p>
        </div>
        
        <div className="mb-8">
          <SearchBar
            placeholder="Search for products, categories, or descriptions..."
            onSearch={handleSearch}
            className="max-w-2xl mx-auto"
          />
        </div>
        
        <CategoriesSection
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-subtle sticky top-24">
              <h3 className="font-semibold mb-4">Filter by Price</h3>
              
              <div className="py-4">
                <Slider
                  defaultValue={[0, 500000]}
                  max={500000}
                  step={5000}
                  value={priceRange}
                  onValueChange={handlePriceChange}
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>₦{priceRange[0].toLocaleString()}</span>
                  <span>₦{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
              
              <div className="border-t border-border pt-4 mt-2">
                <h3 className="font-semibold mb-3">Condition</h3>
                <div className="space-y-2">
                  {["New", "Like New", "Good", "Fair", "Poor"].map((condition) => (
                    <div key={condition} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`condition-${condition}`}
                        className="rounded border-border text-primary focus:ring-primary/25 h-4 w-4"
                      />
                      <label
                        htmlFor={`condition-${condition}`}
                        className="ml-2 text-sm text-foreground"
                      >
                        {condition}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-border pt-4 mt-4">
                <h3 className="font-semibold mb-2">Posted Within</h3>
                <div className="space-y-2">
                  {["Last 24 hours", "Last week", "Last month", "Any time"].map((timeFrame) => (
                    <div key={timeFrame} className="flex items-center">
                      <input
                        type="radio"
                        name="time-frame"
                        id={`time-${timeFrame}`}
                        className="border-border text-primary focus:ring-primary/25 h-4 w-4"
                      />
                      <label
                        htmlFor={`time-${timeFrame}`}
                        className="ml-2 text-sm text-foreground"
                      >
                        {timeFrame}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-scale"
                    style={{ animationDelay: `${index % 12 * 50}ms` }}
                  >
                    <ProductCard 
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      image={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"}
                      category={product.category}
                      sellerName={product.seller?.username || "Unknown Seller"}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center shadow-subtle">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
