const API_KEY = '50e2c4d5d6f4b0bcadd7f589312f3897c25fc070166bc763f95dad0b1cede926';

export const loadTickers = tickers => 
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers.join(',')}&api_key=${API_KEY}`
  ).then(r => r.json()).then(rawData => Object.fromEntries(
    Object.entries(rawData).map(( [key,value]) => [key, 1 / value])
  ));
