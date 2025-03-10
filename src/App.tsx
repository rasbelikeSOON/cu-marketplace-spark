
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AIAssistant from "./components/ui-components/AIAssistant";
import Index from "./pages/Index";

// Use React.lazy for non-essential pages
const Products = React.lazy(() => import("./pages/Products"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const AddProduct = React.lazy(() => import("./pages/AddProduct"));
const ShoppingCart = React.lazy(() => import("./pages/ShoppingCart"));
const Profile = React.lazy(() => import("./pages/Profile"));
const SellerDashboard = React.lazy(() => import("./pages/SellerDashboard"));
const Messages = React.lazy(() => import("./pages/Messages"));
const NotificationSettings = React.lazy(() => import("./pages/NotificationSettings"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
const AdminLogin = React.lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));

// Create an AdminRoute component to check for admin privileges
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const AdminProtectedRoute = () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </ProtectedRoute>
  );
  
  return <AdminProtectedRoute />;
};

// Create a Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[70vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-r-transparent"></div>
  </div>
);

// Initialize QueryClient with better defaults for caching and error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (replaces cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/products" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Products />
                  </Suspense>
                } 
              />
              <Route 
                path="/product/:id" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ProductDetail />
                  </Suspense>
                } 
              />
              <Route 
                path="/signin" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Auth />
                  </Suspense>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Auth />
                  </Suspense>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <About />
                  </Suspense>
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Contact />
                  </Suspense>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <Profile />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/wishlist" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <Wishlist />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notification-settings" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <NotificationSettings />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/seller-dashboard" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <SellerDashboard />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/messages" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <Messages />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/add-product" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <AddProduct />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoader />}>
                      <ShoppingCart />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin-login" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminLogin />
                  </Suspense>
                } 
              />
              <Route 
                path="/admin-dashboard" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route 
                path="*" 
                element={
                  <Suspense fallback={<PageLoader />}>
                    <NotFound />
                  </Suspense>
                } 
              />
            </Routes>
            
            {/* AI Assistant Chat Bot (visible on all pages) */}
            <AIAssistant />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
