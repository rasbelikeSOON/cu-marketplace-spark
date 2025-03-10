
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ArrowRight, 
  CheckCircle, 
  ChevronDown, 
  Users, 
  Package, 
  ShoppingBag, 
  UserCog, 
  XCircle,
  LogOut,
  Home,
  Settings,
  PieChart,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Admin dashboard sidebar
const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => (
  <div className="w-64 bg-card border-r h-screen">
    <div className="p-6">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <p className="text-sm text-muted-foreground">Manage your marketplace</p>
    </div>
    
    <div className="px-3 py-2">
      <h2 className="mb-2 px-4 text-lg font-semibold">Overview</h2>
      <div className="space-y-1">
        <Button
          variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setActiveTab('dashboard')}
        >
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button
          variant={activeTab === 'users' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setActiveTab('users')}
        >
          <Users className="mr-2 h-4 w-4" />
          Users
        </Button>
        <Button
          variant={activeTab === 'products' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setActiveTab('products')}
        >
          <Package className="mr-2 h-4 w-4" />
          Products
        </Button>
        <Button
          variant={activeTab === 'orders' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Orders
        </Button>
        <Button
          variant={activeTab === 'seller-applications' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setActiveTab('seller-applications')}
        >
          <UserCog className="mr-2 h-4 w-4" />
          Seller Applications
        </Button>
      </div>
    </div>
    
    <div className="px-3 py-2 mt-4">
      <h2 className="mb-2 px-4 text-lg font-semibold">System</h2>
      <div className="space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  </div>
);

// Header component
const Header = ({ title, subtitle }: { title: string, subtitle: string }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/admin-login');
  };
  
  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleSignOut}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

// Statistics Card
const StatCard = ({ title, value, icon, description, trend }: { 
  title: string, 
  value: string, 
  icon: React.ReactNode,
  description?: string,
  trend?: { value: string, direction: 'up' | 'down' }
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {trend && (
        <div className={`text-xs flex items-center mt-1 ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          <span>{trend.value}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if not an admin
  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have administrative privileges.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAdmin, navigate, toast]);
  
  // Fetch users
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });
  
  // Fetch products
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:profiles(id, username, avatar_url)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });
  
  // Fetch seller applications
  const { data: sellerApplications = [], isLoading: isLoadingApplications } = useQuery({
    queryKey: ['seller-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_verified_seller', false)
        .not('matric_number', 'is', null)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });
  
  const handleApproveSellerApplication = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified_seller: true })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast({
        title: "Seller Approved",
        description: "The user can now sell products on the marketplace.",
      });
      
      // Refetch data
      // In a production app, we would invalidate the query cache
    } catch (error) {
      console.error("Error approving seller:", error);
      toast({
        title: "Error",
        description: "Failed to approve seller. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRejectSellerApplication = async (userId: string) => {
    try {
      // In a real app, you might want to send a notification to the user
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified_seller: false })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast({
        title: "Application Rejected",
        description: "The seller application has been rejected.",
      });
      
      // Refetch data
      // In a production app, we would invalidate the query cache
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
          subtitle={`Manage ${activeTab} for CU Marketplace`} 
        />
        
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                  title="Total Users" 
                  value={users.length.toString()} 
                  icon={<Users className="h-4 w-4 text-muted-foreground" />} 
                  description="Total registered users"
                />
                <StatCard 
                  title="Products" 
                  value={products.length.toString()} 
                  icon={<Package className="h-4 w-4 text-muted-foreground" />} 
                  description="Total products listed"
                />
                <StatCard 
                  title="Sellers" 
                  value={users.filter(u => u.is_verified_seller).length.toString()} 
                  icon={<UserCog className="h-4 w-4 text-muted-foreground" />} 
                  description="Verified sellers"
                />
                <StatCard 
                  title="Pending Applications" 
                  value={sellerApplications.length.toString()} 
                  icon={<Calendar className="h-4 w-4 text-muted-foreground" />} 
                  description="Waiting for approval"
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Seller</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.slice(0, 5).map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.title}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>₦{product.price.toLocaleString()}</TableCell>
                            <TableCell>{product.seller?.username || 'Unknown'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="ml-auto" onClick={() => setActiveTab('products')}>
                      View all
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>New Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {users.slice(0, 5).map((user) => (
                        <div key={user.id} className="flex items-center">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar_url || ''} alt="Avatar" />
                            <AvatarFallback>
                              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{user.username || 'Anonymous'}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {user.is_verified_seller && (
                            <div className="ml-auto font-medium">
                              <Badge>Seller</Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="ml-auto" onClick={() => setActiveTab('users')}>
                      View all
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
          
          {activeTab === 'users' && (
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-r-transparent mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading users...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar_url || ''} alt="Avatar" />
                                <AvatarFallback>
                                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{user.nickname || user.username || 'Anonymous'}</div>
                            </div>
                          </TableCell>
                          <TableCell>{user.username || 'N/A'}</TableCell>
                          <TableCell>{user.hall ? `${user.hall} - ${user.room_number}` : 'N/A'}</TableCell>
                          <TableCell>
                            {user.is_admin ? (
                              <Badge variant="default">Admin</Badge>
                            ) : user.is_verified_seller ? (
                              <Badge variant="outline">Seller</Badge>
                            ) : (
                              <Badge variant="secondary">Buyer</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">View Details</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'products' && (
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>View and manage all products on the marketplace</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingProducts ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-r-transparent mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading products...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Seller</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                                <img 
                                  src={product.images ? product.images[0] : '/placeholder.svg'} 
                                  alt={product.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="font-medium">{product.title}</div>
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>₦{product.price.toLocaleString()}</TableCell>
                          <TableCell>{product.seller?.username || 'Unknown'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'seller-applications' && (
            <Card>
              <CardHeader>
                <CardTitle>Seller Applications</CardTitle>
                <CardDescription>Review and manage seller applications</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingApplications ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-r-transparent mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading applications...</p>
                  </div>
                ) : sellerApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No pending seller applications</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Matric Number</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Date Applied</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sellerApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={application.avatar_url || ''} alt="Avatar" />
                                <AvatarFallback>
                                  {application.username ? application.username.charAt(0).toUpperCase() : 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{application.username || 'Anonymous'}</div>
                            </div>
                          </TableCell>
                          <TableCell>{application.matric_number || 'N/A'}</TableCell>
                          <TableCell>
                            {application.hall && application.room_number
                              ? `${application.hall} - ${application.room_number}`
                              : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {application.phone_number || application.telegram_username || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {new Date(application.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-green-500 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApproveSellerApplication(application.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRejectSellerApplication(application.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'orders' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">Order Management</h2>
              <p className="text-muted-foreground mb-6">
                This feature is coming soon. You'll be able to track and manage all orders.
              </p>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">System Settings</h2>
              <p className="text-muted-foreground mb-6">
                This feature is coming soon. You'll be able to configure marketplace settings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
