class V1::TradePlanSerializer < V1::ApplicationSerializer
  identifier :id
  fields :name, :description, :amount, :active, :created_at

  association :stock_options, blueprint: V1::StockOptionSerializer
end