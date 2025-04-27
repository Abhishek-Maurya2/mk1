import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from './ui/sheet';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import useUserStore from '../store/userStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useUserStore();
  
  const handleLogout = () => {
    logout();
    navigate('/authentication');
  };
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    const name = user?.user_metadata?.full_name || user?.user_metadata?.name || '';
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <Sidebar className="border-0" />
        </SheetContent>
      </Sheet>

      <div className="w-full flex justify-between items-center">
        <div className="font-semibold flex-shrink-0">
          <Link to="/" className="text-xl font-bold">
            Resource Tracker
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <span className="text-sm font-medium">Welcome, {user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'}</span>
              </div>
              <div className="relative group">
                <Link to="/settings">
                  <Avatar>
                    <AvatarImage src={user?.user_metadata?.avatarUrl} alt={user?.user_metadata?.full_name || user?.user_metadata?.name || 'User profile'} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="px-4 py-2 text-xs text-muted-foreground truncate">{user?.email}</div>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Button onClick={() => navigate('/authentication')}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
