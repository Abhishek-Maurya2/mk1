import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import {
  BarChart,
  Library,
  PlusCircle,
  Settings,
  LogIn,
  LogOut
} from 'lucide-react';
import useUserStore from '../store/userStore';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

const Sidebar = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useUserStore();

  const navItems = [
    {
      title: 'Dashboard',
      href: '/',
      icon: BarChart,
    },
    {
      title: 'Resources',
      href: '/resources',
      icon: Library,
    },
    {
      title: 'Add Resource',
      href: '/add-resource',
      icon: PlusCircle,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/authentication');
  };

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
    <aside className=
      " border-r h-full flex flex-col items-start justify-between"
    >
      <div>
        <div className="px-3 py-2">
          <div className="px-2 py-6">
            <h2 className="mb-2 text-lg font-semibold">Resource Tracker</h2>
            <p className="text-xs text-muted-foreground">Manage and track your learning resources</p>
          </div>
          <div className="space-y-1 px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-accent/10",
                  location.pathname === item.href
                    ? "bg-primary/10 font-medium text-primary rounded-full py-4"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* profile */}
      <div className="p-4 w-full">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link to="/settings">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.user_metadata?.avatarUrl} alt={user?.user_metadata?.full_name || user?.user_metadata?.name || 'User profile'} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hover:bg-[#ff6e6eb3] dark:hover:bg-[#ff6e6eb3]"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

        ) : (
          <Button onClick={() => navigate('/authentication')} className="w-full">
            <LogIn className="mr-2 h-4 w-4" /> Login / Sign Up
          </Button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
