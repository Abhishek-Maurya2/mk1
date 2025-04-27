import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

const useUserStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  // Check initial auth state
  checkAuth: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error checking auth status:', error);
      set({ loading: false });
      return;
    }
    if (session) {
      console.log(session.user);
      set({ user: session.user, isAuthenticated: true, loading: false });
    } else {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  // Register a new user with Supabase Auth
  register: async (userData) => {
    const { email, password, name } = userData;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name, // Add additional user data if needed
        }
      }
    });

    if (error) {
      console.error('Registration error:', error.message);
      return { success: false, error: error.message };
    }

    if (data.user) {
      set({ user: data.user, isAuthenticated: true });
      return { success: true, user: data.user };
    }
    // Handle cases like email confirmation required
    return { success: true, message: 'Registration successful. Check your email for confirmation.' };
  },

  // Log in existing user with Supabase Auth
  login: async (credentials) => {
    const { email, password } = credentials;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error.message);
      return { success: false, error: error.message };
    }

    if (data.user) {
      set({ user: data.user, isAuthenticated: true });
      console.log(data);
      return { success: true };
    }
    return { success: false, error: 'Login failed.' };
  },

  // Log out current user with Supabase Auth
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
      // Optionally handle logout error, though usually we clear state regardless
    }
    set({ user: null, isAuthenticated: false });
  },

  // Update user profile (example - adapt as needed)
  updateProfile: async (updatedData) => {
    const currentUser = get().user;
    if (!currentUser) return { success: false, error: 'User not logged in' };

    const { data, error } = await supabase.auth.updateUser({
      data: updatedData
    });

    if (error) {
      console.error('Update profile error:', error.message);
      return { success: false, error: error.message };
    }

    if (data.user) {
      set({ user: data.user });
      return { success: true };
    }
    return { success: false, error: 'Failed to update profile.' };
  }
}));

// Initialize auth check when the store is loaded
useUserStore.getState().checkAuth();

export default useUserStore;