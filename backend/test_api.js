import yahooFinance from 'yahoo-finance2';

async function test() {
    try {
        const quote = await yahooFinance.quote('RELIANCE.NS');
        console.log('Quote:', quote);

        const historical = await yahooFinance.historical('RELIANCE.NS', { period1: '2023-01-01' });
        console.log('Historical (last 1):', historical[historical.length - 1]);
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
