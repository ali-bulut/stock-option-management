import { HttpClient } from "@/api/HttpClient";
import { IOptionValue } from "@/interfaces/IOptionValue";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

export default function useQueriedStockOptions() {
  const [query, _setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 300);
  const setQuery = (newQuery: string) => {
    _setQuery(newQuery);
  };

  const { data: stockOptions, isLoading } = useQuery(
    HttpClient.BrowserSide.StockOptionsApi.index.key({
      search: debouncedQuery,
    }),
    HttpClient.BrowserSide.StockOptionsApi.index.fetcher
  );

  const options = useMemo<Array<IOptionValue>>(
    () =>
      stockOptions?.map(
        (stockOption) =>
          ({
            label: `${stockOption.symbol} (${stockOption.name})`,
            value: stockOption.symbol,
            id: stockOption.id,
          } as IOptionValue)
      ) || [],
    [stockOptions]
  );

  return {
    query,
    setQuery,
    options,
    stockOptions,
    isLoading: isLoading || query !== debouncedQuery,
  };
}
