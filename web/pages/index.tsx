import { ReactElement, useState } from "react";
import {
  Button,
  Divider,
  InputNumber,
  Layout,
  Select,
  Spin,
  Tooltip,
  Typography,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import Authentication from "@/components/Layout/Authentication";
import MainLayout from "@/components/Layout/MainLayout";
import type { NextPageWithLayout } from "./_app";
import Application from "@/components/Layout/Application";
import useStockSimulation from "@/hooks/useStockSimulation";
import toast from "react-hot-toast";
import ErrorHelper from "@/helpers/ErrorHelper";
import useQueriedStockOptions from "@/hooks/useQueriedStockOptions";
import { IOptionValue } from "@/interfaces/IOptionValue";
import Chart from "@/components/Chart";
import useWebhook from "@/hooks/useWebhook";
import SimulationResult from "@/components/SimulationResult";

const DEFAULT_STOCK_OPTIONS = ["NVDA", "AAPL", "AMZN", "BTC-USD", "ETH-USD"];

const Page: NextPageWithLayout = () => {
  const {
    transactions,
    result,
    simulationDate,
    setSimulationDate,
    setResult,
    setTransactions,
  } = useWebhook(true);
  const { simulateMutation } = useStockSimulation();
  const {
    options: stockOptions,
    isLoading: stockOptionsIsLoading,
    setQuery: setStockOptionsQuery,
  } = useQueriedStockOptions();

  const [initialAmount, setInitialAmount] = useState("");
  const [selectedStockOptions, setSelectedStockOptions] = useState<string[]>(
    DEFAULT_STOCK_OPTIONS
  );

  const onStockOptionSelect = (data: IOptionValue) => {
    setSelectedStockOptions([...selectedStockOptions, data.value]);
    setStockOptionsQuery("");
  };

  const onStockOptionClear = () => {
    setSelectedStockOptions([]);
    setStockOptionsQuery("");
  };

  const onSimulate = async () => {
    if (!initialAmount) {
      toast.error("Please enter an initial amount", {
        id: "initial-amount-empty",
      });
      return;
    }

    if (!selectedStockOptions.length) {
      toast.error("Please select at least one stock option", {
        id: "stock-options-empty",
      });
      return;
    }

    try {
      setResult(undefined);
      setTransactions(undefined);
      setSimulationDate(undefined);

      await toast.promise(
        simulateMutation.mutateAsync({
          initial_amount: Number(initialAmount),
          stock_options: selectedStockOptions,
        }),
        {
          error: ErrorHelper.parseApiError,
          loading: "Simulation Starting ...",
          success: "Simulation Started!",
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const isSimulationRunning =
    simulateMutation.isLoading ||
    (simulateMutation.isSuccess && !result) ||
    (transactions && !result);

  return (
    <Layout>
      <div className="flex flex-col py-8 items-center gap-4">
        <Typography.Title>Stock Option Management</Typography.Title>

        <div className="flex flex-col w-full max-w-md gap-4">
          <div className="grid grid-cols-6 gap-2">
            <Select
              className="col-span-5"
              loading={stockOptionsIsLoading}
              onSearch={setStockOptionsQuery}
              onClear={onStockOptionClear}
              onSelect={onStockOptionSelect}
              onDeselect={(data) =>
                setSelectedStockOptions(
                  selectedStockOptions.filter(
                    (stockOption) => stockOption !== data.value
                  )
                )
              }
              maxCount={7}
              options={stockOptions}
              showSearch
              labelInValue
              allowClear
              filterOption={false}
              value={selectedStockOptions.map((stockOption) => ({
                label: stockOption,
                value: stockOption,
              }))}
              mode="multiple"
              placeholder="Select Stock Options"
              status={!selectedStockOptions.length ? "error" : undefined}
            />
            <Tooltip title="Apply Default Options">
              <Button
                className="col-span-1"
                onClick={() => setSelectedStockOptions(DEFAULT_STOCK_OPTIONS)}
              >
                <ReloadOutlined />
              </Button>
            </Tooltip>
          </div>

          <InputNumber
            addonBefore="$"
            className="w-full"
            placeholder="Enter Amount"
            min="0"
            onChange={(e) => setInitialAmount(e || "")}
            value={initialAmount}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            onPressEnter={onSimulate}
          />

          <Button
            onClick={onSimulate}
            disabled={isSimulationRunning}
            loading={isSimulationRunning}
          >
            Simulate
          </Button>

          {(result || isSimulationRunning) && (
            <>
              <Divider />

              <SimulationResult
                initialAmount={initialAmount}
                simulationDate={simulationDate}
                isSimulationRunning={isSimulationRunning}
                result={result}
              />
            </>
          )}
        </div>
      </div>

      <div className="sm:px-16 h-[60vh]">
        {transactions ? (
          <Chart transactions={transactions} />
        ) : isSimulationRunning ? (
          <div className="h-full flex flex-col gap-2 justify-center items-center">
            <Typography.Text className="font-bold text-lg">
              Setting Up The Simulation...
            </Typography.Text>
            <Spin />
          </div>
        ) : undefined}
      </div>
    </Layout>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Authentication>
        <Application>{page}</Application>
      </Authentication>
    </MainLayout>
  );
};

export default Page;
