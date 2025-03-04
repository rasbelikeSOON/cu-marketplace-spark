
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ease-apple ${
          isScrolled
            ? "bg-white/80 backdrop-blur-lg shadow-subtle"
            : "bg-transparent"
        }`}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="text-foreground font-display font-semibold text-xl md:text-2xl relative z-20"
            >
              <span className="text-primary">CU</span>Marketplace
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-all hover:text-primary ${
                  location.pathname === "/" ? "text-primary" : "text-foreground"
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`text-sm font-medium transition-all hover:text-primary ${
                  location.pathname === "/products" ? "text-primary" : "text-foreground"
                }`}
              >
                Products
              </Link>
              <Link
                to="/about"
                className={`text-sm font-medium transition-all hover:text-primary ${
                  location.pathname === "/about" ? "text-primary" : "text-foreground"
                }`}
              >
                About
              </Link>
            </div>

            {/* Desktop Action Items */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                aria-label="Search"
                className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
              >
                <Search size={20} />
              </button>
              <button
                aria-label="Cart"
                className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
              >
                <ShoppingBag size={20} />
              </button>
              <Link to="/signin">
                <button
                  aria-label="Account"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <User size={20} />
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              aria-label="Toggle mobile menu"
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-secondary transition-colors relative z-20"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-white z-10 transition-transform duration-300 ease-apple md:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="container-custom pt-24 pb-8 space-y-8">
            <div className="space-y-6">
              <Link
                to="/"
                className="block text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="block text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
            </div>

            <div className="flex items-center space-x-4 pt-6 border-t border-border">
              <button
                aria-label="Search"
                className="w-12 h-12 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search size={24} />
              </button>
              <button
                aria-label="Cart"
                className="w-12 h-12 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingBag size={24} />
              </button>
              <Link
                to="/signin"
                className="w-12 h-12 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={24} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow page-transition-container">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary py-12 md:py-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:justify-between space-y-8 md:space-y-0">
            <div className="max-w-xs">
              <div className="text-foreground font-display font-semibold text-xl">
                <span className="text-primary">CU</span>Marketplace
              </div>
              <p className="mt-4 text-muted-foreground text-sm">
                The exclusive online marketplace for Covenant University students.
                Buy and sell items safely within our community.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium text-sm mb-4">Navigation</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-4">Legal</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/terms"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/guidelines"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Community Guidelines
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-4">Contact</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="mailto:support@cumarketplace.com"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Email Support
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Report an Issue
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border/50 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} CU Marketplace. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Exclusively for Covenant University students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
