class PopulateStockOptions < ActiveRecord::Migration[7.0]
  def up
    stock_options = [
      { symbol: 'CASH', name: 'Cash' },
      { symbol: 'ABNB', name: 'Airbnb Inc.' },
      { symbol: 'ADBE', name: 'Adobe Inc.' },
      { symbol: 'AMD', name: 'Advanced Micro Devices Inc.' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.' },
      { symbol: 'AAPL', name: 'Apple Inc.' },
      { symbol: 'ADSK', name: 'Autodesk Inc.' },
      { symbol: 'DDOG', name: 'Datadog Inc.' },
      { symbol: 'EA', name: 'Electronic Arts Inc.' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.' },
      { symbol: 'INTC', name: 'Intel Corporation' },
      { symbol: 'META', name: 'Meta Platforms Inc.' },
      { symbol: 'MSFT', name: 'Microsoft Corporation' },
      { symbol: 'NFLX', name: 'Netflix Inc.' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation' },
      { symbol: 'QCOM', name: 'Qualcomm Inc.' },
      { symbol: 'PEP', name: 'PepsiCo Inc' },
      { symbol: 'SBUX', name: 'Starbucks Corporation' },
      { symbol: 'TMUS', name: 'T-Mobile US Inc.' },
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
