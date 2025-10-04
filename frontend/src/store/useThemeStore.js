import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("CloseCall-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("CloseCall-theme", theme);
    set({ theme });
  },
}));