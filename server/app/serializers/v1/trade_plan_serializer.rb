class V1::TradePlanSerializer < V1::ApplicationSerializer
  identifier :id
  fields :name, :description, :initial_amount, :total_amount, :active, :notify, :created_at

  field :stock_options do |trade_plan|
    V1::TradePlanStockOptionSerializer.render_as_hash(trade_plan.trade_plan_stock_options)
  end
end