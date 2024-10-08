import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HttpClient } from "@/api/HttpClient";
import { MouseEvent } from "react";
import {
  CreateTradePlanParams,
  ITradePlan,
  UpdateTradePlanParams,
} from "@/interfaces/ITradePlan";
import { Alert, App, Typography } from "antd";
import toast from "react-hot-toast";
import ErrorHelper from "@/helpers/ErrorHelper";
import useCachedTradePlans from "./useCachedTradePlans";

export default function useTradePlans() {
  const queryClient = useQueryClient();
  const { modal: AppModal } = App.useApp();
  const { cachedTradePlans, setCachedTradePlans } = useCachedTradePlans();

  const { isLoading: lightTradePlansIsLoading } = useQuery(
    HttpClient.BrowserSide.TradePlansApi.index.key({
      without_stock_options: true,
    }),
    HttpClient.BrowserSide.TradePlansApi.index.fetcher,
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      staleTime: Infinity,
      onSuccess: (data) => {
        if (!cachedTradePlans.length) {
          setCachedTradePlans(data);
          return;
        }

        let updatedData = cachedTradePlans
          .filter((tradePlan) => data.find((tp) => tp.id === tradePlan.id))
          .map((tradePlan) => {
            const foundTradePlan = data.find((tp) => tp.id === tradePlan.id);

            if (!foundTradePlan) return tradePlan;

            foundTradePlan.total_amount = tradePlan.total_amount;
            foundTradePlan.stock_options = tradePlan.stock_options;

            return foundTradePlan;
          });

        data
          .filter(
            (tradePlan) => !updatedData.find((tp) => tp.id === tradePlan.id)
          )
          .forEach((tradePlan) => {
            updatedData.push(tradePlan);
          });

        setCachedTradePlans(updatedData);
      },
    }
  );

  const { isFetching: tradePlansIsFetching } = useQuery(
    HttpClient.BrowserSide.TradePlansApi.index.key(),
    HttpClient.BrowserSide.TradePlansApi.index.fetcher,
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchInterval: 1000 * 30,
      staleTime: 1000 * 30,
      onSuccess: (data) => {
        setCachedTradePlans(data);
      },
    }
  );

  const createTradePlanMutation = useMutation(
    HttpClient.BrowserSide.TradePlansApi.create,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          HttpClient.BrowserSide.TradePlansApi.index.key()
        );
        queryClient.invalidateQueries(
          HttpClient.BrowserSide.TradePlansApi.index.key({
            without_stock_options: true,
          })
        );
      },
    }
  );

  const updateTradePlanMutation = useMutation(
    HttpClient.BrowserSide.TradePlansApi.update,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          HttpClient.BrowserSide.TradePlansApi.index.key()
        );
        queryClient.invalidateQueries(
          HttpClient.BrowserSide.TradePlansApi.index.key({
            without_stock_options: true,
          })
        );
      },
    }
  );

  const deleteTradePlanMutation = useMutation(
    HttpClient.BrowserSide.TradePlansApi.delete,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          HttpClient.BrowserSide.TradePlansApi.index.key()
        );
        queryClient.invalidateQueries(
          HttpClient.BrowserSide.TradePlansApi.index.key({
            without_stock_options: true,
          })
        );
      },
    }
  );

  const onCreate = async (
    values: CreateTradePlanParams,
    successCallback?: () => void
  ) => {
    try {
      const response = await toast.promise(
        createTradePlanMutation.mutateAsync({
          ...values,
          initial_amount: values.initial_amount * 100,
        }),
        {
          error: ErrorHelper.parseApiError,
          loading: "Generating New Trade Plan...",
          success: "Trade Plan Generated Successfully!",
        }
      );

      if (response.data.id) {
        successCallback?.();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onUpdate = async (
    values: UpdateTradePlanParams,
    successCallback?: () => void
  ) => {
    try {
      const response = await toast.promise(
        updateTradePlanMutation.mutateAsync(values),
        {
          error: ErrorHelper.parseApiError,
          loading: "Updating Trade Plan...",
          success: "Trade Plan Updated!",
        }
      );

      if (response.data.id) {
        successCallback?.();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onDelete = (
    e: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    record: ITradePlan
  ) => {
    e.stopPropagation();
    e.preventDefault();

    AppModal.confirm({
      title: "Delete Trade Plan",
      content: (
        <div className="space-y-4">
          <Typography.Text>
            Are you sure you want to delete the trade plan <b>{record.name}</b>?
          </Typography.Text>

          <Alert
            type="info"
            showIcon
            message={
              <Typography.Text>
                We'll transfer all the amount from this trade plan to your
                wallet.
              </Typography.Text>
            }
          />
        </div>
      ),
      okText: "Delete",
      okButtonProps: { danger: true },
      maskClosable: true,
      onOk: () => {
        try {
          toast.promise(deleteTradePlanMutation.mutateAsync(record.id), {
            loading: "Deleting Trade Plan...",
            success: "Trade Plan Deleted"!,
            error: ErrorHelper.parseApiError,
          });
        } catch (err) {
          console.log(err);
        }
      },
    });
  };

  return {
    tradePlans: cachedTradePlans,
    tradePlansIsLoading: lightTradePlansIsLoading,
    tradePlansIsFetching,
    onCreate,
    onDelete,
    onUpdate,
  };
}
