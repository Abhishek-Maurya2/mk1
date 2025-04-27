import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Loader2, Moon, Save, Sun, User } from 'lucide-react';
import useUserStore from '../store/userStore';
import useResourceStore from '../store/resourceStore';
import { useThemeStore } from '../store/themeStore';

const SettingsPage = () => {
  const { user, updateProfile } = useUserStore();

  console.log(user);
  const { resources } = useResourceStore();
  const { theme, setTheme } = useThemeStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile form state
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || user?.user_metadata?.name || '',
    email: user?.email || '',
    avatarUrl: user?.user_metadata?.avatarUrl || '',
    bio: user?.user_metadata?.bio || '',
  });
  
  // Resource statistics
  const totalResources = resources.length;
  const completedResources = resources.filter(r => r.status === 'Completed').length;
  const inProgressResources = resources.filter(r => r.status === 'In Progress').length;
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!formData.name) return 'U';
    return formData.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Update profile in the store
      await updateProfile({
        full_name: formData.name,
        avatarUrl: formData.avatarUrl,
        bio: formData.bio,
      });
      
      // Show success message
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={formData.avatarUrl} alt={formData.name} />
                  <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-medium">{formData.name || 'Your Name'}</h3>
                  <p className="text-sm text-muted-foreground">{formData.email || 'your.email@example.com'}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Profile Picture URL</Label>
                <Input
                  id="avatarUrl"
                  name="avatarUrl"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Provide a URL for your profile picture
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  className="w-full px-3 py-2 bg-background border rounded-md text-sm focus:outline-none resize-none"
                  placeholder="Tell us a bit about yourself"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the appearance of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Application Theme</Label>
                <div className="flex flex-col space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant={theme === 'light' ? 'default' : 'outline'} 
                      className="w-full justify-start"
                      onClick={() => handleThemeChange('light')}
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </Button>
                    <Button 
                      variant={theme === 'dark' ? 'default' : 'outline'} 
                      className="w-full justify-start"
                      onClick={() => handleThemeChange('dark')}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </Button>
                    <Button 
                      variant={theme === 'system' ? 'default' : 'outline'} 
                      className="w-full justify-start"
                      onClick={() => handleThemeChange('system')}
                    >
                      <span className="mr-2">💻</span>
                      System
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {theme === 'system' 
                      ? 'Follows your system preferences' 
                      : `Using ${theme} mode`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
              <CardDescription>
                Your learning activity overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Account Type</p>
                    <p className="text-xs text-muted-foreground">Free Account</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Upgrade</Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Resources:</span>
                  <span className="font-medium">{totalResources}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Completed:</span>
                  <span className="font-medium">{completedResources}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>In Progress:</span>
                  <span className="font-medium">{inProgressResources}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  disabled
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  disabled
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" disabled>
                Change Password
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;