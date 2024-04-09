import { FC } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ColorHelper } from "@/helpers/ColorHelper";
import { ITransactions } from "@/interfaces/IStockSimulation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Transactions by Month",
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface ChartProps {
  transactions: ITransactions;
}

const Chart: FC<ChartProps> = (props) => {
  const chartDatasets = [] as any;

  Object.keys(props.transactions).forEach((key, i) => {
    const dataset = {
      label: key,
      data: Object.values(props.transactions[key]).map((v) =>
        v.total_price.toFixed(2)
      ),
      backgroundColor: ColorHelper.generateColor(i),
    };

    chartDatasets.push(dataset);
  });

  const data = {
    labels,
    datasets: chartDatasets,
  };

  return <Bar options={options} data={data} />;
};

export default Chart;
