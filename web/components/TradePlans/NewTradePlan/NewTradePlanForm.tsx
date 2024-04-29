import StockOptionSelect from "@/components/StockOptionSelect";
import { CreateTradePlanParams } from "@/interfaces/ITradePlan";
import { Button, Form, Input, InputNumber, Switch } from "antd";
import { FC, useState } from "react";

interface CreateTradePlanFormProps {
  onFinish: (values: CreateTradePlanParams) => void;
  initialValues?: Partial<CreateTradePlanParams>;
}

const CreateTradePlanForm: FC<CreateTradePlanFormProps> = (props) => {
  const [form] = Form.useForm();
  const [selectedStockOptionIds, setSelectedStockOptionIds] = useState<
    number[]
  >([]);

  const onSelectStockOption = (stockOptionIds: number[]) => {
    setSelectedStockOptionIds(stockOptionIds);
    form.setFieldValue("stock_option_ids", stockOptionIds);
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 30 }}
      layout="horizontal"
      initialValues={props.initialValues}
      onFinish={props.onFinish}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input placeholder="Enter name of your trade plan" />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true }]}
      >
        <Input.TextArea placeholder="Enter description of your trade plan" />
      </Form.Item>
      <Form.Item
        label="Amount"
        name="initial_amount"
        rules={[{ required: true }]}
      >
        <InputNumber
          addonBefore="$"
          className="w-full"
          placeholder="Enter amount to trade in this plan"
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>
      <Form.Item
        label="Stock Options"
        name="stock_option_ids"
        rules={[{ required: true }]}
      >
        <StockOptionSelect
          selectedStockOptionIds={selectedStockOptionIds}
          setSelectedStockOptionIds={onSelectStockOption}
          disableMaxCount
          disableStatusCheck
          hideDefaultOptions
        />
      </Form.Item>
      <Form.Item label="Notify Each Trade" name="notify">
        <Switch />
      </Form.Item>

      <div className="flex justify-end">
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </div>
    </Form>
  );
};

export default CreateTradePlanForm;
