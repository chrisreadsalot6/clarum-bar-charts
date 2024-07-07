'use client'

import React, { useState, useEffect } from 'react';
import StockPicker from './components/StockPicker';
import BarChart from './components/BarChart';

// Function to fetch stock data from the API
async function getStockData(symbol: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stock?symbol=${symbol}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch stock data');
  }
  return res.json();
}

// Main component for the Home page
export default function Home({
  searchParams,
}: {
  searchParams: { symbol: string };
}) {
  // State variables
  const [symbol, setSymbol] = useState(searchParams.symbol || '');
  const [stockData, setStockData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (symbol) {
      setLoading(true);
      getStockData(symbol).then(data => {
        // Transform data for the BarChart component
        const volumeData = data.map((item: any) => ({
          value: item.volume,
          label: new Date(item.date).toLocaleDateString(),
        }));
        setStockData(volumeData);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [symbol]);

  const maxVolume = Math.max(...stockData.map((item: any) => item.value));

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <StockPicker onSelect={setSymbol} />
      {symbol ? (
        loading ? (
          <div className='mt-4'>Loading...</div>
        ) : (
          <div className="mt-8 space-y-16 overflow-auto max-h-[calc(100vh-200px)] w-full">
            <BarChart data={stockData} maxValue={maxVolume} title={`${symbol} Trading Volume`} />
          </div>
        )
      ) : (
        <>
          <p className="mt-4">Please select a stock to view its data.</p>
          <p className="mt-4">Please select AAPL to view 5000 datapoints.</p>
        </>
      )}
    </main>
  );
}
