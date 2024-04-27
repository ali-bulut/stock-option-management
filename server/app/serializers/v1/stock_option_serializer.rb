class V1::StockOptionSerializer < V1::ApplicationSerializer
  identifier :id
  fields :symbol, :name

  view :with_price do
    field :price
  end
end