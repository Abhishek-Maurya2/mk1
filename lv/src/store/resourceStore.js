import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient'; // Import Supabase client
import useUserStore from './userStore'; // Import user store to get user ID

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

const useResourceStore = create((set, get) => ({
  resources: [],
  isLoading: true, // Start with loading true
  error: null,

  // Fetch resources for the current user from Supabase
  fetchResources: async () => {
    set({ isLoading: true, error: null });
    const user = useUserStore.getState().user;
    if (!user) {
      set({ resources: [], isLoading: false, error: 'User not logged in' });
      return;
    }

    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resources:', error);
      set({ isLoading: false, error: error.message });
    } else {
      set({ resources: data || [], isLoading: false });
    }
  },

  // Add a new resource to Supabase
  addResource: async (resourceData) => {
    set({ isLoading: true, error: null }); // Indicate loading
    const user = useUserStore.getState().user;
    if (!user) {
      set({ isLoading: false, error: 'User not logged in' });
      return { success: false, error: 'User not logged in' };
    }

    // Remove minimumStock before sending to Supabase
    const { minimumStock, ...resourceWithUser } = {
      ...resourceData,
      user_id: user.id,
      // Supabase handles id, created_at, updated_at
    };

    const { data, error } = await supabase
      .from('resources')
      .insert([resourceWithUser])
      .select(); // Select the newly inserted row

    if (error) {
      console.error('Error adding resource:', error);
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    } else if (data && data.length > 0) {
      set((state) => ({ 
        resources: [data[0], ...state.resources], // Add to the beginning
        isLoading: false 
      }));
      return { success: true, resource: data[0] };
    }
    set({ isLoading: false }); // Stop loading even if no data returned
    return { success: false, error: 'Failed to add resource' };
  },

  // Update an existing resource in Supabase
  updateResource: async (id, updatedData) => {
    set({ isLoading: true, error: null });
    // Remove minimumStock before sending to Supabase
    const { minimumStock, ...dataToUpdate } = updatedData;
    const { data, error } = await supabase
      .from('resources')
      .update({ ...dataToUpdate, updated_at: new Date().toISOString() }) // Manually set updated_at for immediate feedback
      .eq('id', id)
      .select(); // Select the updated row

    if (error) {
      console.error('Error updating resource:', error);
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    } else if (data && data.length > 0) {
      set((state) => ({
        resources: state.resources.map((resource) => 
          resource.id === id ? data[0] : resource
        ),
        isLoading: false,
      }));
      return { success: true, resource: data[0] };
    }
    set({ isLoading: false });
    return { success: false, error: 'Failed to update resource' };
  },

  // Delete a resource from Supabase
  deleteResource: async (id) => {
    set({ isLoading: true, error: null });
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting resource:', error);
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    } else {
      set((state) => ({
        resources: state.resources.filter((resource) => resource.id !== id),
        isLoading: false,
      }));
      return { success: true };
    }
  },

  // Get resource by ID (from local state, assumes fetchResources was called)
  getResourceById: (id) => {
    return get().resources.find((resource) => resource.id === id);
  },

  // Get resources stats (from local state)
  getStats: () => {
    const resources = get().resources || [];
    const totalResources = resources.length;
    const byCategory = resourceCategories.reduce((acc, category) => {
      acc[category] = resources.filter(r => r.category === category).length;
      return acc;
    }, {});
    const byStatus = resourceStatus.reduce((acc, status) => {
      acc[status] = resources.filter(r => r.status === status).length;
      return acc;
    }, {});
    const recentActivity = [...resources]
      .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
      .slice(0, 5);
      
    return {
      totalResources,
      byCategory,
      byStatus,
      recentActivity
    };
  }
}));

// Fetch initial resources when the user is authenticated
// This requires careful handling of user state changes
useUserStore.subscribe((state, prevState) => {
  // Fetch when user becomes authenticated or user changes
  if (state.isAuthenticated && state.user && state.user.id !== prevState.user?.id) {
    useResourceStore.getState().fetchResources();
  }
  // Clear resources when user logs out
  if (!state.isAuthenticated && prevState.isAuthenticated) {
    useResourceStore.setState({ resources: [], isLoading: false, error: null });
  }
});

// Also fetch if the user is already authenticated when the store initializes
if (useUserStore.getState().isAuthenticated) {
  useResourceStore.getState().fetchResources();
}

export default useResourceStore;