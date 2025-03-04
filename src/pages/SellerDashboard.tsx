
import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../components/ui-components/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Package, PlusCircle, DollarSign, ShoppingCart, Settings, LogOut, Tag, Clock, ChevronRight, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("listings");
  const { toast } = useToast();

  // Mock data for products
  const products = [
    {
      id: 1,
      title: "MacBook Pro 2022",
      price: 450000,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1026&q=80",
      status: "Active",
      views: 125,
      likes: 18,
      dateAdded: "2023-09-15",
    },
    {
      id: 5,
      title: "Graphic Design Services",
      price: 15000,
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
      status: "Active",
      views: 87,
      likes: 32,
      dateAdded: "2023-09-02",
    },
  ];

  // Mock data for orders
  const orders = [
    {
      id: "ORD-001",
      date: "2023-10-15",
      product: "MacBook Pro 2022",
      buyer: "Sarah Adams",
      amount: 450000,
      status: "Completed",
    },
    {
      id: "ORD-003",
      date: "2023-10-08",
      product: "Graphic Design Services",
      buyer: "Emmanuel Tech",
      amount: 15000,
      status: "Processing",
    },
  ];

  const handleDeleteProduct = (id: number) => {
    toast({
      title: "Product deleted",
      description: "The product has been removed from your listings.",
    });
  };

  return (
    <MainLayout>
      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-subtle p-6 mb-6">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" />
                  <AvatarFallback>DM</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">David Miller</h2>
                  <p className="text-sm text-muted-foreground">Seller Account</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-6">
                <Card className="p-3">
                  <div className="text-xs text-muted-foreground">Products</div>
                  <div className="font-semibold text-lg">2</div>
                </Card>
                <Card className="p-3">
                  <div className="text-xs text-muted-foreground">Sales</div>
                  <div className="font-semibold text-lg">₦465K</div>
                </Card>
              </div>
              
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab("listings")} 
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left ${activeTab === "listings" ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}
                >
                  <Tag size={18} />
                  <span>My Listings</span>
                </button>
                <button 
                  onClick={() => setActiveTab("orders")} 
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left ${activeTab === "orders" ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}
                >
                  <ShoppingCart size={18} />
                  <span>Orders</span>
                </button>
                <button 
                  onClick={() => setActiveTab("earnings")} 
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left ${activeTab === "earnings" ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}
                >
                  <DollarSign size={18} />
                  <span>Earnings</span>
                </button>
                <button 
                  onClick={() => setActiveTab("settings")} 
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left ${activeTab === "settings" ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
              </nav>
              
              <div className="mt-6 pt-6 border-t border-border">
                <Link to="/user-dashboard">
                  <button className="w-full flex items-center justify-center space-x-2 p-2 bg-primary/10 text-primary rounded-lg mb-2">
                    <User size={18} />
                    <span>Switch to Buyer</span>
                  </button>
                </Link>
                <button className="w-full flex items-center space-x-2 p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "listings" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-semibold">My Listings</h1>
                  <Link to="/add-product">
                    <Button>
                      <PlusCircle size={16} className="mr-2" />
                      Add New Product
                    </Button>
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/4 h-48 md:h-auto">
                          <img 
                            src={product.image} 
                            alt={product.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex justify-between">
                            <h3 className="font-semibold text-lg">{product.title}</h3>
                            <Badge className="bg-green-100 text-green-800">{product.status}</Badge>
                          </div>
                          <p className="text-primary font-medium mt-2">₦{product.price.toLocaleString()}</p>
                          
                          <div className="flex items-center space-x-6 mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              <span>Added {product.dateAdded}</span>
                            </div>
                            <div>
                              <span>{product.views} views</span>
                            </div>
                            <div>
                              <span>{product.likes} likes</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 mt-6">
                            <Button variant="outline" size="sm">
                              <Edit size={14} className="mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500 border-red-200 hover:bg-red-50"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 size={14} className="mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
            
            {activeTab === "orders" && (
              <>
                <h1 className="text-2xl font-semibold mb-6">Orders</h1>
                
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-base">{order.id}</CardTitle>
                            <CardDescription>Ordered on {order.date}</CardDescription>
                          </div>
                          <Badge className={
                            order.status === "Completed" ? "bg-green-100 text-green-800" : 
                            "bg-blue-100 text-blue-800"
                          }>
                            {order.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Product:</span>
                            <span>{order.product}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Buyer:</span>
                            <span>{order.buyer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Amount:</span>
                            <span className="font-medium">₦{order.amount.toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-secondary/50 flex justify-end">
                        <Button size="sm" variant="outline">View Details</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </>
            )}
            
            {activeTab === "earnings" && (
              <>
                <h1 className="text-2xl font-semibold mb-6">Earnings</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Card className="p-6">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-green-100 rounded-full">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-sm text-muted-foreground">Total Earnings</div>
                    </div>
                    <div className="mt-3 text-2xl font-semibold">₦465,000</div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-sm text-muted-foreground">Total Sales</div>
                    </div>
                    <div className="mt-3 text-2xl font-semibold">2</div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <User className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-sm text-muted-foreground">Active Listings</div>
                    </div>
                    <div className="mt-3 text-2xl font-semibold">2</div>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Earnings History</CardTitle>
                    <CardDescription>View your recent transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <div>
                          <div className="font-medium">MacBook Pro 2022</div>
                          <div className="text-sm text-muted-foreground">Oct 15, 2023</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">+₦450,000</div>
                          <div className="text-xs text-muted-foreground">From Sarah Adams</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <div>
                          <div className="font-medium">Graphic Design Services</div>
                          <div className="text-sm text-muted-foreground">Oct 8, 2023</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">+₦15,000</div>
                          <div className="text-xs text-muted-foreground">From Emmanuel Tech</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            
            {activeTab === "settings" && (
              <>
                <h1 className="text-2xl font-semibold mb-6">Seller Settings</h1>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Seller Profile</CardTitle>
                    <CardDescription>Manage your seller information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="shop-name">Display Name / Shop Name</Label>
                        <Input id="shop-name" defaultValue="David's Tech Hub" />
                        <p className="text-xs text-muted-foreground">This is how your name will appear to buyers</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio / Description</Label>
                        <textarea 
                          id="bio" 
                          rows={4}
                          className="w-full border border-input rounded-md p-3 text-sm"
                          defaultValue="CS student selling quality tech products and offering design services at affordable prices for students."
                        ></textarea>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contact-number">Contact Number</Label>
                        <Input id="contact-number" defaultValue="080XXXXXXXX" />
                      </div>
                      
                      <Button>Save Profile</Button>
                    </form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Settings</CardTitle>
                    <CardDescription>Manage your preferred payment methods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="account-name">Account Name</Label>
                        <Input id="account-name" defaultValue="David Miller" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bank-name">Bank Name</Label>
                        <select 
                          id="bank-name" 
                          className="w-full border border-input rounded-md p-2 h-10"
                        >
                          <option>Access Bank</option>
                          <option>Guaranty Trust Bank</option>
                          <option selected>First Bank</option>
                          <option>Zenith Bank</option>
                          <option>United Bank for Africa</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="account-number">Account Number</Label>
                        <Input id="account-number" defaultValue="012345678X" />
                      </div>
                      
                      <Button>Save Payment Details</Button>
                    </form>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SellerDashboard;
