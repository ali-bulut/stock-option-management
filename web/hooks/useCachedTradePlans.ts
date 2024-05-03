import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ITradePlan } from "@/interfaces/ITradePlan";

type TradePlansStore = {
  cachedTradePlans: ITradePlan[];
  setCachedTradePlans: (tradePlans: ITradePlan[]) => void;
};

const useCachedTradePlans = create<TradePlansStore>()(
  persist(
    (set) => ({
      cachedTradePlans: [],
      setCachedTradePlans: (cachedTradePlans: ITradePlan[]) =>
        set({ cachedTradePlans }),
    }),
    {
      name: "cached-trade-plans-storage",
    }
  )
);

export default useCachedTradePlans;
