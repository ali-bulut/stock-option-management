import { create } from "zustand";
import { persist } from "zustand/middleware";

type DarkModeStore = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const useDarkModeStore = create<DarkModeStore>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: "darkMode-storage",
    }
  )
);

export default useDarkModeStore;
