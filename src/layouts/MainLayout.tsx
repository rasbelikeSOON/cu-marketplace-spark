
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, LogOut, Plus, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui-components/Button";
import { ThemeToggle } from "@/components/ui-components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle page transitions
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* Header/Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ease-apple ${
          isScrolled
            ? "bg-white/80 backdrop-blur-lg shadow-subtle dark:bg-gray-900/80 dark:shadow-covenant-purple/10"
            : "bg-transparent"
        }`}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="text-foreground font-display font-semibold text-xl md:text-2xl relative z-20 dark:text-white"
            >
              <span className="text-primary dark:text-covenant-lavender">CU</span>Marketplace
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-all hover:text-primary dark:hover:text-covenant-lavender ${
                  location.pathname === "/" ? "text-primary dark:text-covenant-lavender" : "text-foreground dark:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`text-sm font-medium transition-all hover:text-primary dark:hover:text-covenant-lavender ${
                  location.pathname === "/products" ? "text-primary dark:text-covenant-lavender" : "text-foreground dark:text-white"
                }`}
              >
                Products
              </Link>
              <Link
                to="/about"
                className={`text-sm font-medium transition-all hover:text-primary dark:hover:text-covenant-lavender ${
                  location.pathname === "/about" ? "text-primary dark:text-covenant-lavender" : "text-foreground dark:text-white"
                }`}
              >
                About
              </Link>
              {user && (
                <Link
                  to="/add-product"
                  className={`text-sm font-medium transition-all hover:text-primary dark:hover:text-covenant-lavender ${
                    location.pathname === "/add-product" ? "text-primary dark:text-covenant-lavender" : "text-foreground dark:text-white"
                  }`}
                >
                  Sell
                </Link>
              )}
            </div>

            {/* Desktop Action Items */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              
              <button
                aria-label="Search"
                className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors dark:hover:bg-gray-800"
                onClick={() => navigate('/products')}
              >
                <Search size={20} />
              </button>
              
              {user && (
                <button
                  aria-label="Messages"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors dark:hover:bg-gray-800"
                  onClick={() => navigate('/messages')}
                >
                  <MessageCircle size={20} />
                </button>
              )}
              
              <button
                aria-label="Cart"
                className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors dark:hover:bg-gray-800"
                onClick={() => navigate('/cart')}
              >
                <ShoppingBag size={20} />
              </button>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground dark:bg-covenant-purple flex items-center justify-center">
                      {profile?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || <User size={18} />}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/add-product")}>
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Sell Item</span>
                    </DropdownMenuItem>
                    {profile?.is_verified_seller && (
                      <DropdownMenuItem onClick={() => navigate("/seller-dashboard")}>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>Seller Dashboard</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => navigate("/messages")}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/signin">
                  <Button size="sm">Sign In</Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                aria-label="Toggle mobile menu"
                className="w-10 h-10 rounded-full flex items-center justify-center text-foreground dark:text-white hover:bg-secondary dark:hover:bg-gray-800 transition-colors relative z-20"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-white dark:bg-gray-900 z-10 transition-transform duration-300 ease-apple md:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="container-custom pt-24 pb-8 space-y-8">
            <div className="space-y-6">
              <Link
                to="/"
                className="block text-lg font-medium hover:text-primary dark:hover:text-covenant-lavender transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block text-lg font-medium hover:text-primary dark:hover:text-covenant-lavender transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="block text-lg font-medium hover:text-primary dark:hover:text-covenant-lavender transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              {user && (
                <Link
                  to="/add-product"
                  className="block text-lg font-medium hover:text-primary dark:hover:text-covenant-lavender transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sell
                </Link>
              )}
              {user && (
                <Link
                  to="/messages"
                  className="block text-lg font-medium hover:text-primary dark:hover:text-covenant-lavender transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Messages
                </Link>
              )}
              <Link
                to="/cart"
                className="block text-lg font-medium hover:text-primary dark:hover:text-covenant-lavender transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cart
              </Link>
            </div>

            <div className="pt-6 border-t border-border dark:border-gray-800">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary dark:bg-covenant-purple text-primary-foreground dark:text-white flex items-center justify-center text-xl font-medium">
                      {profile?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-medium">{profile?.username || "User"}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate("/profile");
                      }}
                      variant="outline"
                      className="justify-start"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    {profile?.is_verified_seller && (
                      <Button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate("/seller-dashboard");
                        }}
                        variant="outline"
                        className="justify-start"
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Seller Dashboard
                      </Button>
                    )}
                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      className="justify-start"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full">Sign In</Button>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow page-transition-container dark:bg-gray-900">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary dark:bg-gray-800 py-12 md:py-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:justify-between space-y-8 md:space-y-0">
            <div className="max-w-xs">
              <div className="text-foreground dark:text-white font-display font-semibold text-xl">
                <span className="text-primary dark:text-covenant-lavender">CU</span>Marketplace
              </div>
              <p className="mt-4 text-muted-foreground dark:text-gray-400 text-sm">
                The exclusive online marketplace for Covenant University students.
                Buy and sell items safely within our community.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium text-sm mb-4 dark:text-white">Navigation</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/"
                      className="text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-covenant-lavender transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products"
                      className="text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-covenant-lavender transition-colors"
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-covenant-lavender transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-4 dark:text-white">Legal</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/terms"
                      className="text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-covenant-lavender transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy"
                      className="text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-covenant-lavender transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/guidelines"
                      className="text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-covenant-lavender transition-colors"
                    >
                      Community Guidelines
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-4 dark:text-white">Contact</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="mailto:support@cumarketplace.com"
                      className="text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-covenant-lavender transition-colors"
                    >
                      Email Support
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-covenant-lavender transition-colors"
                    >
                      Report an Issue
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border/50 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              &copy; {new Date().getFullYear()} CU Marketplace. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Exclusively for Covenant University students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
