const API_KEY = '7ea51f17dab70027da0113e7'; // 
const API_URL = 'https://v6.exchangerate-api.com/v6/';

const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const amountInput = document.getElementById('amount');
const resultParagraph = document.getElementById('result');
const form = document.getElementById('converter-form');

let currencies = [];

const fetchCurrencies = async () => {
    try {
        const response = await fetch(`${API_URL}${API_KEY}/codes`);
        const data = await response.json();
        currencies = data.supported_codes;
        populateCurrencyOptions();
    } catch (error) {
        console.error('Error fetching currency codes:', error);
    }
};

const populateCurrencyOptions = () => {
    currencies.forEach(([code, name]) => {
        const optionFrom = document.createElement('option');
        optionFrom.value = code;
        optionFrom.textContent = `${code} - ${name}`;
        fromCurrencySelect.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = code;
        optionTo.textContent = `${code} - ${name}`;
        toCurrencySelect.appendChild(optionTo);
    });
};

const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    try {
        const response = await fetch(`${API_URL}${API_KEY}/latest/${fromCurrency}`);
        const data = await response.json();
        const rate = data.conversion_rates[toCurrency];
        return amount * rate;
    } catch (error) {
        console.error('Error fetching conversion rate:', error);
        return null;
    }
};

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (isNaN(amount)) {
        resultParagraph.textContent = 'Please enter a valid amount.';
        return;
    }

    const convertedAmount = await convertCurrency(amount, fromCurrency, toCurrency);
    if (convertedAmount !== null) {
        resultParagraph.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    } else {
        resultParagraph.textContent = 'Error converting currency.';
    }
});

// Initialize currency options
fetchCurrencies();
