const yahooFinance = require('yahoo-finance2').default;

async function test() {
    try {
        const quote = await yahooFinance.quote('RELIANCE.NS');
        console.log('Quote:', quote);
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
