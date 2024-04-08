import { Axios } from "axios";
import { ITicker, TickersParams } from "@/interfaces/ITicker";
import { QueryFunctionContext } from "@tanstack/react-query";

const indexKey = (filters: TickersParams): [string, string, TickersParams] => [
  "tickers",
  "index",
  filters,
];

const TickersApi = (request: Axios) => ({
  index: {
    fetcher: async (
      context: QueryFunctionContext<ReturnType<typeof indexKey>>
    ) => {
      const [, , filters] = context.queryKey;
      const response = await request.get<Array<ITicker>>("/api/v1/tickers/", {
        params: filters,
      });
      return response.data;
    },
    key: indexKey,
  },
});
export default TickersApi;
