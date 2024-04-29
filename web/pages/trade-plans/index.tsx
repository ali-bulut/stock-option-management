import { MouseEvent, ReactElement, useState } from "react";
import { NextPageWithLayout } from "../_app";
import MainLayout from "@/components/Layout/MainLayout";
import Authentication from "@/components/Layout/Authentication";
import Application from "@/components/Layout/Application";
import { Button, Layout, Spin, Table, Tag, Typography } from "antd";
import useTradePlans from "@/hooks/useTradePlans";
import { ColumnsType } from "antd/es/table";
import CurrencyHelper from "@/helpers/CurrencyHelper";
import DateHelper from "@/helpers/DateHelper";
import {
  CheckCircleOutlined,
  StopOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  CreateTradePlanParams,
  ITradePlan,
  UpdateTradePlanParams,
} from "@/interfaces/ITradePlan";
import WithTooltip from "@/components/shared/WithTooltip";
import NumberHelper from "@/helpers/NumberHelper";
import TradePlanStockOptions from "@/components/TradePlans/TradePlanStockOptions";
import NewTradePlan from "@/components/TradePlans/NewTradePlan";
import { useModalControls } from "@/hooks/useModalControls";
import UpdateTradePlan from "@/components/TradePlans/UpdateTradePlan";

const Page: NextPageWithLayout = () => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [selectedTradePlan, setSelectedTradePlan] = useState<ITradePlan>();

  const { tradePlans, tradePlansIsLoading, onDelete, onCreate, onUpdate } =
    useTradePlans();

  const {
    open: createModalOpen,
    openModal: openCreateModal,
    closeModal: closeCreateModal,
  } = useModalControls();
  const {
    open: updateModalOpen,
    openModal: openUpdateModal,
    closeModal: closeUpdateModal,
  } = useModalControls();

  const onOpenUpdateModal = (
    e: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    record: ITradePlan
  ) => {
    e.stopPropagation();
    e.preventDefault();

    setSelectedTradePlan(record);
    openUpdateModal();
  };

  const onCreateTradePlan = async (values: CreateTradePlanParams) => {
    await onCreate(values, closeCreateModal);
  };

  const onUpdateTradePlan = async (values: UpdateTradePlanParams) => {
    await onUpdate(values, closeUpdateModal);
  };

  const onRowExpand = (expanded: boolean, record: ITradePlan) => {
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, record.id]);
    } else {
      setExpandedRowKeys([
        ...expandedRowKeys.filter((key) => key !== record.id),
      ]);
    }
  };

  const columns: ColumnsType<ITradePlan> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <WithTooltip text={name} />,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string) => <WithTooltip text={description} />,
    },
    {
      title: "Trade Started At",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: string) => <WithTooltip text={created_at} />,
    },
    {
      title: "Trade Active",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) =>
        active ? (
          <CheckCircleOutlined className="text-green-500" />
        ) : (
          <StopOutlined className="text-red-500" />
        ),
    },
    {
      title: "Notify Trades",
      dataIndex: "notify",
      key: "notify",
      render: (notify: boolean) =>
        notify ? (
          <CheckCircleOutlined className="text-green-500" />
        ) : (
          <StopOutlined className="text-red-500" />
        ),
    },
    {
      title: "Initial Amount",
      dataIndex: "initial_amount",
      key: "initial_amount",
      render: (initial_amount: number) => (
        <WithTooltip text={CurrencyHelper.format(initial_amount, 2, true)} />
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (total_amount: number) =>
        !total_amount ? (
          <Spin />
        ) : (
          <WithTooltip text={CurrencyHelper.format(total_amount, 2, true)} />
        ),
    },
    {
      title: "Profit",
      dataIndex: "profit",
      key: "profit",
      render: (profit: number, record) => {
        if (!record.total_amount) {
          return <Spin />;
        }

        const percentage =
          (record.total_amount - record.initial_amount) / record.initial_amount;
        return (
          <Tag color={percentage >= 0 ? "green" : "red"}>
            {NumberHelper.formatPercentage(percentage)}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      render: (value, record) => (
        <div className="flex justify-center items-center gap-2">
          <Button
            icon={<EditOutlined />}
            disabled={!record.total_amount}
            type="primary"
            onClick={(e) => onOpenUpdateModal(e, record)}
          />
          <Button
            icon={<DeleteOutlined />}
            disabled={!record.total_amount}
            danger
            onClick={(e) => onDelete(e, record)}
          />
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col py-8 gap-4">
        <div className="flex flex-col justify-center items-center">
          <Typography.Title>Trade Plans</Typography.Title>
        </div>

        <div className="flex justify-end items-end">
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={openCreateModal}
          >
            Add New Trade Plan
          </Button>
        </div>

        <Table
          loading={tradePlansIsLoading}
          columns={columns.map((column) => ({
            ...column,
            className: "max-w-xxs truncate select-none cursor-pointer",
          }))}
          className="w-full"
          dataSource={tradePlans}
          scroll={{ x: true }}
          rowKey={(record) => record.id}
          expandable={{
            expandedRowRender: (record: ITradePlan) => (
              <TradePlanStockOptions record={record} />
            ),
            expandedRowKeys: expandedRowKeys,
            onExpand: onRowExpand,
            expandRowByClick: true,
            rowExpandable: (record) => !!record.stock_options?.length,
          }}
          pagination={false}
        />
      </div>

      <NewTradePlan
        onFinish={onCreateTradePlan}
        onClose={closeCreateModal}
        open={createModalOpen}
        initialValues={{ notify: true }}
      />

      <UpdateTradePlan
        onFinish={onUpdateTradePlan}
        onClose={closeUpdateModal}
        open={updateModalOpen}
        initialValues={{
          id: selectedTradePlan?.id,
          name: selectedTradePlan?.name,
          description: selectedTradePlan?.description,
          active: selectedTradePlan?.active,
          notify: selectedTradePlan?.notify,
          stock_option_ids: selectedTradePlan?.stock_options
            ?.filter((s) => s.stock_option.symbol !== "CASH")
            .map((s) => s.stock_option.id),
        }}
      />
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
