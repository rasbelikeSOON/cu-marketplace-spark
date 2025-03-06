
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../components/ui-components/Button";
import { Eye, EyeOff, Mail, Lock, User, Phone, MessageCircle, School, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    phone_number: "",
    telegram_username: "",
    matric_number: "",
    hall: "",
    room_number: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithMagicLink, user } = useAuth();
  
  // Check if we should show signup form based on URL
  useEffect(() => {
    setIsSignUp(location.pathname === "/signup");
  }, [location.pathname]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!useMagicLink) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }
    
    if (isSignUp && !formData.username) {
      newErrors.username = "Username is required";
    }
    
    if (isSignUp && isSeller) {
      if (!formData.phone_number) {
        newErrors.phone_number = "Phone number is required for sellers";
      }
      if (!formData.telegram_username) {
        newErrors.telegram_username = "Telegram username is required for sellers";
      }
      if (!formData.matric_number) {
        newErrors.matric_number = "Matric number is required for sellers";
      }
      if (!formData.hall) {
        newErrors.hall = "Hall is required for sellers";
      }
      if (!formData.room_number) {
        newErrors.room_number = "Room number is required for sellers";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (useMagicLink) {
        // Sign in with magic link
        const { error, data } = await signInWithMagicLink(formData.email);
        
        if (error) throw error;
        
        setEmailSent(true);
        
        toast({
          title: "Check your email",
          description: "We've sent you a magic link to sign in.",
        });
      } else if (isSignUp) {
        // Sign up with additional seller data if applicable
        const userData = {
          username: formData.username,
          is_seller: isSeller,
        };
        
        if (isSeller) {
          Object.assign(userData, {
            phone_number: formData.phone_number,
            telegram_username: formData.telegram_username,
            matric_number: formData.matric_number,
            hall: formData.hall,
            room_number: formData.room_number,
          });
        }
        
        const { error, data } = await signUp(
          formData.email, 
          formData.password,
          userData
        );
        
        if (error) throw error;
        
        setEmailSent(true);
        
        toast({
          title: "Check your email",
          description: "Please check your email for a confirmation link to complete your registration.",
        });
      } else {
        // Sign in
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    navigate(isSignUp ? "/signin" : "/signup");
    // Reset errors and email sent status when toggling
    setErrors({});
    setEmailSent(false);
    setUseMagicLink(false);
  };
  
  if (emailSent) {
    return (
      <MainLayout>
        <div className="container-custom py-12 md:py-20">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-subtle p-8 text-center">
              <Mail className="w-16 h-16 mx-auto text-primary" />
              <h1 className="text-2xl font-display font-semibold mt-4">Check your email</h1>
              <p className="mt-4 text-muted-foreground">
                We've sent a {isSignUp ? "confirmation link" : "magic link"} to <span className="font-medium">{formData.email}</span>
              </p>
              <p className="mt-2 text-muted-foreground">
                {isSignUp 
                  ? "Please click the link in the email to verify your account."
                  : "Click the link in the email to sign in to your account."}
              </p>
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setEmailSent(false)}
                  className="w-full"
                >
                  Back to {isSignUp ? "sign up" : "sign in"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container-custom py-12 md:py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-display font-semibold">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isSignUp
                ? "Join the exclusive marketplace for Covenant University students"
                : "Sign in to your CU Marketplace account"}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-subtle p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className={`pl-10 ${errors.username ? "border-destructive" : ""}`}
                        placeholder="johndoe"
                        autoComplete="username"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    {errors.username && (
                      <p className="text-destructive text-sm">{errors.username}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="is_seller" 
                      checked={isSeller} 
                      onCheckedChange={(checked) => setIsSeller(checked === true)}
                    />
                    <Label htmlFor="is_seller" className="text-sm font-medium">
                      Register as a seller (requires verification)
                    </Label>
                  </div>
                  
                  {isSeller && (
                    <div className="space-y-4 bg-muted p-4 rounded-lg mt-4">
                      <h3 className="text-sm font-medium">Seller Information</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <div className="relative">
                          <Input
                            id="phone_number"
                            name="phone_number"
                            type="text"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className={`pl-10 ${errors.phone_number ? "border-destructive" : ""}`}
                            placeholder="+234 800 000 0000"
                          />
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                        {errors.phone_number && (
                          <p className="text-destructive text-sm">{errors.phone_number}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="telegram_username">Telegram Username</Label>
                        <div className="relative">
                          <Input
                            id="telegram_username"
                            name="telegram_username"
                            type="text"
                            value={formData.telegram_username}
                            onChange={handleChange}
                            className={`pl-10 ${errors.telegram_username ? "border-destructive" : ""}`}
                            placeholder="@username"
                          />
                          <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                        {errors.telegram_username && (
                          <p className="text-destructive text-sm">{errors.telegram_username}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="matric_number">Matric Number</Label>
                        <div className="relative">
                          <Input
                            id="matric_number"
                            name="matric_number"
                            type="text"
                            value={formData.matric_number}
                            onChange={handleChange}
                            className={`pl-10 ${errors.matric_number ? "border-destructive" : ""}`}
                            placeholder="19/0000"
                          />
                          <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                        {errors.matric_number && (
                          <p className="text-destructive text-sm">{errors.matric_number}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="hall">Hall</Label>
                          <div className="relative">
                            <Input
                              id="hall"
                              name="hall"
                              type="text"
                              value={formData.hall}
                              onChange={handleChange}
                              className={`pl-10 ${errors.hall ? "border-destructive" : ""}`}
                              placeholder="Daniel Hall"
                            />
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          </div>
                          {errors.hall && (
                            <p className="text-destructive text-sm">{errors.hall}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="room_number">Room Number</Label>
                          <div className="relative">
                            <Input
                              id="room_number"
                              name="room_number"
                              type="text"
                              value={formData.room_number}
                              onChange={handleChange}
                              className={`${errors.room_number ? "border-destructive" : ""}`}
                              placeholder="A101"
                            />
                          </div>
                          {errors.room_number && (
                            <p className="text-destructive text-sm">{errors.room_number}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email}</p>
                )}
              </div>
              
              {!useMagicLink && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    {!isSignUp && (
                      <a
                        href="#"
                        className="text-xs text-primary hover:underline"
                        onClick={(e) => e.preventDefault()}
                      >
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                      placeholder={isSignUp ? "Create a password" : "Enter your password"}
                      autoComplete={isSignUp ? "new-password" : "current-password"}
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-destructive text-sm">{errors.password}</p>
                  )}
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2">
                      {isSignUp ? "Creating Account..." : useMagicLink ? "Sending Link..." : "Signing In..."}
                    </span>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent" />
                  </>
                ) : (
                  isSignUp ? "Create Account" : useMagicLink ? "Send Magic Link" : "Sign In"
                )}
              </Button>
            </form>
            
            {!isSignUp && (
              <>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setUseMagicLink(!useMagicLink)}
                    >
                      {useMagicLink ? "Use Password" : "Use Magic Link"}
                    </Button>
                  </div>
                </div>
              </>
            )}
            
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="ml-1 text-primary hover:underline font-medium"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Auth;
