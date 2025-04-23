import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      // Register a new user
      register: (userData) => {
        const newUser = {
          ...userData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set({ user: newUser, isAuthenticated: true });
        return newUser;
      },
      
      // Log in existing user
      login: (credentials) => {
        // In a real app, this would validate against stored credentials
        // Here we're just simulating authentication with local storage
        
        const { email, password } = credentials;
        
        // For demo purposes, accept any non-empty credentials
        if (email && password) {
          const user = {
            id: 'user-123',
            name: email.split('@')[0],
            email,
            role: 'user',
          };
          set({ user, isAuthenticated: true });
          return { success: true };
        }
        
        return { success: false, error: 'Invalid credentials' };
      },
      
      // Log out current user
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      // Update user profile
      updateProfile: (updatedData) => {
        set((state) => ({
          user: { ...state.user, ...updatedData }
        }));
      }
    }),
    {
      name: 'user-storage',
    }
  )
);

export default useUserStore;