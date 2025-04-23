import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, CheckCircle, Clock, Package, ShoppingCart, Wrench, Users, FileText, Briefcase, Award } from 'lucide-react';
import useResourceStore from '../store/resourceStore';
import { formatDistanceToNow } from '../lib/utils';

const Dashboard = () => {
  const { getStats, resources } = useResourceStore();
  const [stats, setStats] = useState({ totalResources: 0, byCategory: {}, byStatus: {}, recentActivity: [] });
  
  // Update stats whenever resources change
  useEffect(() => {
    setStats(getStats());
  }, [resources, getStats]);

  // Resource category icons mapping for small and micro industries
  const categoryIcons = {
    'Equipment': <Wrench className="h-5 w-5 text-blue-500" />,
    'Raw Materials': <Package className="h-5 w-5 text-green-500" />,
    'Services': <Briefcase className="h-5 w-5 text-purple-500" />,
    'Software': <FileText className="h-5 w-5 text-amber-500" />,
    'Personnel': <Users className="h-5 w-5 text-rose-500" />,
    'Training': <Award className="h-5 w-5 text-cyan-500" />,
    'Compliance': <CheckCircle className="h-5 w-5 text-emerald-500" />,
    'Marketing': <BarChart className="h-5 w-5 text-indigo-500" />
  };

  // Status icons mapping
  const statusIcons = {
    'Available': <CheckCircle className="h-5 w-5 text-green-500" />,
    'Low Stock': <Clock className="h-5 w-5 text-amber-500" />,
    'On Order': <ShoppingCart className="h-5 w-5 text-blue-500" />,
    'Depleted': <Clock className="h-5 w-5 text-red-500" />
  };

  // For debugging - log the current resources
  console.log('Current resources:', resources);
  console.log('Current stats:', stats);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Industry Resource Dashboard</h1>
        <p className="text-muted-foreground">
          Track and manage your business resources efficiently.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResources}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalResources === 0 
                ? "No resources tracked yet" 
                : `${stats.byStatus['Available'] || 0} resources available`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byStatus['Low Stock'] || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Resources that need attention soon
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Order</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byStatus['On Order'] || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Resources currently on order
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Depleted</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byStatus['Depleted'] || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Resources needing immediate replenishment
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Resource Inventory by Type</CardTitle>
            <CardDescription>
              Breakdown of your business resources by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.totalResources === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Package className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No resources added yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add your first resource to see inventory statistics.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(stats.byCategory).map(([category, count]) => (
                  count > 0 && (
                    <div key={category} className="flex items-center">
                      <div className="mr-2">
                        {categoryIcons[category]}
                      </div>
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${(count / stats.totalResources) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>
              Latest changes to your resource inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!stats.recentActivity || stats.recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No recent activity.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add or update resources to see activity here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentActivity.map((resource) => (
                  <div key={resource.id} className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {categoryIcons[resource.category]}
                    </div>
                    <div>
                      <p className="font-medium truncate">{resource.title}</p>
                      <div className="flex items-center">
                        <span className="mr-2 inline-flex items-center">
                          {statusIcons[resource.status]}
                          <span className="ml-1 text-xs text-muted-foreground">{resource.status}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Updated {formatDistanceToNow(new Date(resource.updatedAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
