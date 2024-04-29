import { FC, useEffect, useState } from "react";
import { Button, Form, Input, Switch } from "antd";
import { UpdateTradePlanParams } from "@/interfaces/ITradePlan";
import StockOptionSelect from "@/components/StockOptionSelect";

interface UpdateTradePlanFormProps {
  onFinish: (values: UpdateTradePlanParams) => void;
  initialValues?: Partial<UpdateTradePlanParams>;
}

const UpdateTradePlanForm: FC<UpdateTradePlanFormProps> = (props) => {
  const [form] = Form.useForm();
  const [selectedStockOptionIds, setSelectedStockOptionIds] = useState<
    number[]
  >(props.initialValues?.stock_option_ids || []);

  const onSelectStockOption = (stockOptionIds: number[]) => {
    setSelectedStockOptionIds(stockOptionIds);
    form.setFieldValue("stock_option_ids", stockOptionIds);
  };

  useEffect(() => {
    form.setFieldValue(
      "stock_option_ids",
      props.initialValues?.stock_option_ids
    );
  }, [props.initialValues?.stock_option_ids]);

  return (
    <Form
      form={form}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 30 }}
      layout="horizontal"
      initialValues={props.initialValues}
      onFinish={props.onFinish}
    >
      <Form.Item label="ID" name="id" className="hidden">
        <Input />
      </Form.Item>
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

      <Form.Item label="Activate Trading" name="active">
        <Switch />
      </Form.Item>

      <div className="flex justify-end">
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </div>
    </Form>
  );
};

export default UpdateTradePlanForm;
