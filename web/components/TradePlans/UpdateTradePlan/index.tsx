import { FC } from "react";
import { Modal } from "antd";
import { UpdateTradePlanParams } from "@/interfaces/ITradePlan";
import UpdateTradePlanForm from "./UpdateTradePlanForm";

interface UpdateTradePlanProps {
  onFinish: (values: UpdateTradePlanParams) => void;
  initialValues?: Partial<UpdateTradePlanParams>;
  open: boolean;
  onClose: () => void;
}

const UpdateTradePlan: FC<UpdateTradePlanProps> = (props) => {
  return (
    <Modal
      destroyOnClose
      title="Update Trade Plan"
      footer={null}
      open={props.open}
      onCancel={props.onClose}
    >
      <UpdateTradePlanForm
        onFinish={props.onFinish}
        initialValues={props.initialValues}
      />
    </Modal>
  );
};

export default UpdateTradePlan;
