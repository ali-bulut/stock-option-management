import { Typography } from "antd";
import { FC } from "react";

interface WithTooltipProps {
  text: string;
}

const WithTooltip: FC<WithTooltipProps> = (props) => {
  return (
    <Typography.Text
      className="text-inherit"
      ellipsis={{
        tooltip: (
          <Typography.Text copyable={false} className="text-inherit">
            {props.text}
          </Typography.Text>
        ),
      }}
    >
      {props.text}
    </Typography.Text>
  );
};

export default WithTooltip;
