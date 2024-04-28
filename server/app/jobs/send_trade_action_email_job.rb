class SendTradeActionEmailJob < ApplicationJob
  queue_as :default

  def perform(trade_plan_id, trade_actions)
    trade_plan = TradePlan.find_by_id(trade_plan_id)
    return if trade_plan.blank? || !trade_plan.notify || trade_actions.blank?

    stock_options = trade_plan.trade_plan_stock_options.exclude_cash.order_by_quantity.map do |stock_option|
      { symbol: stock_option.symbol, quantity: stock_option.quantity, amount: MoneyFormatHelper.to_currency(stock_option.amount) }
    end

    total_amount_of_trade_plan = trade_plan.total_amount
    total_return = ((total_amount_of_trade_plan - trade_plan.initial_amount).to_f / trade_plan.initial_amount) * 100

    subs = { user: { name: trade_plan.user.name }, trade_actions: trade_actions,
             trade_plan: { name: trade_plan.name,
                           initial_amount: MoneyFormatHelper.to_currency(trade_plan.initial_amount),
                           total_amount: MoneyFormatHelper.to_currency(total_amount_of_trade_plan),
                           total_return: total_return.round(2),
                           stock_options: stock_options }}
    personalizations = [{ to: trade_plan.user.email, subs: subs }]

    AppMailerJob.perform_later(personalizations, "d-f8d51a04d34848efbe0e125c442e7bb9")
  end
end
