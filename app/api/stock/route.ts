import { NextResponse } from 'next/server';

// Constants for API key, special symbol, and output sizes
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BIG_DATA_SYMBOL = 'AAPL';
const STANDARD_DAYS = 30;
const BIG_DATA_DAYS = 5000;
const OUTPUT_SIZE_COMPACT = 'compact';
const OUTPUT_SIZE_FULL = 'full';

// Handler for GET requests to fetch stock data
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  // Validate the presence of the symbol parameter
  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  // Determine output size and number of days based on the symbol
  let outputsize = OUTPUT_SIZE_COMPACT;
  let days = STANDARD_DAYS;
  if (symbol === BIG_DATA_SYMBOL) {
    console.log('GOING BIG!')
    outputsize = OUTPUT_SIZE_FULL;
    days = BIG_DATA_DAYS;
  }

  try {
    // Fetch stock data from Alpha Vantage API
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}&outputsize=${outputsize}`
    );
    const data = await response.json();

    // Handle API error response
    if (data.Information) {
      return NextResponse.json({ error: data.Information }, { status: 400 });
    }

    // Process and format the stock data
    const timeSeries = data['Time Series (Daily)'];
    const stockData = Object.entries(timeSeries).slice(0, days).map(([date, values]: [string, any]) => ({
      date,
      volume: parseInt(values['5. volume']),
    }));

    // Return the formatted stock data
    return NextResponse.json(stockData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}