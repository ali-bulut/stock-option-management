import WithTooltip from "@/components/shared/WithTooltip";
import CurrencyHelper from "@/helpers/CurrencyHelper";
import DateHelper from "@/helpers/DateHelper";
import { ITradeTransaction } from "@/interfaces/ITradePlan";
import { Modal, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { FC } from "react";

interface TransactionsProps {
  title: string;
  open: boolean;
  onClose: () => void;
  transactions: ITradeTransaction[];
}

const columns: ColumnsType<ITradeTransaction> = [
  {
    title: "Symbol",
    dataIndex: "symbol",
    key: "symbol",
    sorter: (a, b) =>
      a.stock_option.symbol.localeCompare(b.stock_option.symbol),
    render: (value: string, record: ITradeTransaction) =>
      record.stock_option.symbol,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.stock_option.name.localeCompare(b.stock_option.name),
    render: (value: string, record: ITradeTransaction) => (
      <WithTooltip text={record.stock_option.name} />
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    sorter: (a, b) => a.action.localeCompare(b.action),
    render: (value: string, record: ITradeTransaction) => (
      <Tag
        className="uppercase"
        color={record.action === "buy" ? "green" : "red"}
      >
        {record.action}
      </Tag>
    ),
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    sorter: (a, b) => a.price - b.price,
    render: (value: string, record: ITradeTransaction) => (
      <WithTooltip
        text={record.price ? CurrencyHelper.format(record.price, 2, true) : "-"}
      />
    ),
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    sorter: (a, b) => parseFloat(a.quantity) - parseFloat(b.quantity),
    render: (value: string, record: ITradeTransaction) => (
      <WithTooltip text={record.quantity} />
    ),
  },
  {
    title: "Total Amount",
    dataIndex: "total_amount",
    key: "total_amount",
    sorter: (a, b) => a.amount - b.amount,
    render: (value: string, record: ITradeTransaction) => (
      <WithTooltip text={CurrencyHelper.format(record.amount, 2, true)} />
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    sorter: (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    defaultSortOrder: "ascend",
    render: (value: string, record: ITradeTransaction) => (
      <WithTooltip text={DateHelper.format(record.created_at, "PPPP")} />
    ),
  },
];

const Transactions: FC<TransactionsProps> = (props) => {
  return (
    <Modal
      destroyOnClose
      title={props.title}
      footer={null}
      open={props.open}
      onCancel={props.onClose}
      width={1280}
      className="top-5"
      centered
    >
      <div className="max-h-[680px] overflow-y-scroll">
        <Table
          columns={columns}
          dataSource={props.transactions}
          pagination={{ defaultPageSize: 10 }}
        />
      </div>
    </Modal>
  );
};

export default Transactions;
