import { useCallback, useEffect, useState } from "react";
import { Router } from "next/router";

export interface RouterTransitionsCallbacks {
  startRouting?: (...evts: any[]) => void;
  stopRouting?: (...evts: any[]) => void;
}

const useRouterTransitions = (callbacks?: RouterTransitionsCallbacks) => {
  const [isRouting, setIsRouting] = useState(false);
  const startRouting = useCallback(
    (...evts: any[]) => {
      callbacks?.startRouting?.(evts);
      setIsRouting(true);
    },
    [callbacks]
  );
  const stopRouting = useCallback(
    (...evts: any[]) => {
      callbacks?.stopRouting?.(evts);
      setIsRouting(false);
    },
    [callbacks]
  );

  useEffect(() => {
    Router.events.on("routeChangeStart", startRouting);
    Router.events.on("routeChangeComplete", stopRouting);
    Router.events.on("routeChangeError", stopRouting);
    return () => {
      Router.events.off("routeChangeStart", startRouting);
      Router.events.off("routeChangeComplete", stopRouting);
      Router.events.off("routeChangeError", stopRouting);
    };
  }, [callbacks, startRouting, stopRouting]);

  return isRouting;
};

export default useRouterTransitions;
