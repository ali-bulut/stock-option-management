import { Axios } from "axios";
import { QueryFunctionContext } from "@tanstack/react-query";
import { IStockOption, StockOptionsParams } from "@/interfaces/IStockOption";

const indexKey = (
  filters: StockOptionsParams
): [string, string, StockOptionsParams] => ["stock_options", "index", filters];

const StockOptionsApi = (request: Axios) => ({
  index: {
    fetcher: async (
      context: QueryFunctionContext<ReturnType<typeof indexKey>>
    ) => {
      const [, , filters] = context.queryKey;
      const response = await request.get<Array<IStockOption>>(
        "/api/v1/stock_options/",
        {
          params: filters,
        }
      );
      return response.data;
    },
    key: indexKey,
  },
});
export default StockOptionsApi;
