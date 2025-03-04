
import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../components/ui-components/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Package, Heart, Settings, Clock, LogOut, ShoppingBag } from "lucide-react";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");

  // Mock data for orders
  const orders = [
    {
      id: "ORD-001",
      date: "2023-10-15",
      items: 2,
      total: 13500,
      status: "Delivered",
    },
    {
      id: "ORD-002",
      date: "2023-10-10",
      items: 1,
      total: 5000,
      status: "Processing",
    },
    {
      id: "ORD-003",
      date: "2023-09-28",
      items: 3,
      total: 25000,
      status: "Cancelled",
    },
  ];

  // Mock data for wishlist
  const wishlistItems = [
    {
      id: 3,
      title: "Covenant University Hoodie",
      price: 8500,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    },
    {
      id: 7,
      title: "Scientific Calculator",
      price: 7500,
      image: "https://images.unsplash.com/photo-1564473185935-58113cba1e80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    },
  ];

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
                  <p className="text-sm text-muted-foreground">Computer Science, 300L</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab("orders")} 
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left ${activeTab === "orders" ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}
                >
                  <Package size={18} />
                  <span>My Orders</span>
                </button>
                <button 
                  onClick={() => setActiveTab("wishlist")} 
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left ${activeTab === "wishlist" ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}
                >
                  <Heart size={18} />
                  <span>Wishlist</span>
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
                <Link to="/seller-dashboard">
                  <button className="w-full flex items-center justify-center space-x-2 p-2 bg-primary/10 text-primary rounded-lg mb-2">
                    <ShoppingBag size={18} />
                    <span>Switch to Seller</span>
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
            {activeTab === "orders" && (
              <div>
                <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
                
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-base">{order.id}</CardTitle>
                            <CardDescription>Placed on {order.date}</CardDescription>
                          </div>
                          <Badge className={
                            order.status === "Delivered" ? "bg-green-100 text-green-800" : 
                            order.status === "Processing" ? "bg-blue-100 text-blue-800" : 
                            "bg-red-100 text-red-800"
                          }>
                            {order.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Clock size={16} className="mr-1 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{order.items} item{order.items > 1 ? "s" : ""}</span>
                          </div>
                          <div className="space-x-3">
                            <span className="font-medium">₦{order.total.toLocaleString()}</span>
                            <Link to={`/order/${order.id}`}>
                              <Button size="sm" variant="outline">View Order</Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === "wishlist" && (
              <div>
                <h1 className="text-2xl font-semibold mb-6">My Wishlist</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlistItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="flex h-full">
                        <div className="w-1/3">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="w-2/3 p-4">
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-primary font-medium mt-2">₦{item.price.toLocaleString()}</p>
                          <div className="flex space-x-2 mt-4">
                            <Button size="sm">Add to Cart</Button>
                            <Button size="sm" variant="outline">
                              <Heart size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === "settings" && (
              <div>
                <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">First Name</label>
                          <input 
                            type="text" 
                            defaultValue="David" 
                            className="w-full border border-input px-3 py-2 rounded-md"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Last Name</label>
                          <input 
                            type="text" 
                            defaultValue="Miller" 
                            className="w-full border border-input px-3 py-2 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <input 
                          type="email" 
                          defaultValue="david.m@stu.cu.edu.ng" 
                          className="w-full border border-input px-3 py-2 rounded-md"
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">Your email cannot be changed</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Department</label>
                        <select className="w-full border border-input px-3 py-2 rounded-md">
                          <option>Computer Science</option>
                          <option>Mechanical Engineering</option>
                          <option>Electrical Engineering</option>
                          <option>Architecture</option>
                          <option>Economics</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Level</label>
                        <select className="w-full border border-input px-3 py-2 rounded-md">
                          <option>100 Level</option>
                          <option>200 Level</option>
                          <option selected>300 Level</option>
                          <option>400 Level</option>
                          <option>500 Level</option>
                        </select>
                      </div>
                      
                      <Button>Save Changes</Button>
                    </form>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Current Password</label>
                        <input 
                          type="password" 
                          className="w-full border border-input px-3 py-2 rounded-md"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">New Password</label>
                        <input 
                          type="password" 
                          className="w-full border border-input px-3 py-2 rounded-md"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm New Password</label>
                        <input 
                          type="password" 
                          className="w-full border border-input px-3 py-2 rounded-md"
                        />
                      </div>
                      
                      <Button>Update Password</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserDashboard;
