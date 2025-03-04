
import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "../components/ui-components/Button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, ShoppingCart, Minus, Plus, Trash2, AlertCircle, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

const CartItem = ({ item, updateQuantity, removeItem }) => {
  return (
    <div className="flex items-center py-4 border-b border-border last:border-0">
      <div className="h-20 w-20 rounded-md overflow-hidden mr-4">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{item.seller}</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center border border-input rounded-md">
          <button 
            className="px-2 py-1 hover:bg-secondary"
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            disabled={item.quantity === 1}
          >
            <Minus size={14} />
          </button>
          <span className="px-3 py-1">{item.quantity}</span>
          <button 
            className="px-2 py-1 hover:bg-secondary"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus size={14} />
          </button>
        </div>
        
        <div className="text-right w-24">
          <div className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</div>
          <button 
            className="text-sm text-red-500 hover:underline mt-1"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 size={14} className="inline mr-1" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "MacBook Pro 2022",
      price: 450000,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1026&q=80",
      seller: "David Johnson",
      quantity: 1,
    },
    {
      id: 7,
      title: "Scientific Calculator",
      price: 7500,
      image: "https://images.unsplash.com/photo-1564473185935-58113cba1e80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      seller: "Faith Mathew",
      quantity: 2,
    },
  ]);
  
  const [step, setStep] = useState(1); // 1: Cart, 2: Checkout, 3: Payment, 4: Confirmation
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const updateQuantity = (id, newQuantity) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity: newQuantity} : item
    ));
  };
  
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const serviceFee = Math.round(subtotal * 0.02); // 2% service fee
  const total = subtotal + serviceFee;
  
  const handleCheckout = () => {
    setStep(2);
  };
  
  const handlePayment = () => {
    setStep(3);
  };
  
  const handlePlaceOrder = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep(4);
      // Clear cart after successful order
      // setCartItems([]);
    }, 2000);
  };
  
  const getStepLabel = (stepNumber, label) => {
    if (step === stepNumber) {
      return <span className="font-medium text-primary">{label}</span>;
    } else if (step > stepNumber) {
      return <span className="font-medium text-green-600">{label} ✓</span>;
    }
    return <span className="text-muted-foreground">{label}</span>;
  };
  
  return (
    <MainLayout>
      <div className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold flex items-center mb-2">
              <ShoppingCart className="mr-2" /> 
              {step === 1 && "Shopping Cart"}
              {step === 2 && "Checkout"}
              {step === 3 && "Payment"}
              {step === 4 && "Order Confirmation"}
            </h1>
            
            <div className="flex items-center mt-6">
              <div className="text-sm">{getStepLabel(1, "Cart")}</div>
              <div className="h-px bg-border w-10 mx-2"></div>
              <div className="text-sm">{getStepLabel(2, "Checkout")}</div>
              <div className="h-px bg-border w-10 mx-2"></div>
              <div className="text-sm">{getStepLabel(3, "Payment")}</div>
              <div className="h-px bg-border w-10 mx-2"></div>
              <div className="text-sm">{getStepLabel(4, "Confirmation")}</div>
            </div>
          </div>
          
          {cartItems.length === 0 && step === 1 ? (
            <div className="text-center py-12">
              <div className="inline-block p-6 bg-secondary rounded-full mb-4">
                <ShoppingCart size={48} className="text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to="/products">
                <Button>
                  Browse Products
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Cart Items or Checkout Form */}
              <div className="md:col-span-2">
                {step === 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Cart Items ({cartItems.reduce((total, item) => total + item.quantity, 0)})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        {cartItems.map(item => (
                          <CartItem 
                            key={item.id} 
                            item={item} 
                            updateQuantity={updateQuantity} 
                            removeItem={removeItem} 
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {step === 2 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" placeholder="John" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" placeholder="Doe" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" placeholder="you@example.com" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" placeholder="080XXXXXXXX" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="hostel">Hostel / Dormitory</Label>
                          <select 
                            id="hostel" 
                            className="w-full border border-input rounded-md p-2 h-10"
                          >
                            <option>Daniel Hall</option>
                            <option>Joseph Hall</option>
                            <option>Deborah Hall</option>
                            <option>Esther Hall</option>
                            <option>Peter Hall</option>
                            <option>Paul Hall</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="room">Room Number</Label>
                          <Input id="room" placeholder="A201" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="notes">Additional Notes (Optional)</Label>
                          <textarea 
                            id="notes" 
                            rows={3}
                            className="w-full border border-input rounded-md p-3 text-sm"
                            placeholder="Any special instructions for delivery..."
                          ></textarea>
                        </div>
                      </form>
                      
                      <Alert className="mt-6 bg-amber-50 border-amber-200">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800">
                          All items are delivered within 24 hours to your hostel room on campus.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )}
                
                {step === 3 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup 
                        defaultValue={paymentMethod} 
                        onValueChange={setPaymentMethod}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-3 border border-input rounded-lg p-4 hover:bg-secondary/50 cursor-pointer">
                          <RadioGroupItem value="paystack" id="paystack" />
                          <Label htmlFor="paystack" className="flex-1 cursor-pointer">
                            <div className="font-medium">Paystack</div>
                            <div className="text-sm text-muted-foreground">Pay with card, bank transfer, or USSD</div>
                          </Label>
                          <img src="https://website-v3-assets.s3.amazonaws.com/assets/img/hero/Paystack-mark-white-twitter.png" 
                               alt="Paystack" 
                               className="h-8 w-8" />
                        </div>
                        
                        <div className="flex items-center space-x-3 border border-input rounded-lg p-4 hover:bg-secondary/50 cursor-pointer">
                          <RadioGroupItem value="flutterwave" id="flutterwave" />
                          <Label htmlFor="flutterwave" className="flex-1 cursor-pointer">
                            <div className="font-medium">Flutterwave</div>
                            <div className="text-sm text-muted-foreground">Pay with multiple payment options</div>
                          </Label>
                          <img src="https://cdn.filestackcontent.com/OITnwQTdTB2rdbB1xr3W" 
                               alt="Flutterwave" 
                               className="h-8 w-8" />
                        </div>
                        
                        <div className="flex items-center space-x-3 border border-input rounded-lg p-4 hover:bg-secondary/50 cursor-pointer">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="flex-1 cursor-pointer">
                            <div className="font-medium">Cash on Delivery</div>
                            <div className="text-sm text-muted-foreground">Pay when you receive your items</div>
                          </Label>
                          <CreditCard className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </RadioGroup>
                      
                      <Alert className="mt-6 bg-secondary">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Your payment data is secured with industry-standard encryption.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )}
                
                {step === 4 && (
                  <Card>
                    <CardHeader className="text-center">
                      <div className="inline-block p-4 bg-green-100 rounded-full mb-4 mx-auto">
                        <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <CardTitle className="text-xl">Order Placed Successfully!</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="mb-4">Your order has been confirmed. Order number: <span className="font-medium">ORD-2023-1042</span></p>
                      <p className="text-sm text-muted-foreground mb-6">
                        We've sent a confirmation email to your inbox. Your items will be delivered within 24 hours.
                      </p>
                      
                      <div className="space-y-4">
                        <Link to="/user-dashboard">
                          <Button className="w-full">
                            Track Your Order
                          </Button>
                        </Link>
                        <Link to="/products">
                          <Button variant="outline" className="w-full">
                            Continue Shopping
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Order Summary */}
              {step < 4 && (
                <div className="md:col-span-1">
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
                          <span>₦{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Service Fee (2%)</span>
                          <span>₦{serviceFee.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-border pt-3 mt-3">
                          <div className="flex justify-between font-medium text-lg">
                            <span>Total</span>
                            <span>₦{total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                      {step === 1 && (
                        <Button onClick={handleCheckout} className="w-full">
                          Proceed to Checkout
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                      
                      {step === 2 && (
                        <Button onClick={handlePayment} className="w-full">
                          Continue to Payment
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                      
                      {step === 3 && (
                        <Button onClick={handlePlaceOrder} className="w-full" disabled={isProcessing}>
                          {isProcessing ? (
                            <>
                              Processing...
                              <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                            </>
                          ) : (
                            <>
                              Place Order
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      )}
                      
                      {step > 1 && (
                        <Button 
                          variant="outline" 
                          onClick={() => setStep(step - 1)} 
                          className="w-full"
                          disabled={isProcessing}
                        >
                          Back
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ShoppingCart;
