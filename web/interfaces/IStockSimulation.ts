export interface IStockSimulation {
  start_date: string;
  end_date: string;
  initial_amount: number;
  final_portfolio_value: number;
  total_return: number;
  options_used: Array<string>;
  transaction_history: Array<string>;
}

export interface StockSimulationParams {
  initial_amount: number;
  tickers: Array<string>;
}
