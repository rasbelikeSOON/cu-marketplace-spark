
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

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
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
    try {
      const products = await productService.getUserProducts();
      setUserProducts(products);
    } catch (error) {
      console.error("Error loading user products:", error);
    }
  };
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
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
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isLoading}
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
              <CardHeader>
                <CardTitle>Your Products</CardTitle>
              </CardHeader>
              <CardContent>
                {userProducts.length === 0 ? (
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
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="h-16 w-16 rounded-md overflow-hidden bg-secondary">
                            {product.images && product.images[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{product.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              ₦{product.price}
                            </p>
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
