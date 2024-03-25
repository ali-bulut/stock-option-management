import _ from "lodash";
import "@styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { ReactElement, ReactNode } from "react";
import Head from "next/head";
import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
  QueryCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { App, ConfigProvider, theme } from "antd";
import useDarkModeStore from "@/hooks/useDarkModeStore";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {},
  }),
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ dehydratedQueryClientState?: Object }> & {
  Component: NextPageWithLayout<{ dehydratedQueryClientState?: Object }>;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  const { darkMode, toggleDarkMode } = useDarkModeStore();

  if (darkMode) {
    toggleDarkMode();
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <App>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedQueryClientState}>
            <Head>
              <meta
                name="viewport"
                content="initial-scale=1.0, maximum-scale=1.0"
              />
              <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/apple-touch-icon.png"
              />
              <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/favicon-32x32.png"
              />
              <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/favicon-16x16.png"
              />
              <link rel="manifest" href="/site.webmanifest" />
            </Head>
            <Toaster />
            {getLayout(<Component {...pageProps} />)}
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          </Hydrate>
        </QueryClientProvider>
      </App>
    </ConfigProvider>
  );
}

export default MyApp;
