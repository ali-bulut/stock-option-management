import { Axios } from "axios";
import {
  IStockSimulation,
  StockSimulationParams,
} from "@/interfaces/IStockSimulation";

const StockSimulationApi = (request: Axios) => ({
  simulate: async (params: StockSimulationParams) =>
    await request.post<IStockSimulation>("/api/v1/stock_simulations", params),
});
export default StockSimulationApi;
