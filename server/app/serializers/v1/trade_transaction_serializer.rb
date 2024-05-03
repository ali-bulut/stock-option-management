class V1::TradeTransactionSerializer < V1::ApplicationSerializer
  identifier :id
  fields :price, :quantity, :action, :amount, :created_at

  association :stock_option, blueprint: V1::StockOptionSerializer
end