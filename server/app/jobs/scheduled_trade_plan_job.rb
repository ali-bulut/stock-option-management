class ScheduledTradePlanJob < ApplicationJob
  queue_as :default

  def perform
    TradePlan.active.find_each do |trade_plan|
      TradePlanJob.perform_later(trade_plan.id)
    end
  end
end
