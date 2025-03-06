
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../components/ui-components/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { productService } from "@/services/productService";
import { Pencil, Trash2, AlertCircle, User, Phone, MessageCircle, School, Building, ShoppingBag, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Profile = () => {
  const { user, profile, signOut, refreshProfile, isSellerVerified } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    phone_number: "",
    telegram_username: "",
    matric_number: "",
    hall: "",
    room_number: "",
  });
  
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        phone_number: profile.phone_number || "",
        telegram_username: profile.telegram_username || "",
        matric_number: profile.matric_number || "",
        hall: profile.hall || "",
        room_number: profile.room_number || "",
      });
    }
    
    // Load user's products and orders
    if (user) {
      loadUserProducts();
      loadUserOrders();
      
      if (isSellerVerified) {
        loadSellerOrders();
      }
    }
  }, [profile, user, isSellerVerified]);
  
  const loadUserProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUserProducts(data);
    } catch (error) {
      console.error("Error loading user products:", error);
      toast({
        title: "Error",
        description: "Failed to load your products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };
  
  const loadUserOrders = async () => {
    if (!user) return;
    
    setIsLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          product:products(*),
          seller:profiles(id, username, avatar_url)
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUserOrders(data);
    } catch (error) {
      console.error("Error loading user orders:", error);
      toast({
        title: "Error",
        description: "Failed to load your orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingOrders(false);
    }
  };
  
  const loadSellerOrders = async () => {
    if (!user) return;
    
    setIsLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          product:products(*),
          buyer:profiles(id, username, avatar_url)
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSellerOrders(data);
    } catch (error) {
      console.error("Error loading seller orders:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsUpdatingProfile(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          phone_number: formData.phone_number,
          telegram_username: formData.telegram_username,
          matric_number: formData.matric_number,
          hall: formData.hall,
          room_number: formData.room_number
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      await refreshProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  const handleDeleteProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      await productService.deleteProduct(productId);
      setUserProducts(userProducts.filter((product: any) => product.id !== productId));
      toast({
        title: "Product deleted",
        description: "Your product has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProductToDelete(null);
    }
  };
  
  const updateOrderStatus = async (orderId: string, status: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Refresh the orders
      await loadSellerOrders();
      
      toast({
        title: "Order updated",
        description: `Order status changed to ${status}.`,
      });
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return (
      <MainLayout>
        <div className="container-custom py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <p>Please sign in to view your profile.</p>
              <Link to="/signin">
                <Button className="mt-4">Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container-custom py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-none">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            {isSellerVerified && <TabsTrigger value="products">My Products</TabsTrigger>}
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            {isSellerVerified && <TabsTrigger value="seller">Seller Dashboard</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <div className="relative mt-1">
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone_number">Phone Number</Label>
                      <div className="relative mt-1">
                        <Input
                          id="phone_number"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="telegram_username">Telegram Username</Label>
                      <div className="relative mt-1">
                        <Input
                          id="telegram_username"
                          name="telegram_username"
                          value={formData.telegram_username}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                        <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    {isSellerVerified && (
                      <>
                        <div>
                          <Label htmlFor="matric_number">Matric Number</Label>
                          <div className="relative mt-1">
                            <Input
                              id="matric_number"
                              name="matric_number"
                              value={formData.matric_number}
                              onChange={handleInputChange}
                              className="pl-10"
                            />
                            <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="hall">Hall</Label>
                            <div className="relative mt-1">
                              <Input
                                id="hall"
                                name="hall"
                                value={formData.hall}
                                onChange={handleInputChange}
                                className="pl-10"
                              />
                              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="room_number">Room Number</Label>
                            <Input
                              id="room_number"
                              name="room_number"
                              value={formData.room_number}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div className="flex flex-col space-y-2 pt-2">
                      <Button
                        onClick={handleUpdateProfile}
                        disabled={isUpdatingProfile}
                      >
                        {isUpdatingProfile ? "Updating..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isUpdatingProfile}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground text-xs">Email</Label>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      
                      <div>
                        <Label className="text-muted-foreground text-xs">Username</Label>
                        <p className="font-medium">{profile?.username || "Not set"}</p>
                      </div>
                      
                      <div>
                        <Label className="text-muted-foreground text-xs">Phone Number</Label>
                        <p className="font-medium">{profile?.phone_number || "Not set"}</p>
                      </div>
                      
                      <div>
                        <Label className="text-muted-foreground text-xs">Telegram Username</Label>
                        <p className="font-medium">{profile?.telegram_username || "Not set"}</p>
                      </div>
                      
                      {isSellerVerified && (
                        <>
                          <div>
                            <Label className="text-muted-foreground text-xs">Matric Number</Label>
                            <p className="font-medium">{profile?.matric_number || "Not set"}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-muted-foreground text-xs">Hall</Label>
                              <p className="font-medium">{profile?.hall || "Not set"}</p>
                            </div>
                            
                            <div>
                              <Label className="text-muted-foreground text-xs">Room Number</Label>
                              <p className="font-medium">{profile?.room_number || "Not set"}</p>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-muted-foreground text-xs">Seller Status</Label>
                            <p className="font-medium flex items-center">
                              {isSellerVerified ? (
                                <span className="text-green-600 flex items-center">
                                  <span className="mr-1 h-2 w-2 rounded-full bg-green-600"></span>
                                  Verified Seller
                                </span>
                              ) : (
                                <span className="text-amber-600 flex items-center">
                                  <span className="mr-1 h-2 w-2 rounded-full bg-amber-600"></span>
                                  Pending Verification
                                </span>
                              )}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
                      <Button onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                      <Button variant="outline" onClick={signOut}>
                        Sign Out
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {isSellerVerified && (
            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Your Products</CardTitle>
                  <Link to="/add-product">
                    <Button size="sm">Add New Product</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {isLoadingProducts ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="border rounded-lg p-4">
                          <div className="flex items-center space-x-4">
                            <Skeleton className="h-16 w-16 rounded-md" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : userProducts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        You haven't listed any products yet.
                      </p>
                      <Link to="/add-product">
                        <Button>Add Your First Product</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userProducts.map((product: any) => (
                        <div
                          key={product.id}
                          className="border rounded-lg p-4 hover:border-primary transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                              {product.images && product.images[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-secondary text-muted-foreground">
                                  No image
                                </div>
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <h3 className="font-medium truncate">{product.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                ₦{Number(product.price).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex-shrink-0 flex flex-col gap-2">
                              <Link to={`/edit-product/${product.id}`}>
                                <Button variant="outline" size="sm" className="w-full">
                                  <Pencil size={14} className="mr-1" />
                                  Edit
                                </Button>
                              </Link>
                              <AlertDialog open={productToDelete === product.id} onOpenChange={(open) => !open && setProductToDelete(null)}>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full text-destructive hover:bg-destructive/10"
                                    onClick={() => setProductToDelete(product.id)}
                                  >
                                    <Trash2 size={14} className="mr-1" />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this product? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteProduct(product.id)}
                                      disabled={isLoading}
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      {isLoading ? "Deleting..." : "Delete"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-16 w-16 rounded-md" />
                          <div className="space-y-2 flex-grow">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      You haven't placed any orders yet.
                    </p>
                    <Link to="/products">
                      <Button>Browse Products</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order: any) => (
                      <div
                        key={order.id}
                        className="border rounded-lg p-4 hover:border-primary transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="h-16 w-16 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                            {order.product.images && order.product.images[0] ? (
                              <img
                                src={order.product.images[0]}
                                alt={order.product.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-secondary text-muted-foreground">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <h3 className="font-medium truncate">{order.product.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              ₦{Number(order.product.price).toLocaleString()}
                            </p>
                            <div className="flex items-center mt-1">
                              <p className="text-xs text-muted-foreground">
                                Seller: {order.seller?.username || "Unknown"}
                              </p>
                              <span className="mx-2 text-muted-foreground">•</span>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium 
                              ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                'bg-amber-100 text-amber-800'}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </div>
                            <div className="mt-2 flex justify-end space-x-2">
                              <Link to={`/product/${order.product.id}`}>
                                <Button variant="outline" size="sm">
                                  <ShoppingBag size={14} className="mr-1" />
                                  View
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm">
                                <MessageSquare size={14} className="mr-1" />
                                Chat
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {isSellerVerified && (
            <TabsContent value="seller" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingOrders ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border rounded-lg p-4">
                          <div className="flex items-center space-x-4">
                            <Skeleton className="h-16 w-16 rounded-md" />
                            <div className="space-y-2 flex-grow">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : sellerOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        You don't have any orders for your products yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sellerOrders.map((order: any) => (
                        <div
                          key={order.id}
                          className="border rounded-lg p-4 hover:border-primary transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                              {order.product.images && order.product.images[0] ? (
                                <img
                                  src={order.product.images[0]}
                                  alt={order.product.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-secondary text-muted-foreground">
                                  No image
                                </div>
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <h3 className="font-medium truncate">{order.product.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                ₦{Number(order.product.price).toLocaleString()}
                              </p>
                              <div className="flex items-center mt-1">
                                <p className="text-xs text-muted-foreground">
                                  Buyer: {order.buyer?.username || "Unknown"}
                                </p>
                                <span className="mx-2 text-muted-foreground">•</span>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <div className={`px-3 py-1 rounded-full text-xs font-medium 
                                ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                  'bg-amber-100 text-amber-800'}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </div>
                              
                              {order.status === 'pending' && (
                                <div className="mt-2 flex justify-end space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => updateOrderStatus(order.id, 'completed')}
                                    disabled={isLoading}
                                  >
                                    Complete
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                    disabled={isLoading}
                                    className="text-destructive hover:bg-destructive/10"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              )}
                              
                              <div className="mt-2 flex justify-end">
                                <Button variant="outline" size="sm">
                                  <MessageSquare size={14} className="mr-1" />
                                  Chat
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;
