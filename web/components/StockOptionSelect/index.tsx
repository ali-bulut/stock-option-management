import { FC } from "react";
import { Button, Select, Tooltip } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import classNames from "classnames";
import useQueriedStockOptions from "@/hooks/useQueriedStockOptions";
import { IOptionValue } from "@/interfaces/IOptionValue";

export const DEFAULT_STOCK_OPTIONS = [
  "NVDA",
  "AAPL",
  "AMZN",
  "BTC-USD",
  "ETH-USD",
];

interface StockOptionSelectProps {
  selectedStockOptions?: string[];
  setSelectedStockOptions?: (stockOptions: string[]) => void;
  selectedStockOptionIds?: number[];
  setSelectedStockOptionIds?: (stockOptionIds: number[]) => void;
  disableMaxCount?: boolean;
  hideDefaultOptions?: boolean;
  disableStatusCheck?: boolean;
}

const StockOptionSelect: FC<StockOptionSelectProps> = (props) => {
  const {
    options: stockOptions,
    isLoading: stockOptionsIsLoading,
    setQuery: setStockOptionsQuery,
  } = useQueriedStockOptions();

  const selectValues =
    props.selectedStockOptions?.map((stockOption) => ({
      id: stockOptions.find((option) => option.value === stockOption)?.id,
      label: stockOption,
      value: stockOption,
    })) ||
    props.selectedStockOptionIds?.map((stockOptionId) => ({
      id: stockOptionId,
      label: stockOptions.find((option) => option.id === stockOptionId)?.value,
      value: stockOptions.find((option) => option.id === stockOptionId)?.value,
    }));

  const onStockOptionSelect = (data: IOptionValue) => {
    if (props.setSelectedStockOptions) {
      props.setSelectedStockOptions([
        ...props.selectedStockOptions!,
        data.value,
      ]);
    }

    if (props.setSelectedStockOptionIds) {
      props.setSelectedStockOptionIds!([
        ...props.selectedStockOptionIds!,
        data.id!,
      ]);
    }

    setStockOptionsQuery("");
  };

  const onStockOptionClear = () => {
    props.setSelectedStockOptions?.([]);
    props.setSelectedStockOptionIds?.([]);
    setStockOptionsQuery("");
  };

  const onDeselect = (data: IOptionValue) => {
    if (props.setSelectedStockOptions) {
      props.setSelectedStockOptions(
        props.selectedStockOptions!.filter(
          (stockOption) => stockOption !== data.value
        )
      );
    }

    if (props.setSelectedStockOptionIds) {
      props.setSelectedStockOptionIds(
        props.selectedStockOptionIds!.filter(
          (stockOption) => stockOption !== data.id
        )
      );
    }
  };

  const onReset = () => props.setSelectedStockOptions?.(DEFAULT_STOCK_OPTIONS);

  return (
    <div className="grid grid-cols-6 gap-2">
      <Select
        className={classNames(
          props.hideDefaultOptions ? "col-span-6" : "col-span-5"
        )}
        loading={stockOptionsIsLoading}
        onSearch={setStockOptionsQuery}
        onClear={onStockOptionClear}
        onSelect={(value, option) => onStockOptionSelect(option)}
        onDeselect={(value, option) => onDeselect(option)}
        maxCount={props.disableMaxCount ? undefined : 7}
        options={stockOptions}
        showSearch
        labelInValue
        allowClear
        filterOption={false}
        value={selectValues}
        mode="multiple"
        placeholder="Select stock options"
        status={
          props.disableStatusCheck
            ? undefined
            : !props.selectedStockOptions?.length
            ? "error"
            : undefined
        }
      />
      {props.hideDefaultOptions ? undefined : (
        <Tooltip title="Apply Default Options">
          <Button className="col-span-1" onClick={onReset}>
            <ReloadOutlined />
          </Button>
        </Tooltip>
      )}
    </div>
  );
};

export default StockOptionSelect;
