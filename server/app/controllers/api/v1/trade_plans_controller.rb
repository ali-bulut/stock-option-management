class Api::V1::TradePlansController < Api::V1::ApplicationController
  before_action :set_trade_plan, only: [:show, :update, :destroy]

  def index
    render json: V1::TradePlanSerializer.render(current_user.trade_plans), status: :ok
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
    if @trade_plan.destroy
      head :no_content
    else
      render_error(@trade_plan.errors)
    end
  end

  private

  def set_trade_plan
    @trade_plan = current_user.trade_plans.find(params[:id])
  end

  def create_params
    params.permit(:name, :description, :amount, stock_option_ids: [])
  end

  def update_params
    params.permit(:name, :description, :active, :amount, stock_option_ids: [])
  end
end
