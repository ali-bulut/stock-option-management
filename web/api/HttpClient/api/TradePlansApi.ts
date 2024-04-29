import { Axios } from "axios";
import { QueryFunctionContext } from "@tanstack/react-query";
import {
  CreateTradePlanParams,
  ITradePlan,
  TradePlansParams,
  UpdateTradePlanParams,
} from "@/interfaces/ITradePlan";

const indexKey = (
  filters?: TradePlansParams
): [string, string, TradePlansParams | undefined] => [
  "trade_plans",
  "index",
  filters,
];

const TradePlansApi = (request: Axios) => ({
  index: {
    fetcher: async (
      context: QueryFunctionContext<ReturnType<typeof indexKey>>
    ) => {
      const [, , filters] = context.queryKey;
      const response = await request.get<Array<ITradePlan>>(
        "/api/v1/trade_plans/",
        {
          params: filters,
        }
      );
      return response.data;
    },
    key: indexKey,
  },
  create: async (params: CreateTradePlanParams) =>
    await request.post<ITradePlan>("/api/v1/trade_plans", params),
  update: async (params: UpdateTradePlanParams) =>
    await request.put<ITradePlan>(`/api/v1/trade_plans/${params.id}`, params),
  delete: async (id: number) =>
    await request.delete(`/api/v1/trade_plans/${id}`),
});
export default TradePlansApi;
