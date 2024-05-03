class V1::TradePlanStockOptionSerializer < V1::ApplicationSerializer
  fields :quantity, :amount, :cost

  association :transactions, blueprint: V1::TradeTransactionSerializer
  association :stock_option, blueprint: V1::StockOptionSerializer, view: :with_price
end