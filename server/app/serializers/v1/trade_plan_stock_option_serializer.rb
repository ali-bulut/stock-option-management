class V1::TradePlanStockOptionSerializer < V1::ApplicationSerializer
  fields :quantity, :amount
  association :stock_option, blueprint: V1::StockOptionSerializer, view: :with_price
end