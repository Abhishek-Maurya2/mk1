import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Resource categories optimized for small and micro industries
export const resourceCategories = [
  'Equipment', 
  'Raw Materials', 
  'Services', 
  'Software', 
  'Personnel', 
  'Training',
  'Compliance',
  'Marketing'
];

// Resource status options
export const resourceStatus = [
  'Available',
  'Low Stock',
  'On Order',
  'Depleted'
];

// Fixed implementation of resource store with proper persistence
const useResourceStore = create(
  persist(
    (set, get) => ({
      resources: [],
      isLoading: false,
      
      // Add a new resource
      addResource: (resource) => {
        const newResource = {
          ...resource,
          id: crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ 
          resources: [...state.resources, newResource] 
        }));
        return newResource;
      },
      
      // Update an existing resource
      updateResource: (id, updatedResource) => {
        set((state) => ({
          resources: state.resources.map((resource) => 
            resource.id === id 
              ? { 
                  ...resource, 
                  ...updatedResource, 
                  updatedAt: new Date().toISOString() 
                } 
              : resource
          ),
        }));
      },
      
      // Delete a resource
      deleteResource: (id) => {
        set((state) => ({
          resources: state.resources.filter((resource) => resource.id !== id),
        }));
      },
      
      // Get resource by ID
      getResourceById: (id) => {
        return get().resources.find((resource) => resource.id === id);
      },
      
      // Get resources stats
      getStats: () => {
        const resources = get().resources || [];
        
        // Calculate statistics
        const totalResources = resources.length;
        
        // Resources by category
        const byCategory = resourceCategories.reduce((acc, category) => {
          acc[category] = resources.filter(r => r.category === category).length;
          return acc;
        }, {});
        
        // Resources by status
        const byStatus = resourceStatus.reduce((acc, status) => {
          acc[status] = resources.filter(r => r.status === status).length;
          return acc;
        }, {});
        
        // Recent activity - last 5 added or updated
        const recentActivity = [...resources]
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5);
          
        return {
          totalResources,
          byCategory,
          byStatus,
          recentActivity
        };
      }
    }),
    {
      name: 'resources-storage',
      version: 1,
      storage: typeof window !== 'undefined' ? window.localStorage : null,
      partialize: (state) => ({ resources: state.resources }),
    }
  )
);

export default useResourceStore;