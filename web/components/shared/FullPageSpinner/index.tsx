import { FC } from "react";
import { Card, Spin } from "antd";

interface FullPageSpinnerProps {}

const FullPageSpinner: FC<FullPageSpinnerProps> = (props) => {
  return (
    <Card className="w-screen rounded-none h-screen absolute z-50 inset-0 flex items-center justify-center bg-opacity-30 animate-pulse">
      <Spin size="large" />
    </Card>
  );
};

export default FullPageSpinner;
