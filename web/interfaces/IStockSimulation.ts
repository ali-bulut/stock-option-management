export interface IStockSimulation {
  start_date: string;
  end_date: string;
  initial_amount: number;
  final_portfolio_value: number;
  total_return: number;
  options_used: Array<string>;
  transaction_history: Array<ITransactionHistory>;
}

export interface StockSimulationParams {
  initial_amount: number;
  stock_options: Array<string>;
}

export interface ITransactionHistory {
  action: "BUY" | "SELL";
  amount_of_options: number;
  date: string;
  price: number;
  ticker: string;
}

export interface ITransactions {
  [ticker: string]: {
    [month: number]: {
      total_price: number;
      total_shares: number;
    };
  };
}
