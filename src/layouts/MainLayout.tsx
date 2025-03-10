
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/ui-components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      {isAdmin && (
        <div className="bg-primary/10 py-2 text-center">
          <Link to="/admin-dashboard" className="text-sm font-medium inline-flex items-center hover:underline">
            <ShieldAlert className="h-4 w-4 mr-1" />
            Access Admin Dashboard
          </Link>
        </div>
      )}
      
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
