
import React, { useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Wishlist = () => {
  const { items, isLoading, error, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [fetchWishlist, user]);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      toast({
        title: 'Removed from wishlist',
        description: 'The item has been removed from your wishlist',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove item from wishlist',
        variant: 'destructive',
      });
    }
  };

  return (
    <MainLayout>
      <div className="container-custom py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-display font-semibold">My Wishlist</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-subtle">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => fetchWishlist()}>Try Again</Button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-subtle">
            <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Explore our marketplace and add items you like to your wishlist!
            </p>
            <Button asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-subtle group">
                <Link to={`/product/${item.product_id}`}>
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={item.product.images?.[0] || '/placeholder.svg'}
                      alt={item.product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-block py-1 px-3 bg-white/80 backdrop-blur-sm text-xs font-medium rounded-full">
                        {item.product.category}
                      </span>
                    </div>
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link to={`/product/${item.product_id}`}>
                    <h3 className="font-medium text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {item.product.title}
                    </h3>
                  </Link>
                  
                  <p className="mt-1 text-muted-foreground text-sm line-clamp-1">
                    by {item.product.seller?.username || 'Unknown Seller'}
                  </p>
                  
                  <div className="mt-2 font-semibold">₦{item.product.price?.toLocaleString()}</div>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/product/${item.product_id}`)}
                    >
                      <ShoppingCart size={16} className="mr-2" />
                      View Product
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveFromWishlist(item.product_id)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Wishlist;
