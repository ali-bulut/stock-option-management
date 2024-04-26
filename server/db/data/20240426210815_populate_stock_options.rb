class PopulateStockOptions < ActiveRecord::Migration[7.0]
  def up
    stock_options = [
      { symbol: 'AIY.DE', name: 'Activision Blizzard Inc.' },
      { symbol: 'ADBE', name: 'Adobe Inc.' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.' },
      { symbol: 'AAPL', name: 'Apple Inc.' },
      { symbol: 'ADSK', name: 'Autodesk Inc.' },
      { symbol: 'DELL', name: 'Dell Technologies Inc.' },
      { symbol: 'DIS', name: 'The Walt Disney Company' },
      { symbol: 'EBAY', name: 'eBay Inc.' },
      { symbol: 'EA', name: 'Electronic Arts Inc.' },
      { symbol: 'ERIC', name: 'LM Ericsson Telefon AB' },
      { symbol: 'INTC', name: 'Intel Corporation' },
      { symbol: 'META', name: 'Meta Platforms Inc.' },
      { symbol: 'MSFT', name: 'Microsoft Corporation' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation' },
      { symbol: 'ORCL', name: 'Oracle Corporation' },
      { symbol: 'QCOM', name: 'Qualcomm Inc.' },
      { symbol: 'SBUX', name: 'Starbucks Corporation' },
      { symbol: 'T', name: 'AT&T Inc.' },
      { symbol: 'TSLA', name: 'Tesla Inc.' },
      { symbol: 'WBD', name: 'Discovery Inc.' },
      { symbol: 'BTC-USD', name: 'Bitcoin' },
      { symbol: 'ETH-USD', name: 'Ethereum' },
      { symbol: 'BNB-USD', name: 'Binance Coin' },
      { symbol: 'SOL-USD', name: 'Solana' },
      { symbol: 'XRP-USD', name: 'XRP' }
    ]
    StockOption.create(stock_options)
  end

  def down
    StockOption.destroy_all
  end
end
