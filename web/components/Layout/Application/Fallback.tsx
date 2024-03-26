import ErrorHelper from "@/helpers/ErrorHelper";
import useRouterTransitions from "@/hooks/useRouterTransitions";
import { Button, Result } from "antd";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { ComponentType, useMemo } from "react";
import { FallbackProps } from "react-error-boundary";

const Fallback: ComponentType<FallbackProps> = (props) => {
  const router = useRouter();
  const onBack = () => router.back();
  // Reset error boundaries when routing
  useRouterTransitions({
    startRouting: props.resetErrorBoundary,
  });

  const errorMessage = useMemo<string>(() => {
    // Check if is an axios error
    if ((props.error as AxiosError)?.isAxiosError) {
      return ErrorHelper.parseApiError(props.error as any);
    }

    return typeof props.error === "string"
      ? props.error
      : props.error
      ? JSON.stringify(props.error)
      : "Unknown Error: Please Check Console";
  }, [props.error]);

  const extra = (
    <div className="flex space-x-3 justify-center items-center">
      <Button onClick={onBack} type="text">
        Go Back
      </Button>
      <Button onClick={props.resetErrorBoundary}>Refresh</Button>
    </div>
  );

  return <Result status="error" title={errorMessage} extra={extra} />;
};

export default Fallback;
