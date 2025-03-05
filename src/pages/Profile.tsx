
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
import { Pencil, Trash2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
  const { user, profile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
    }
    
    // Load user's products
    if (user) {
      loadUserProducts();
    }
  }, [profile, user]);
  
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
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsUpdatingProfile(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', user.id);
      
      if (error) throw error;
      
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
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
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
                  <div className="space-y-4">
                    <div>
                      <Label>Email</Label>
                      <p className="mt-1 text-muted-foreground">{user.email}</p>
                    </div>
                    <div>
                      <Label>Username</Label>
                      <p className="mt-1 text-muted-foreground">
                        {profile?.username || "Not set"}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
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
          </div>
          
          <div className="md:col-span-2">
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
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
