class V1::StockOptionSerializer < V1::ApplicationSerializer
  identifier :id
  fields :symbol, :name
end