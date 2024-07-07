'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

// List of stock symbols
const stocks = [
  'AAPL', 'ADBE', 'AMZN', 'BAC', 'CRM', 'DIS', 'FB', 'GOOGL', 'HD', 'JNJ',
  'JPM', 'MA', 'MSFT', 'NFLX', 'NVDA', 'PG', 'TSLA', 'UNH', 'V', 'WMT'
];

// StockPicker component definition
const StockPicker: React.FC<{ onSelect: (symbol: string) => void }> = ({ onSelect }) => {
  const router = useRouter();

  const handleSelectStock = (symbol: string) => {
    router.push(`/?symbol=${symbol}`);
    onSelect(symbol);
  };

  return (
    // Dropdown for selecting a stock
    <select
      onChange={(e) => handleSelectStock(e.target.value)}
      className="p-2 border rounded-md"
    >
      <option value="">Select a stock</option>
      {stocks.map((stock) => (
        <option key={stock} value={stock}>
          {stock}
        </option>
      ))}
    </select>
  );
};

export default StockPicker;