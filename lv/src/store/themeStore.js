import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'system', // 'light', 'dark', 'system'
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => {
        let newTheme;
        if (state.theme === 'light') {
          newTheme = 'dark';
        } else if (state.theme === 'dark') {
          newTheme = 'system';
        } else {
          // If system, check preference and toggle to the opposite, or default to light
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          newTheme = systemPrefersDark ? 'light' : 'dark';
        }
        return { theme: newTheme };
      }),
    }),
    {
      name: 'theme-storage', // unique name for localStorage persistence
    }
  )
);
