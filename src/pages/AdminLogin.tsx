
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) throw error;
      
      // Check if user is an admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();
      
      if (profileError) throw profileError;
      
      if (!profile.is_admin) {
        await supabase.auth.signOut();
        throw new Error('You do not have admin privileges');
      }
      
      toast({
        title: "Admin login successful",
        description: "You're now signed in as an administrator.",
      });
      
      navigate('/admin-dashboard');
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="max-w-md w-full">
        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold">Admin Login</CardTitle>
            <CardDescription>
              Sign in to access the administrator dashboard
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@covenant.edu.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-transparent mr-2" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In as Admin
                  </div>
                )}
              </Button>
            </CardFooter>
          </form>
          
          <div className="p-4 pt-0 text-center">
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Lock className="h-3 w-3 mr-1" />
              Only authorized personnel
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
