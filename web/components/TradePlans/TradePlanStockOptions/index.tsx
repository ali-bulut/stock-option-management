import { FC, MouseEvent, useState } from "react";
import { Button, Spin, Table, Tag, Typography } from "antd";
import { TransactionOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import CurrencyHelper from "@/helpers/CurrencyHelper";
import { ITradePlan, ITradePlanStockOption } from "@/interfaces/ITradePlan";
import WithTooltip from "@/components/shared/WithTooltip";
import { useModalControls } from "@/hooks/useModalControls";
import Transactions from "../Transactions";
import NumberHelper from "@/helpers/NumberHelper";

interface TradePlanStockOptionsProps {
  record: ITradePlan;
  isFetching: boolean;
}

const TradePlanStockOptions: FC<TradePlanStockOptionsProps> = (props) => {
  const [selectedStockOption, setSelectedStockOption] =
    useState<ITradePlanStockOption>();

  const {
    open: transactionsModalOpen,
    openModal: openTransactionsModal,
    closeModal: closeTransactionsModal,
  } = useModalControls();

  const onOpenTransactionsModal = (
    e: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    record: ITradePlanStockOption
  ) => {
    e.stopPropagation();
    e.preventDefault();

    setSelectedStockOption(record);
    openTransactionsModal();
  };

  const cashRecord = props.record.stock_options?.find(
    (s) => s.stock_option.symbol === "CASH"
  )!;

  const stockOptions = props.record.stock_options?.filter(
    (s) => s.stock_option.id !== cashRecord.stock_option.id
  );

  stockOptions?.push({
    amount: cashRecord.amount,
    quantity: "-",
    cost: cashRecord.cost,
    stock_option: {
      id: cashRecord.stock_option.id,
      symbol: cashRecord.stock_option.symbol,
      name: cashRecord.stock_option.name,
      price: null!,
    },
    transactions: [],
  });

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
      title: "Unit Cost",
      dataIndex: "unit_cost",
      key: "unit_cost",
      sorter: (a, b) => a.cost - b.cost,
      render: (value: string, record: ITradePlanStockOption) => (
        <WithTooltip
          text={record.cost ? CurrencyHelper.format(record.cost, 2, true) : "-"}
        />
      ),
    },
    {
      title: "Profit",
      dataIndex: "profit",
      key: "profit",
      sorter: (a, b) => {
        if (!a.cost) return -1;
        if (!b.cost) return -1;

        return (
          (a.stock_option.price - a.cost) / a.cost -
          (b.stock_option.price - b.cost) / b.cost
        );
      },
      render: (profit: number, record: ITradePlanStockOption) => {
        if (!record.cost) return "-";

        const percentage =
          (record.stock_option.price - record.cost) / record.cost;
        return (
          <Tag color={percentage >= 0 ? "green" : "red"}>
            {NumberHelper.formatPercentage(percentage)}
          </Tag>
        );
      },
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
    {
      title: "Transactions",
      dataIndex: "",
      key: "transactions",
      render: (value, record) => (
        <div className="flex justify-center items-center">
          {record.stock_option.symbol !== "CASH" ? (
            <Button
              icon={<TransactionOutlined />}
              type="default"
              onClick={(e) => onOpenTransactionsModal(e, record)}
              className="px-3"
            >
              Show ({record.transactions.length} records)
            </Button>
          ) : (
            "-"
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-center items-center gap-4 mb-2">
        <Typography.Title level={4} className="text-center !mb-0">
          Portfolio
        </Typography.Title>

        {props.isFetching && <Spin />}
      </div>

      <Table columns={columns} dataSource={stockOptions} pagination={false} />

      <Transactions
        open={transactionsModalOpen}
        onClose={closeTransactionsModal}
        title={selectedStockOption?.stock_option.name + " Transactions"}
        transactions={selectedStockOption?.transactions || []}
      />
    </div>
  );
};

export default TradePlanStockOptions;
