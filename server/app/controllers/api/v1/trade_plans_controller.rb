class Api::V1::TradePlansController < Api::V1::ApplicationController
  before_action :set_trade_plan, only: [:show, :update, :destroy]
  skip_before_action :authenticate_request!, only: [:update_stock_options_quantity]

  def index
    view_name = params[:without_stock_options].present? && params[:without_stock_options] == "true" ? nil : :with_stock_options
    render json: V1::TradePlanSerializer.render(current_user.trade_plans, view: view_name), status: :ok
  end

  def show
    render json: V1::TradePlanSerializer.render(@trade_plan), status: :ok
  end

  def create
    trade_plan = current_user.trade_plans.new(create_params)

    if trade_plan.save
      render json: V1::TradePlanSerializer.render(trade_plan), status: :created
    else
      render_error(trade_plan.errors)
    end
  end

  def update
    if @trade_plan.update(update_params)
      render json: V1::TradePlanSerializer.render(@trade_plan), status: :ok
    else
      render_error(@trade_plan.errors)
    end
  end

  def destroy
    amount_to_transfer = @trade_plan.total_amount

    if @trade_plan.destroy
      current_user.transfer_amount(amount_to_transfer)
      head :no_content
    else
      render_error(@trade_plan.errors)
    end
  end

  def update_stock_options_quantity
    @trade_plan = TradePlan.find(params[:id])

    trade_actions = []

    TradePlanStockOption.transaction do
      JSON.parse(params["stock_options"]).each do |stock_option|
        stock_option = stock_option.with_indifferent_access
        trade_plan_stock_option = @trade_plan.trade_plan_stock_options.by_symbol(stock_option[:stock_option_symbol])

        if trade_plan_stock_option.quantity != stock_option[:quantity]
          if stock_option[:stock_option_symbol] != "CASH"
            quantity_change = trade_plan_stock_option.quantity - stock_option[:quantity]
            trade_actions << { symbol: stock_option[:stock_option_symbol],
                               quantity_change: quantity_change.abs.to_s,
                               action: quantity_change.positive? ? "SOLD" : "BOUGHT" }
          end

          trade_plan_stock_option.update!(quantity: stock_option[:quantity])
        end
      end
    end

    SendTradeActionEmailJob.perform_later(@trade_plan.id, trade_actions)
  end

  private

  def set_trade_plan
    @trade_plan = current_user.trade_plans.find(params[:id])
  end

  def create_params
    params.permit(:name, :description, :initial_amount, :notify, stock_option_ids: [])
  end

  def update_params
    params.permit(:name, :description, :active, :notify, stock_option_ids: [])
  end
end
