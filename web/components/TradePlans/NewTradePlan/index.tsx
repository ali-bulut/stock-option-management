import { FC } from "react";
import { Modal } from "antd";
import NewTradePlanForm from "./NewTradePlanForm";
import { CreateTradePlanParams } from "@/interfaces/ITradePlan";

interface NewTradePlanProps {
  onFinish: (values: CreateTradePlanParams) => void;
  initialValues?: Partial<CreateTradePlanParams>;
  open: boolean;
  onClose: () => void;
}

const NewTradePlan: FC<NewTradePlanProps> = (props) => {
  return (
    <Modal
      destroyOnClose
      title="New Trade Plan"
      footer={null}
      open={props.open}
      onCancel={props.onClose}
    >
      <NewTradePlanForm
        onFinish={props.onFinish}
        initialValues={props.initialValues}
      />
    </Modal>
  );
};

export default NewTradePlan;
