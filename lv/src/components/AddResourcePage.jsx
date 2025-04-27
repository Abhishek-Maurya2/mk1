import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import useResourceStore, { resourceCategories, resourceStatus } from '../store/resourceStore';

const AddResourcePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addResource, updateResource, getResourceById, error: storeError, isLoading: storeIsLoading } = useResourceStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get('edit');
  const isEditing = Boolean(editId);

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

  useEffect(() => {
    setError('');
    if (isEditing) {
      const resourceToEdit = getResourceById(editId);
      if (resourceToEdit) {
        const initialFormData = Object.keys(formData).reduce((acc, key) => {
          acc[key] = resourceToEdit[key] === null || resourceToEdit[key] === undefined ? '' : resourceToEdit[key];
          return acc;
        }, {});
        setFormData(initialFormData);
      } else if (!storeIsLoading) {
        console.warn(`Resource with ID ${editId} not found in store.`);
        setError('Resource not found or access denied.');
      }
    }
    if (!isEditing) {
      setFormData({
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
    }
  }, [editId, getResourceById, isEditing, navigate, storeIsLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.title) {
      setError('Resource Name is required.');
      setIsLoading(false);
      return;
    }

    const dataToSubmit = {
      ...formData,
      quantity: formData.quantity === '' ? null : parseFloat(formData.quantity),
      cost: formData.cost === '' ? null : parseFloat(formData.cost),
      minimumStock: formData.minimumStock === '' ? null : parseFloat(formData.minimumStock),
      description: formData.description || null,
      unit: formData.unit || null,
      supplier: formData.supplier || null,
      url: formData.url || null,
      location: formData.location || null,
      notes: formData.notes || null,
    };

    try {
      let result;
      if (isEditing) {
        const { created_at, user_id, ...updateData } = dataToSubmit;
        result = await updateResource(editId, updateData);
      } else {
        result = await addResource(dataToSubmit);
      }

      if (result.success) {
        navigate('/resources');
      } else {
        setError(result.error || 'Failed to save resource. Please try again.');
      }
    } catch (error) {
      console.error('Error saving resource:', error);
      setError('An unexpected error occurred. Please try again.');
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
            {(error || storeError) && (
              <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded">
                <AlertCircle className="inline w-4 h-4 mr-2"/>
                {error || storeError} 
              </div>
            )}

            {isEditing && storeIsLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="ml-2 text-sm">Loading resource data...</span>
              </div>
            )}

            {!(isEditing && storeIsLoading) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Resource Name *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter resource name"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      step="any"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={handleChange}
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minimumStock">Minimum Stock Level</Label>
                    <Input
                      id="minimumStock"
                      name="minimumStock"
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      value={formData.minimumStock}
                      onChange={handleChange}
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/resources')}
              disabled={isLoading || (isEditing && storeIsLoading)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || (isEditing && storeIsLoading)}>
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
