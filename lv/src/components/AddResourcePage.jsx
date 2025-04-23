import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import useResourceStore, { resourceCategories, resourceStatus } from '../store/resourceStore';

const AddResourcePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addResource, updateResource, getResourceById } = useResourceStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get resource ID from URL if editing
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get('edit');
  const isEditing = Boolean(editId);
  
  // Resource form state - optimized for small and micro industries
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Equipment',
    status: 'Available',
    quantity: '',
    unit: '',
    cost: '',
    supplier: '',
    url: '',
    location: '',
    notes: '',
    minimumStock: '',
  });
  
  // Fetch resource data if editing
  useEffect(() => {
    if (isEditing) {
      const resourceToEdit = getResourceById(editId);
      if (resourceToEdit) {
        setFormData({
          title: resourceToEdit.title || '',
          description: resourceToEdit.description || '',
          category: resourceToEdit.category || 'Equipment',
          status: resourceToEdit.status || 'Available',
          quantity: resourceToEdit.quantity || '',
          unit: resourceToEdit.unit || '',
          cost: resourceToEdit.cost || '',
          supplier: resourceToEdit.supplier || '',
          url: resourceToEdit.url || '',
          location: resourceToEdit.location || '',
          notes: resourceToEdit.notes || '',
          minimumStock: resourceToEdit.minimumStock || '',
        });
      } else {
        // Resource not found, redirect to resources page
        navigate('/resources');
      }
    }
  }, [editId, getResourceById, isEditing, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isEditing) {
        updateResource(editId, formData);
      } else {
        addResource(formData);
      }
      
      navigate('/resources');
    } catch (error) {
      console.error('Error saving resource:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="mb-2 px-0 hover:bg-transparent"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-semibold">{isEditing ? 'Edit Resource' : 'Add New Resource'}</h1>
        <p className="text-muted-foreground">
          {isEditing 
            ? 'Update the details of your business resource.' 
            : 'Add a new resource to your business inventory.'}
        </p>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Resource' : 'Resource Details'}</CardTitle>
          <CardDescription>
            Fill in the information about the business resource you want to track.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Resource Name *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter resource name"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  className="w-full px-3 py-2 bg-background border rounded-md text-sm focus:outline-none"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {resourceCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  name="status"
                  className="w-full px-3 py-2 bg-background border rounded-md text-sm focus:outline-none"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  {resourceStatus.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  name="unit"
                  placeholder="pcs, kg, hours, etc."
                  value={formData.unit}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minimumStock">Minimum Stock Level</Label>
                <Input
                  id="minimumStock"
                  name="minimumStock"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={formData.minimumStock}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost ($)</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.cost}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Storage Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Warehouse, Shelf A3, etc."
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                name="supplier"
                placeholder="Supplier name"
                value={formData.supplier}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">Supplier URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                Optional: Add a link to the supplier or product
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="A brief description of the resource"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="w-full px-3 py-2 bg-background border rounded-md text-sm focus:outline-none resize-none"
                placeholder="Add any additional notes about this resource"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/resources')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Resource' : 'Add Resource'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddResourcePage;
