class V1::TradePlanSerializer < V1::ApplicationSerializer
  identifier :id
  fields :name, :description, :initial_amount, :active, :notify, :created_at

  association :transactions, blueprint: V1::TradeTransactionSerializer

  view :with_stock_options do
    fields :total_amount

    field :stock_options do |trade_plan|
      V1::TradePlanStockOptionSerializer.render_as_hash(trade_plan.trade_plan_stock_options)
    end
  end
end