import yahooFinance from 'yahoo-finance2';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { ticker, date } = req.query;
    const symbol = (ticker || req.query.symbol || '').toUpperCase().trim();

    if (!symbol) {
      return res.status(400).json({ success: false, message: 'Ticker symbol is required' });
    }

    console.log(`Fetching options for ${symbol} (date: ${date || 'latest'})...`);

    let data = null;

    // 1. Try yahoo-finance2 package
    try {
      const queryOptions = {};
      if (date) {
        queryOptions.date = new Date(date);
      }
      data = await yahooFinance.options(symbol, queryOptions);
    } catch (yfError) {
      console.warn(`yahoo-finance2 SDK failed for ${symbol}, trying Yahoo REST fallback:`, yfError.message);
    }

    // 2. Direct REST Fallback if SDK fails or returns empty
    if (!data || !data.options || data.options.length === 0) {
      let url = `https://query2.finance.yahoo.com/v7/finance/options/${symbol}`;
      if (date) {
        const unixTimestamp = Math.floor(new Date(date).getTime() / 1000);
        url += `?date=${unixTimestamp}`;
      }

      const rawRes = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        }
      });

      if (rawRes.ok) {
        const json = await rawRes.json();
        if (json.optionChain && json.optionChain.result && json.optionChain.result.length > 0) {
          data = json.optionChain.result[0];
        }
      }
    }

    if (!data) {
      return res.status(404).json({ success: false, message: `No options data found for ticker ${symbol}` });
    }

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching options:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch options data',
      error: error.message
    });
  }
}
