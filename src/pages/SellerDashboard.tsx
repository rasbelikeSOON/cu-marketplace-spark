
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '../components/ui-components/Button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { 
  ShoppingBag, 
  Package, 
  BarChart4, 
  MessageSquare, 
  Star, 
  Users, 
  TrendingUp,
  DollarSign,
  Percent,
  AlertTriangle,
  Plus
} from 'lucide-react';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

const SellerDashboard = () => {
  const { user, profile, isSellerVerified } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [analytics, setAnalytics] = useState({
    dailySales: [] as any[],
    categorySales: [] as any[],
    orderStatus: [] as any[],
  });

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!user || !isSellerVerified) return;
      
      setIsLoading(true);
      try {
        // Fetch seller's products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('seller_id', user.id);
        
        if (productsError) throw productsError;
        
        // Fetch seller's orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            product:products(*),
            buyer:profiles(id, username, avatar_url)
          `)
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false });
        
        if (ordersError) throw ordersError;
        
        setProducts(productsData || []);
        setOrders(ordersData || []);
        
        // Calculate total revenue
        const revenue = ordersData
          ?.filter(order => order.status !== 'cancelled')
          ?.reduce((sum, order) => sum + Number(order.product?.price || 0), 0) || 0;
        
        setTotalRevenue(revenue);
        
        // Generate mock analytics data (in a real app, this would come from actual data)
        generateAnalytics(ordersData || [], productsData || []);
        
        // Check for low stock products (since we don't have a stock field yet, this is simulated)
        // In a real app, you'd have a stock field and check products with stock < 5
        setLowStockProducts(
          productsData
            ?.filter((_, index) => index % 3 === 0) // Just a simulation, every 3rd product is "low stock"
            ?.slice(0, 3) || []
        );
      } catch (error) {
        console.error("Error fetching seller data:", error);
        toast({
          title: "Error",
          description: "Failed to load your seller dashboard. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSellerData();
  }, [user, isSellerVerified, toast]);
  
  // Generate mock analytics data (in a real app, this would be actual data)
  const generateAnalytics = (ordersData: any[], productsData: any[]) => {
    // Daily sales for the past week
    const dailySales = [];
    const categories: Record<string, number> = {};
    const statusCounts: Record<string, number> = { 
      pending: 0, 
      completed: 0, 
      cancelled: 0 
    };
    
    // Get date 7 days ago
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    // Initialize daily sales data
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      dailySales.push({
        date: dateStr,
        sales: 0,
        orders: 0
      });
    }
    
    // Fill in daily sales data from orders
    ordersData.forEach(order => {
      // Count order statuses
      if (order.status) {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      }
      
      // Skip if cancelled
      if (order.status === 'cancelled') return;
      
      // Count category sales
      const category = order.product?.category || 'Other';
      categories[category] = (categories[category] || 0) + Number(order.product?.price || 0);
      
      // Only count orders from the past week
      const orderDate = new Date(order.created_at);
      if (orderDate >= startDate) {
        const dateStr = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayIndex = dailySales.findIndex(d => d.date === dateStr);
        
        if (dayIndex !== -1) {
          dailySales[dayIndex].sales += Number(order.product?.price || 0);
          dailySales[dayIndex].orders += 1;
        }
      }
    });
    
    // Convert categories object to array
    const categorySales = Object.entries(categories).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2))
    }));
    
    // Convert status counts to array
    const orderStatus = Object.entries(statusCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
    
    setAnalytics({
      dailySales,
      categorySales,
      orderStatus
    });
  };
  
  const handleAddProduct = () => {
    navigate('/add-product');
  };
  
  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };
  
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Update the local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      toast({
        title: "Order Updated",
        description: `Order status changed to ${status}.`
      });
      
      // Regenerate analytics
      generateAnalytics(
        orders.map(order => order.id === orderId ? { ...order, status } : order),
        products
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container-custom py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <p>Please sign in to view the seller dashboard.</p>
              <Button onClick={() => navigate('/signin')} className="mt-4">Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  if (!isSellerVerified) {
    return (
      <MainLayout>
        <div className="container-custom py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Seller Account Not Verified</h2>
              <p className="text-muted-foreground mb-4">
                Your seller account is currently pending verification. Once approved, you'll gain access to the seller dashboard.
              </p>
              <Button onClick={() => navigate('/profile')} className="mt-2">
                Go to Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container-custom py-6 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-display font-semibold">Seller Dashboard</h1>
          <Button onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" /> Add New Product
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <h3 className="text-2xl font-bold mt-1">₦{totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-full">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Products</p>
                      <h3 className="text-2xl font-bold mt-1">{products.length}</h3>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Orders</p>
                      <h3 className="text-2xl font-bold mt-1">{orders.length}</h3>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-full">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {orders.length > 0 && products.length > 0 
                          ? `${Math.round((orders.length / (products.length * 3)) * 100)}%` 
                          : '0%'}
                      </h3>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Percent className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your most recent 5 orders</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-r-transparent mx-auto" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-6">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                            {order.product?.images && order.product.images[0] ? (
                              <img
                                src={order.product.images[0]}
                                alt={order.product.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
                                <Package className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{order.product?.title || 'Unknown Product'}</h4>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <span>{new Date(order.created_at).toLocaleDateString()}</span>
                              <span className="mx-1">•</span>
                              <span>₦{Number(order.product?.price || 0).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <Badge 
                          variant="outline"
                          className={
                            order.status === 'completed' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : order.status === 'cancelled' 
                              ? 'bg-red-50 text-red-700 border-red-200' 
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    ))}
                    
                    {orders.length > 5 && (
                      <div className="text-center pt-2">
                        <Button 
                          variant="link" 
                          onClick={() => setActiveTab('orders')}
                          className="text-sm"
                        >
                          View all orders
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    Low Stock Alert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
                                <Package className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{product.title}</h4>
                            <p className="text-xs text-amber-500">
                              Only <strong>2</strong> left in stock
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewProduct(product.id)}
                        >
                          Update
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Your sales performance for the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analytics.dailySales}
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#8884d8" name="Revenue (₦)" />
                      <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Orders</CardTitle>
                <CardDescription>
                  View and update the status of your orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-r-transparent mx-auto" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-2">No orders yet</p>
                    <p className="text-sm text-muted-foreground">
                      Orders will appear here when customers purchase your products.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                              {order.product?.images && order.product.images[0] ? (
                                <img
                                  src={order.product.images[0]}
                                  alt={order.product.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
                                  <Package className="h-8 w-8" />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex-grow">
                            <h3 className="font-medium">{order.product?.title || 'Unknown Product'}</h3>
                            <p className="text-sm text-muted-foreground">
                              ₦{Number(order.product?.price || 0).toLocaleString()}
                            </p>
                            <div className="flex items-center mt-1">
                              <p className="text-xs text-muted-foreground">
                                Order date: {new Date(order.created_at).toLocaleDateString()}
                              </p>
                              <span className="mx-2 text-muted-foreground">•</span>
                              <p className="text-xs text-muted-foreground flex items-center">
                                <span>Buyer: </span>
                                <span className="flex items-center ml-1">
                                  <Avatar className="h-4 w-4 mr-1">
                                    <AvatarFallback>{order.buyer?.username?.[0] || '?'}</AvatarFallback>
                                  </Avatar>
                                  {order.buyer?.username || 'Unknown'}
                                </span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="md:text-right">
                            <Badge 
                              variant="outline"
                              className={
                                order.status === 'completed' 
                                  ? 'bg-green-50 text-green-700 border-green-200' 
                                  : order.status === 'cancelled' 
                                  ? 'bg-red-50 text-red-700 border-red-200' 
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            
                            {order.status === 'pending' && (
                              <div className="flex space-x-2 mt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                >
                                  Complete
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="mt-2"
                              onClick={() => navigate(`/messages?sellerId=${order.buyer?.id}`)}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message Buyer
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Products</CardTitle>
                  <CardDescription>
                    Manage your product listings
                  </CardDescription>
                </div>
                <Button onClick={handleAddProduct}>
                  <Plus className="h-4 w-4 mr-2" /> New Product
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-r-transparent mx-auto" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading products...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-2">No products yet</p>
                    <Button onClick={handleAddProduct} className="mt-2">
                      Add Your First Product
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <div key={product.id} className="border rounded-lg overflow-hidden hover:border-primary transition-colors">
                        <div className="aspect-video bg-muted relative">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
                              <Package className="h-8 w-8" />
                            </div>
                          )}
                          {/* Simulated stock level - would be based on actual data */}
                          {lowStockProducts.some(p => p.id === product.id) && (
                            <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                              Low Stock
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium truncate">{product.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            ₦{Number(product.price).toLocaleString()}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">
                              {product.category}
                            </Badge>
                            <Badge variant="outline">
                              {product.condition}
                            </Badge>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1"
                              onClick={() => handleViewProduct(product.id)}
                            >
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1"
                              onClick={() => navigate(`/edit-product/${product.id}`)}
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.categorySales}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analytics.categorySales.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Revenue']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analytics.orderStatus}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" name="Orders">
                          {analytics.orderStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Daily Sales & Orders</CardTitle>
                <CardDescription>
                  Your sales performance for the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analytics.dailySales}
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip formatter={(value, name) => {
                        if (name === 'sales') return [`₦${Number(value).toLocaleString()}`, 'Revenue'];
                        return [value, 'Orders'];
                      }} />
                      <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#8884d8" name="Revenue" />
                      <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="promotions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Promotion</CardTitle>
                <CardDescription>
                  Offer discounts and special deals on your products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Percent className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-2">Promotions Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    We're working on adding promotions and discount capabilities to help you boost your sales. Stay tuned!
                  </p>
                  <Button variant="outline">Get Notified When Available</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SellerDashboard;
