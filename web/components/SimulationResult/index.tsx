import { FC } from "react";
import { Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { IStockSimulation } from "@/interfaces/IStockSimulation";
import CurrencyHelper from "@/helpers/CurrencyHelper";
import NumberHelper from "@/helpers/NumberHelper";
import DateHelper from "@/helpers/DateHelper";

interface SimulationResultProps {
  isSimulationRunning: boolean | undefined;
  result: IStockSimulation | undefined;
}

const SimulationResult: FC<SimulationResultProps> = (props) => {
  return (
    <div>
      <Typography.Text className="block text-xl font-extrabold text-center -mt-4 mb-4">
        Simulation Results
        {props.isSimulationRunning && <Spin className="ml-2" />}
      </Typography.Text>

      <Typography.Text className="block">
        <Typography.Text className="font-bold text-base">
          Initial Amount:
        </Typography.Text>{" "}
        {!props.isSimulationRunning && props.result ? (
          CurrencyHelper.format(props.result.initial_amount)
        ) : (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 14 }} />} />
        )}
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
    </div>
  );
};

export default SimulationResult;
