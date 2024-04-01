import { ReactElement, useState } from "react";
import {
  Button,
  Collapse,
  Divider,
  InputNumber,
  Layout,
  Select,
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
import { IStockSimulation } from "@/interfaces/IStockSimulation";
import useQueriedTickers from "@/hooks/useQueriedTickers";
import { IOptionValue } from "@/interfaces/IOptionValue";
import CurrencyHelper from "@/helpers/CurrencyHelper";
import NumberHelper from "@/helpers/NumberHelper";
import DateHelper from "@/helpers/DateHelper";

const DEFAULT_TICKERS = ["NVDA", "AAPL", "GOOGL", "AMZN", "TSLA"];

const Page: NextPageWithLayout = () => {
  const { simulateMutation } = useStockSimulation();
  const {
    options: tickerOptions,
    isLoading: tickersIsLoading,
    setQuery: setTickersQuery,
  } = useQueriedTickers();

  const [initialAmount, setInitialAmount] = useState("");
  const [response, setResponse] = useState<IStockSimulation>();
  const [selectedTickers, setSelectedTickers] =
    useState<string[]>(DEFAULT_TICKERS);

  const onTickerSelect = (data: IOptionValue) => {
    setSelectedTickers([...selectedTickers, data.value]);
    setTickersQuery("");
  };

  const onTickerClear = () => {
    setSelectedTickers([]);
    setTickersQuery("");
  };

  const onSimulate = async () => {
    if (!initialAmount) {
      toast.error("Please enter an initial amount", {
        id: "initial-amount-empty",
      });
      return;
    }

    if (!selectedTickers.length) {
      toast.error("Please select at least one ticker", {
        id: "tickers-empty",
      });
      return;
    }

    try {
      setResponse(undefined);

      const res = await toast.promise(
        simulateMutation.mutateAsync({
          initial_amount: Number(initialAmount),
          tickers: selectedTickers,
        }),
        {
          error: ErrorHelper.parseApiError,
          loading: "Simulating...",
          success: "Simulation Completed!",
        }
      );
      setResponse(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col py-8 items-center gap-4">
        <Typography.Title>Stock Option Management</Typography.Title>

        <div className="flex flex-col w-full max-w-md gap-4">
          <div className="grid grid-cols-6 gap-2">
            <Select
              className="col-span-5"
              loading={tickersIsLoading}
              onSearch={setTickersQuery}
              onClear={onTickerClear}
              onSelect={onTickerSelect}
              onDeselect={(data) =>
                setSelectedTickers(
                  selectedTickers.filter((ticker) => ticker !== data.value)
                )
              }
              options={tickerOptions}
              showSearch
              labelInValue
              allowClear
              filterOption={false}
              value={selectedTickers.map((ticker) => ({
                label: ticker,
                value: ticker,
              }))}
              mode="multiple"
              placeholder="Select Tickers"
              status={!selectedTickers.length ? "error" : undefined}
            />
            <Tooltip title="Apply Default Stock Options">
              <Button
                className="col-span-1"
                onClick={() => setSelectedTickers(DEFAULT_TICKERS)}
              >
                <ReloadOutlined />
              </Button>
            </Tooltip>
          </div>

          <InputNumber
            addonBefore="$"
            className="w-full"
            placeholder="Enter Initial Amount"
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
            disabled={simulateMutation.isLoading}
            loading={simulateMutation.isLoading}
          >
            Simulate
          </Button>

          {response ? (
            <>
              <Divider />

              <div>
                <Typography.Text className="block text-xl font-extrabold text-center -mt-4 mb-4">
                  Simulation Results
                </Typography.Text>

                <Typography.Text className="block">
                  <Typography.Text className="font-bold text-base">
                    Initial Amount:
                  </Typography.Text>{" "}
                  {CurrencyHelper.format(response.initial_amount)}
                </Typography.Text>

                <Typography.Text className="block">
                  <Typography.Text className="font-bold text-base">
                    Final Portfolio Value:
                  </Typography.Text>{" "}
                  {CurrencyHelper.format(response.final_portfolio_value)}
                </Typography.Text>

                <Typography.Text className="block">
                  <Typography.Text className="font-bold text-base">
                    Total Return:
                  </Typography.Text>{" "}
                  {NumberHelper.formatPercentage(response.total_return)}
                </Typography.Text>

                <Typography.Text className="block">
                  <Typography.Text className="font-bold text-base">
                    Start Date:
                  </Typography.Text>{" "}
                  {DateHelper.format(response.start_date)}
                </Typography.Text>

                <Typography.Text className="block">
                  <Typography.Text className="font-bold text-base">
                    End Date:
                  </Typography.Text>{" "}
                  {DateHelper.format(response.end_date)}
                </Typography.Text>
              </div>

              <Collapse
                className="mt-4"
                items={[
                  {
                    key: "1",
                    label: (
                      <Typography.Text className="font-bold">
                        Transaction History
                      </Typography.Text>
                    ),
                    children: <pre>{JSON.stringify(response, null, 2)}</pre>,
                  },
                ]}
              />
            </>
          ) : null}
        </div>
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
