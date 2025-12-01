import yahooFinance from 'yahoo-finance2';

const CACHE_TTL = 60 * 1000; // 60 seconds
const cache = {};

// Suppress notices if needed
yahooFinance.suppressNotices(['ripHistorical']);

export const getStockQuote = async (symbol) => {
    const now = Date.now();
    if (cache[symbol] && (now - cache[symbol].timestamp < CACHE_TTL)) {
        return cache[symbol].data;
    }

    try {
        const quote = await yahooFinance.quote(symbol);
        cache[symbol] = {
            timestamp: now,
            data: quote
        };
        return quote;
    } catch (error) {
        console.error(`Error fetching quote for ${symbol}:`, error);
        // Return cached data if available even if expired, to be resilient
        if (cache[symbol]) return cache[symbol].data;
        throw error;
    }
};

export const getStockQuotes = async (symbols) => {
    return Promise.all(symbols.map(s => getStockQuote(s).catch(e => null)));
};

export const searchStocks = async (query) => {
    try {
        const result = await yahooFinance.search(query);
        return result.quotes.filter(q => q.isYahooFinance); // Filter valid ones
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
};

export const getMarketNews = async () => {
    try {
        const result = await yahooFinance.search('India Stock Market', { newsCount: 10 });
        return result.news || [];
    } catch (error) {
        console.error('News error:', error);
        return [];
    }
};
