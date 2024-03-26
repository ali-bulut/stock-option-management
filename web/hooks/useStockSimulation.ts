import { useMutation } from "@tanstack/react-query";
import { HttpClient } from "@/api/HttpClient";

export default function useStockSimulation() {
  const simulateMutation = useMutation(
    HttpClient.BrowserSide.StockSimulationApi.simulate
  );

  return {
    simulateMutation,
  };
}
