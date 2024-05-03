import { FC } from "react";
import { Button, Collapse, Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { IStockSimulation } from "@/interfaces/IStockSimulation";
import CurrencyHelper from "@/helpers/CurrencyHelper";
import NumberHelper from "@/helpers/NumberHelper";
import DateHelper from "@/helpers/DateHelper";
import { useModalControls } from "@/hooks/useModalControls";
import Transactions from "../TradePlans/Transactions";
import { ITradeTransaction } from "@/interfaces/ITradePlan";

interface SimulationResultProps {
  isSimulationRunning: boolean | undefined;
  result: IStockSimulation | undefined;
  simulationDate: string | undefined;
  initialAmount: string;
}

const SimulationResult: FC<SimulationResultProps> = (props) => {
  const {
    open: transactionsModalOpen,
    openModal: openTransactionsModal,
    closeModal: closeTransactionsModal,
  } = useModalControls();

  const transactions: ITradeTransaction[] = [];

  props.result?.transaction_history?.forEach((transaction, index) => {
    transactions.push({
      id: index,
      action: transaction.action === "BUY" ? "buy" : "sell",
      amount: transaction.price * 100 * transaction.amount_of_options,
      created_at: transaction.date,
      price: transaction.price * 100,
      quantity: transaction.amount_of_options.toString(),
      stock_option: {
        id: transaction.ticker.charCodeAt(0),
        name: transaction.ticker,
        symbol: transaction.ticker,
      },
    });
  });

  return (
    <div>
      <Typography.Text className="block text-xl font-extrabold text-center -mt-4 mb-4">
        Simulation Results
      </Typography.Text>

      <Typography.Text className="block">
        <Typography.Text className="font-bold text-base">
          Initial Amount:
        </Typography.Text>{" "}
        {CurrencyHelper.format(+props.initialAmount)}
      </Typography.Text>

      <Typography.Text className="block">
        <Typography.Text className="font-bold text-base">
          Final Portfolio Value:
        </Typography.Text>{" "}
        {!props.isSimulationRunning && props.result ? (
          CurrencyHelper.format(props.result.final_portfolio_value)
        ) : (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 14 }} />} />
        )}
      </Typography.Text>

      <Typography.Text className="block">
        <Typography.Text className="font-bold text-base">
          Total Return:
        </Typography.Text>{" "}
        {!props.isSimulationRunning && props.result ? (
          NumberHelper.formatPercentage(props.result.total_return)
        ) : (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 14 }} />} />
        )}
      </Typography.Text>

      <Typography.Text className="block">
        <Typography.Text className="font-bold text-base">
          Start Date:
        </Typography.Text>{" "}
        {!props.isSimulationRunning && props.result ? (
          DateHelper.format(props.result.start_date)
        ) : (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 14 }} />} />
        )}
      </Typography.Text>

      <Typography.Text className="block">
        <Typography.Text className="font-bold text-base">
          End Date:
        </Typography.Text>{" "}
        {!props.isSimulationRunning && props.result ? (
          DateHelper.format(props.result.end_date)
        ) : (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 14 }} />} />
        )}
      </Typography.Text>

      {!props.isSimulationRunning && props.result ? (
        <div className="text-center">
          <Button
            className="mt-4 w-full"
            type="default"
            onClick={openTransactionsModal}
          >
            Show Transactions
          </Button>
        </div>
      ) : null}

      <Typography.Text className="flex flex-col justify-center items-center mt-4 -mb-4">
        <Typography.Text className="font-bold text-base">
          Current Date
        </Typography.Text>{" "}
        {props.simulationDate ? (
          DateHelper.format(props.simulationDate)
        ) : (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 14 }} />} />
        )}
      </Typography.Text>

      <Transactions
        open={transactionsModalOpen}
        onClose={closeTransactionsModal}
        title="Simulation Transactions"
        transactions={transactions}
      />
    </div>
  );
};

export default SimulationResult;
