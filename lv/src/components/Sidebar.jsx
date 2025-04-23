import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  BarChart, 
  Library, 
  PlusCircle, 
  Settings 
} from 'lucide-react';

const Sidebar = ({ className }) => {
  const location = useLocation();
  
  // Navigation items
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

  return (
    <aside className={cn(
      "pb-12 border-r h-full flex flex-col",
      className
    )}>
      <div className="px-3 py-2">
        <div className="px-2 py-6">
          <h2 className="mb-2 text-lg font-semibold">Resource Tracker</h2>
          <p className="text-xs text-muted-foreground">Manage and track your learning resources</p>
        </div>
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-full px-6 py-4 text-sm transition-all hover:text-primary",
                location.pathname === item.href 
                  ? "bg-primary font-medium text-secondary hover:text-secondary" 
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
