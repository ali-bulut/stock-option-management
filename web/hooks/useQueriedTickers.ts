import { HttpClient } from "@/api/HttpClient";
import { IOptionValue } from "@/interfaces/IOptionValue";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

export default function useQueriedTickers() {
  const [query, _setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 300);
  const setQuery = (newQuery: string) => {
    _setQuery(newQuery);
  };

  const { data: tickers, isLoading } = useQuery(
    HttpClient.BrowserSide.TickersApi.index.key({ search: debouncedQuery }),
    HttpClient.BrowserSide.TickersApi.index.fetcher
  );

  const options = useMemo<Array<IOptionValue>>(
    () =>
      tickers?.map(
        (ticker) => ({ label: ticker, value: ticker } as IOptionValue)
      ) || [],
    [tickers]
  );

  return {
    query,
    setQuery,
    options,
    tickers,
    isLoading: isLoading || query !== debouncedQuery,
  };
}
