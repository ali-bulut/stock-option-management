import { FC } from "react";
import { Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import CurrencyHelper from "@/helpers/CurrencyHelper";
import { ITradePlan, ITradePlanStockOption } from "@/interfaces/ITradePlan";
import WithTooltip from "@/components/shared/WithTooltip";

interface TradePlanStockOptionsProps {
  record: ITradePlan;
}

const columns: ColumnsType<ITradePlanStockOption> = [
  {
    title: "Symbol",
    dataIndex: "symbol",
    key: "symbol",
    sorter: (a, b) =>
      a.stock_option.symbol.localeCompare(b.stock_option.symbol),
    render: (value: string, record: ITradePlanStockOption) =>
      record.stock_option.symbol,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.stock_option.name.localeCompare(b.stock_option.name),
    render: (value: string, record: ITradePlanStockOption) => (
      <WithTooltip text={record.stock_option.name} />
    ),
  },
  {
    title: "Unit Price",
    dataIndex: "unit_price",
    key: "unit_price",
    sorter: (a, b) => a.stock_option.price - b.stock_option.price,
    render: (value: string, record: ITradePlanStockOption) => (
      <WithTooltip
        text={
          record.stock_option.price
            ? CurrencyHelper.format(record.stock_option.price, 2, true)
            : "-"
        }
      />
    ),
  },
  {
    title: "Total Shares",
    dataIndex: "total_shares",
    key: "total_shares",
    sorter: (a, b) => parseFloat(a.quantity) - parseFloat(b.quantity),
    render: (value: string, record: ITradePlanStockOption) => (
      <WithTooltip text={record.quantity} />
    ),
  },
  {
    title: "Total Amount",
    dataIndex: "total_amount",
    key: "total_amount",
    defaultSortOrder: "descend",
    sorter: (a, b) => a.amount - b.amount,
    render: (value: string, record: ITradePlanStockOption) => (
      <WithTooltip text={CurrencyHelper.format(record.amount, 2, true)} />
    ),
  },
];

const TradePlanStockOptions: FC<TradePlanStockOptionsProps> = (props) => {
  const cashRecord = props.record.stock_options?.find(
    (s) => s.stock_option.symbol === "CASH"
  )!;

  const stockOptions = props.record.stock_options?.filter(
    (s) => s.stock_option.id !== cashRecord.stock_option.id
  );

  stockOptions?.push({
    amount: cashRecord.amount,
    quantity: "-",
    stock_option: {
      id: cashRecord.stock_option.id,
      symbol: cashRecord.stock_option.symbol,
      name: cashRecord.stock_option.name,
      price: null!,
    },
  });

  return (
    <div>
      <Typography.Title level={4} className="text-center">
        Portfolio
      </Typography.Title>
      <Table columns={columns} dataSource={stockOptions} pagination={false} />
    </div>
  );
};

export default TradePlanStockOptions;
