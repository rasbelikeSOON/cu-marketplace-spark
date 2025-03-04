
import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "../components/ui-components/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  MessageCircle,
  Bell,
  LogOut,
  ArrowUpRight
} from "lucide-react";
import { products, users } from "../data/mockData";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  // Summary data
  const summaryData = {
    totalUsers: 1247,
    activeProducts: 842,
    pendingProducts: 38,
    totalTransactions: 326,
    revenue: 4850000,
  };
  
  // Pending products that need approval
  const pendingProducts = [
    {
      id: 101,
      title: "Apple AirPods Pro",
      seller: "James Wilson",
      category: "Electronics",
      dateSubmitted: "2023-10-20",
      image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=683&q=80",
    },
    {
      id: 102,
      title: "Psychology 101 Textbook",
      seller: "Grace Adams",
      category: "Textbooks",
      dateSubmitted: "2023-10-19",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    },
  ];
  
  // Recent reports/flags
  const reports = [
    {
      id: 1,
      productId: 7,
      productTitle: "Scientific Calculator",
      reporter: "Michelle Okafor",
      reason: "Item not as described",
      date: "2023-10-18",
    },
    {
      id: 2,
      productId: 12,
      productTitle: "Academic Writing Services",
      reporter: "John Adeyemi",
      reason: "Suspected academic dishonesty",
      date: "2023-10-17",
    },
  ];
  
  const handleApproveProduct = (id) => {
    toast({
      title: "Product approved",
      description: "The product has been published to the marketplace.",
    });
  };
  
  const handleRejectProduct = (id) => {
    toast({
      title: "Product rejected",
      description: "The seller has been notified about the rejection.",
    });
  };
  
  const handleResolveReport = (id) => {
    toast({
      title: "Report resolved",
      description: "The report has been marked as resolved.",
    });
  };
  
  return (
    <MainLayout>
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-subtle p-6 mb-6">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80" />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">Sarah Adams</h2>
                  <div className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded mt-1">
                    Admin
                  </div>
                </div>
              </div>
              
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab("overview")} 
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left ${activeTab === "overview" ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}
                >
                  <BarChart3 size={18} />
                  <span>Overview</span>
                </button>
                <button 
                  onClick={() => setActiveTab("users")} 
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left ${activeTab === "users" ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}
                >
                  <Users size={18} />
                  <span>User Management</span>
                </button>
                <button 
                  onClick={() => setActiveTab("products")} 
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left ${activeTab === "products" ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}
                >
                  <ShoppingBag size={18} />
                  <span>Product Moderation</span>
                </button>
                <button 
                  onClick={() => setActiveTab("reports")} 
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left ${activeTab === "reports" ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}
                >
                  <AlertTriangle size={18} />
                  <span>Reports & Flags</span>
                  {reports.length > 0 && (
                    <Badge className="ml-auto bg-red-500">{reports.length}</Badge>
                  )}
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
                <button className="w-full flex items-center space-x-2 p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
            
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Bell className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 text-sm">New Notifications</h4>
                    <p className="text-xs text-amber-700 mt-1">You have {pendingProducts.length} products awaiting approval and {reports.length} unresolved reports.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <>
                <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Users</p>
                          <h3 className="text-2xl font-semibold mt-1">{summaryData.totalUsers}</h3>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Active Products</p>
                          <h3 className="text-2xl font-semibold mt-1">{summaryData.activeProducts}</h3>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                          <ShoppingBag className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Pending Approval</p>
                          <h3 className="text-2xl font-semibold mt-1">{summaryData.pendingProducts}</h3>
                        </div>
                        <div className="p-3 bg-amber-100 rounded-full">
                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Revenue</p>
                          <h3 className="text-2xl font-semibold mt-1">₦{(summaryData.revenue / 1000).toFixed(0)}K</h3>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                          <BarChart3 className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Users</CardTitle>
                      <CardDescription>Most recently registered users</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {users.map(user => (
                          <div key={user.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                            <div className="text-sm text-right">
                              <div>{user.department}</div>
                              <div className="text-muted-foreground">{user.level}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 text-center">
                        <Button variant="link" className="text-sm" onClick={() => setActiveTab("users")}>
                          View All Users
                          <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Products Awaiting Approval</CardTitle>
                      <CardDescription>Recently submitted products that need review</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {pendingProducts.map(product => (
                          <div key={product.id} className="flex space-x-4">
                            <div className="h-16 w-16 rounded-md overflow-hidden">
                              <img 
                                src={product.image} 
                                alt={product.title} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{product.title}</div>
                              <div className="text-sm text-muted-foreground">{product.seller} • {product.category}</div>
                              <div className="mt-2 flex space-x-2">
                                <Button size="sm" variant="outline" className="h-8" onClick={() => handleApproveProduct(product.id)}>
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleRejectProduct(product.id)}>
                                  <XCircle className="mr-1 h-3 w-3" />
                                  Reject
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 px-2">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 text-center">
                        <Button variant="link" className="text-sm" onClick={() => setActiveTab("products")}>
                          View All Pending Products
                          <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            
            {activeTab === "users" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-semibold">User Management</h1>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search users..." 
                      className="pl-9 w-[250px]"
                    />
                  </div>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-4 font-medium">Name</th>
                            <th className="text-left p-4 font-medium">Email</th>
                            <th className="text-left p-4 font-medium">Department</th>
                            <th className="text-left p-4 font-medium">Level</th>
                            <th className="text-left p-4 font-medium">Joined</th>
                            <th className="text-right p-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...users, ...users].map((user, index) => (
                            <tr key={`${user.id}-${index}`} className="border-b border-border last:border-0">
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{user.name}</span>
                                </div>
                              </td>
                              <td className="p-4">{user.email}</td>
                              <td className="p-4">{user.department}</td>
                              <td className="p-4">{user.level}</td>
                              <td className="p-4">{user.joinDate}</td>
                              <td className="p-4 text-right">
                                <div className="space-x-2">
                                  <Button size="sm" variant="ghost" className="h-8">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8">
                                    <MessageCircle className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <AlertTriangle className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            
            {activeTab === "products" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-semibold">Product Moderation</h1>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search products..." 
                      className="pl-9 w-[250px]"
                    />
                  </div>
                </div>
                
                <Tabs defaultValue="pending">
                  <TabsList className="mb-6">
                    <TabsTrigger value="pending">
                      Pending Approval
                      <Badge className="ml-2 bg-amber-500">{pendingProducts.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="pending">
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          {pendingProducts.map(product => (
                            <div key={product.id} className="flex flex-col md:flex-row gap-4 border-b border-border pb-6 last:border-0 last:pb-0">
                              <div className="w-full md:w-32 h-24 rounded-md overflow-hidden">
                                <img 
                                  src={product.image} 
                                  alt={product.title} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                                  <div>
                                    <h3 className="font-medium">{product.title}</h3>
                                    <div className="text-sm text-muted-foreground">Submitted by {product.seller} on {product.dateSubmitted}</div>
                                    <div className="mt-1">
                                      <Badge variant="outline">{product.category}</Badge>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2 mt-4 md:mt-0">
                                    <Button size="sm" onClick={() => handleApproveProduct(product.id)}>
                                      <CheckCircle className="mr-1 h-4 w-4" />
                                      Approve
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleRejectProduct(product.id)}>
                                      <XCircle className="mr-1 h-4 w-4" />
                                      Reject
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <Eye className="mr-1 h-4 w-4" />
                                      View
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="approved">
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          {products.slice(0, 3).map(product => (
                            <div key={product.id} className="flex flex-col md:flex-row gap-4 border-b border-border pb-6 last:border-0 last:pb-0">
                              <div className="w-full md:w-32 h-24 rounded-md overflow-hidden">
                                <img 
                                  src={product.image} 
                                  alt={product.title} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                                  <div>
                                    <h3 className="font-medium">{product.title}</h3>
                                    <div className="text-sm text-muted-foreground">Added by {product.sellerName} on {product.postedDate}</div>
                                    <div className="mt-1">
                                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                                      <Badge variant="outline" className="ml-2">{product.category}</Badge>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2 mt-4 md:mt-0">
                                    <Button size="sm" variant="outline">
                                      <Eye className="mr-1 h-4 w-4" />
                                      View
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                                      <AlertTriangle className="mr-1 h-4 w-4" />
                                      Flag
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="rejected">
                    <Card>
                      <CardContent className="p-6 text-center py-12">
                        <div className="inline-block p-3 bg-secondary rounded-full mb-4">
                          <XCircle className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No Rejected Products</h3>
                        <p className="text-muted-foreground mt-1">
                          There are currently no rejected products to display.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
            
            {activeTab === "reports" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-semibold">Reports & Flags</h1>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Reported Items</CardTitle>
                    <CardDescription>Products that have been flagged by users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {reports.map(report => (
                        <div key={report.id} className="flex flex-col md:flex-row gap-4 border-b border-border pb-6 last:border-0 last:pb-0">
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                              <div>
                                <h3 className="font-medium">{report.productTitle}</h3>
                                <div className="text-sm text-muted-foreground">
                                  Reported by {report.reporter} on {report.date}
                                </div>
                                <div className="mt-2">
                                  <Badge className="bg-red-100 text-red-800">{report.reason}</Badge>
                                </div>
                              </div>
                              <div className="flex space-x-2 mt-4 md:mt-0">
                                <Button size="sm" onClick={() => handleResolveReport(report.id)}>
                                  <CheckCircle className="mr-1 h-4 w-4" />
                                  Resolve
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="mr-1 h-4 w-4" />
                                  View Product
                                </Button>
                                <Button size="sm" variant="outline">
                                  <MessageCircle className="mr-1 h-4 w-4" />
                                  Contact User
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {reports.length === 0 && (
                        <div className="text-center py-8">
                          <div className="inline-block p-3 bg-secondary rounded-full mb-4">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          </div>
                          <h3 className="text-lg font-medium">No Active Reports</h3>
                          <p className="text-muted-foreground mt-1">
                            There are currently no active reports to review.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            
            {activeTab === "settings" && (
              <>
                <h1 className="text-2xl font-semibold mb-6">Admin Settings</h1>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Marketplace Settings</CardTitle>
                    <CardDescription>Configure the marketplace parameters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="service-fee">Service Fee (%)</Label>
                        <Input id="service-fee" type="number" defaultValue="2" min="0" max="10" step="0.5" />
                        <p className="text-xs text-muted-foreground">
                          Percentage charged on each transaction as a service fee.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="max-price">Maximum Product Price (₦)</Label>
                        <Input id="max-price" type="number" defaultValue="500000" />
                        <p className="text-xs text-muted-foreground">
                          Maximum allowed price for products on the marketplace.
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="auto-approve" className="rounded border-gray-300" defaultChecked={false} />
                        <Label htmlFor="auto-approve">Auto-approve new product listings</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="email-notifications" className="rounded border-gray-300" defaultChecked={true} />
                        <Label htmlFor="email-notifications">Send email notifications for new reports</Label>
                      </div>
                      
                      <Button>Save Settings</Button>
                    </form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Telegram Integration</CardTitle>
                    <CardDescription>Configure Telegram bot for automated notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bot-token">Telegram Bot Token</Label>
                        <Input id="bot-token" type="password" placeholder="Enter your bot token" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="chat-id">Chat ID</Label>
                        <Input id="chat-id" placeholder="Enter chat ID for notifications" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Notify On</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="notify-new-product" className="rounded border-gray-300" defaultChecked={true} />
                            <Label htmlFor="notify-new-product">New product listings</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="notify-new-user" className="rounded border-gray-300" defaultChecked={true} />
                            <Label htmlFor="notify-new-user">New user registrations</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="notify-reports" className="rounded border-gray-300" defaultChecked={true} />
                            <Label htmlFor="notify-reports">New reports/flags</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="notify-sales" className="rounded border-gray-300" defaultChecked={true} />
                            <Label htmlFor="notify-sales">New sales/transactions</Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 flex space-x-3">
                        <Button>Connect Bot</Button>
                        <Button variant="outline">Test Connection</Button>
                      </div>
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

export default AdminDashboard;
