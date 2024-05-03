import { IStockOption } from "./IStockOption";

export interface TradePlansParams {
  without_stock_options?: boolean;
}

export interface CreateTradePlanParams {
  name: string;
  description: string;
  initial_amount: number;
  notify: boolean;
  stock_option_ids: number[];
}

export interface UpdateTradePlanParams
  extends Omit<CreateTradePlanParams, "initial_amount"> {
  id: number;
  active: boolean;
}

export type ITradePlan = {
  id: number;
  active: boolean;
  created_at: string;
  description: string;
  initial_amount: number;
  name: string;
  notify: boolean;
  stock_options?: ITradePlanStockOption[];
  total_amount: number;
  transactions: ITradeTransaction[];
};

export type ITradeTransaction = {
  id: number;
  price: number;
  quantity: string;
  action: "buy" | "sell";
  amount: number;
  created_at: string;
  stock_option: IStockOption;
};

export type ITradePlanStockOption = {
  amount: number;
  quantity: string;
  cost: number;
  stock_option: IStockOption & { price: number };
  transactions: ITradeTransaction[];
};
