
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-background py-6">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            © {currentYear} CU Marketplace. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
          <Link to="/notification-settings" className="text-sm text-muted-foreground hover:text-foreground">
            Notifications
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
