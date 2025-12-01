import { getStockQuote, getStockQuotes, searchStocks } from './lib/stockService.js';

async function test() {
    try {
        console.log('Testing getStockQuote...');
        const quote = await getStockQuote('RELIANCE.NS');
        console.log('Quote:', quote?.symbol, quote?.regularMarketPrice);

        console.log('Testing getStockQuotes...');
        const quotes = await getStockQuotes(['TCS.NS', 'INFY.NS']);
        console.log('Quotes:', quotes.map(q => q?.symbol));

        console.log('Testing searchStocks...');
        const search = await searchStocks('Tata');
        console.log('Search:', search.length > 0 ? search[0].symbol : 'No results');

    } catch (error) {
        console.error('Error:', error);
    }
}

test();
