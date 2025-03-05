
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { cartService, CartItem } from "../services/cartService";
import { Button } from "../components/ui-components/Button";
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Load cart items
  useEffect(() => {
    const loadCartItems = async () => {
      setIsLoading(true);
      try {
        const items = await cartService.getUserCart();
        setCartItems(items);
      } catch (error) {
        console.error("Error loading cart:", error);
        toast({
          title: "Error",
          description: "Failed to load your shopping cart. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCartItems();
  }, [toast]);
  
  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    try {
      await cartService.updateCartItemQuantity(itemId, quantity);
      
      // Update local state
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Remove item from cart
  const removeItem = async (itemId: string) => {
    try {
      await cartService.removeFromCart(itemId);
      
      // Update local state
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
      
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Clear cart
  const clearCart = async () => {
    if (cartItems.length === 0) return;
    
    try {
      await cartService.clearCart();
      setCartItems([]);
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );
  
  // Calculate items count
  const itemsCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );
  
  // Checkout function
  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "Checkout functionality is not yet implemented.",
    });
  };
  
  return (
    <MainLayout>
      <div className="container-custom py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-semibold mb-2">
              Your Shopping Cart
            </h1>
            <p className="text-muted-foreground">
              {isLoading
                ? "Loading your cart..."
                : cartItems.length === 0
                ? "Your cart is empty"
                : `You have ${itemsCount} item${itemsCount !== 1 ? "s" : ""} in your cart`}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/products"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={14} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="bg-white rounded-xl p-4 shadow-subtle flex flex-col sm:flex-row gap-4"
              >
                <Skeleton className="h-24 w-24 rounded-lg flex-shrink-0" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/4" />
                </div>
                <div className="w-32 flex-shrink-0">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-subtle text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-muted-foreground mb-4">
              <ShoppingBag size={24} />
            </div>
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 shadow-subtle flex flex-col sm:flex-row items-center gap-4"
                  >
                    <Link to={`/product/${item.product_id}`} className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images?.[0] || "/placeholder.svg"}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    
                    <div className="flex-grow">
                      <Link to={`/product/${item.product_id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                        {item.product.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Seller: {item.product.seller?.username || "Unknown Seller"}
                      </p>
                      <p className="font-semibold mt-1">
                        ₦{Number(item.product.price).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-2 items-center sm:items-end">
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-secondary rounded-l-lg"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-secondary rounded-r-lg"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-muted-foreground hover:text-destructive transition-colors inline-flex items-center mt-1"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="text-muted-foreground"
                >
                  <Trash2 size={14} className="mr-2" />
                  Clear Cart
                </Button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-subtle sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 border-b border-border pb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                <div className="flex justify-between pt-4 font-semibold text-lg">
                  <span>Total</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Secure payment powered by Supabase
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ShoppingCart;
