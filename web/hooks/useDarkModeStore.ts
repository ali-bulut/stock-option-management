import { create } from "zustand";
import { persist } from "zustand/middleware";

type DarkModeStore = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (darkMode: boolean) => void;
};

const useDarkModeStore = create<DarkModeStore>()(
  persist(
    (set) => ({
      darkMode:
        typeof window !== "undefined" &&
        window?.matchMedia &&
        window?.matchMedia("(prefers-color-scheme: dark)").matches,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setDarkMode: (darkMode: boolean) => set({ darkMode }),
    }),
    {
      name: "darkMode-storage",
    }
  )
);

export default useDarkModeStore;
