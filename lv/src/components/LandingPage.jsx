import React from 'react';
import { Button } from './ui/button';
import { BarChart, CheckCircle, Cloud, Lock, Rocket, Users, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';

const features = [
  {
    icon: <BarChart className="h-7 w-7 text-primary" />, 
    title: 'Track Resources',
    description: 'Easily manage and monitor all your business resources in one place.'
  },
  {
    icon: <CheckCircle className="h-7 w-7 text-primary" />, 
    title: 'Smart Insights',
    description: 'Get actionable analytics and trends to optimize your operations.'
  },
  {
    icon: <Users className="h-7 w-7 text-primary" />, 
    title: 'Team Collaboration',
    description: 'Invite your team and collaborate on resource management securely.'
  },
  {
    icon: <Cloud className="h-7 w-7 text-primary" />, 
    title: 'Cloud Sync',
    description: 'Access your data anywhere, anytime, with real-time cloud sync.'
  },
  {
    icon: <Lock className="h-7 w-7 text-primary" />, 
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected with industry best practices.'
  },
  {
    icon: <Rocket className="h-7 w-7 text-primary" />, 
    title: 'Fast & Modern',
    description: 'Enjoy a blazing fast, modern UI/UX powered by shadcn/ui and Tailwind.'
  },
];

const ThemeToggle = () => {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      className="absolute top-6 right-6 md:top-8 md:right-8"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <header className="w-full py-8 px-4 md:px-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 relative">
        <ThemeToggle />
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Resource Tracker for Modern Businesses
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Effortlessly manage, track, and optimize your business resources with a beautiful, intuitive dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base px-8 py-6">
              <Link to="/authentication">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8 py-6">
              <a href="#features">See Features</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-0 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Features</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Everything you need to manage your resources, boost productivity, and make smarter business decisions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="rounded-2xl border bg-card shadow-sm p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 md:px-0 bg-gradient-to-br from-primary/5 to-accent/5 flex flex-col items-center">
        <div className="max-w-xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">
            Sign up now and take control of your business resources with ease and confidence.
          </p>
          <Button asChild size="lg" className="text-base px-8 py-6">
            <Link to="/authentication">Create Your Free Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Resource Tracker. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
