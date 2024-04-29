import { ReactElement, useState } from "react";
import { Button, Divider, InputNumber, Layout, Spin, Typography } from "antd";
import Authentication from "@/components/Layout/Authentication";
import MainLayout from "@/components/Layout/MainLayout";
import type { NextPageWithLayout } from "./_app";
import Application from "@/components/Layout/Application";
import useStockSimulation from "@/hooks/useStockSimulation";
import toast from "react-hot-toast";
import ErrorHelper from "@/helpers/ErrorHelper";
import Chart from "@/components/Chart";
import useWebhook from "@/hooks/useWebhook";
import SimulationResult from "@/components/SimulationResult";
import classNames from "classnames";
import StockOptionSelect, {
  DEFAULT_STOCK_OPTIONS,
} from "@/components/StockOptionSelect";

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

  const [initialAmount, setInitialAmount] = useState("");
  const [selectedStockOptions, setSelectedStockOptions] = useState<string[]>(
    DEFAULT_STOCK_OPTIONS
  );

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
        <div className="flex flex-col justify-center items-center">
          <Typography.Title className="!mb-1.5">
            Trading Simulation
          </Typography.Title>
          <Typography.Text className="italic font-medium font-sans text-center">
            What would your profit have been if you had used our system
            throughout 2023?
          </Typography.Text>
        </div>

        <div className="flex flex-col w-full max-w-md gap-4">
          <StockOptionSelect
            selectedStockOptions={selectedStockOptions}
            setSelectedStockOptions={setSelectedStockOptions}
          />

          <InputNumber
            addonBefore="$"
            className="w-full"
            placeholder="Enter Amount"
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

      <div
        className={classNames(
          "sm:px-16 h-[60vh]",
          !transactions && !isSimulationRunning && "!h-0"
        )}
      >
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
