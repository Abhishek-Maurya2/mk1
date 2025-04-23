import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Award, Briefcase, CheckCircle, Clock, Edit, ExternalLink, FileText, Package, Search, ShoppingCart, Wrench, Trash2, Users, BarChart } from 'lucide-react';
import useResourceStore from '../store/resourceStore';
import { formatDistanceToNow } from '../lib/utils';

const ResourcesPage = () => {
  const { resources, deleteResource } = useResourceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

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

  // Filter resources based on search query, category and status
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || resource.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories from resources
  const categories = ['All', ...new Set(resources.map(resource => resource.category))];
  
  // Status options
  const statuses = ['All', 'Available', 'Low Stock', 'On Order', 'Depleted'];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleDeleteResource = (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm('Are you sure you want to delete this resource?')) {
      deleteResource(id);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Industry Resources</h1>
          <p className="text-muted-foreground">Manage your business inventory and resources.</p>
        </div>
        <Button className="mt-4 sm:mt-0" asChild>
          <Link to="/add-resource">Add New Resource</Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search resources..."
            className="pl-9"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex space-x-2">
          <select
            className="px-3 py-2 bg-background border rounded-md text-sm focus:outline-none"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            className="px-3 py-2 bg-background border rounded-md text-sm focus:outline-none"
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredResources.length === 0 ? (
        <div className="bg-muted/40 rounded-lg p-8 text-center">
          <Package className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-1">No resources found</h3>
          <p className="text-muted-foreground mb-4">
            {resources.length === 0 
              ? "You haven't added any resources to your inventory yet." 
              : "No resources match your current filters."}
          </p>
          {resources.length === 0 && (
            <Button asChild>
              <Link to="/add-resource">Add Your First Resource</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map(resource => (
            <Card key={resource.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {categoryIcons[resource.category]}
                    <CardTitle className="text-base">{resource.title}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/add-resource?edit=${resource.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => handleDeleteResource(resource.id, e)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                {resource.url && (
                  <div className="flex items-center pt-2">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-blue-500 hover:underline flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Source/Supplier
                    </a>
                  </div>
                )}
              </CardHeader>
              <CardContent className="pb-3">
                <CardDescription className="line-clamp-2">
                  {resource.description || "No description provided."}
                </CardDescription>
                <div className="mt-2 pt-2 border-t border-muted">
                  <div className="flex justify-between text-xs">
                    <span>Quantity/Units:</span>
                    <span className="font-medium">{resource.quantity || "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Cost:</span>
                    <span className="font-medium">{resource.cost ? `$${resource.cost}` : "N/A"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between">
                <div className="flex items-center">
                  {statusIcons[resource.status]}
                  <span className="ml-1">{resource.status}</span>
                </div>
                <div>Added {formatDistanceToNow(new Date(resource.createdAt))}</div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
