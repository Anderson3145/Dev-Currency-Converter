// DOM Elements
const convertButton = document.querySelector("#convert-button");
const amountInput = document.querySelector("#amount-input");
const fromCurrencySelect = document.querySelector("#from-currency");
const toCurrencySelect = document.querySelector("#to-currency");

// Base currency elements
const baseCurrencyName = document.querySelector("#base-currency-name");
const baseCurrencyImage = document.querySelector("#base-currency-image");
const baseCurrencyValue = document.querySelector(".currency-value-base");

// Target currency elements
const targetCurrencyName = document.querySelector("#target-currency-name");
const targetCurrencyImage = document.querySelector("#target-currency-image");
const targetCurrencyValue = document.querySelector("#target-currency-value");

// Control variable to enable automatic conversion after first manual one
let conversionDone = false;

// Mapping of currencies to API codes
const currencyApiMap = {
  real: "BRL",
  dolar: "USD-BRL",
  euro: "EUR-BRL",
  libra: "GBP-BRL",
  bitcoin: "BTC-BRL"
};

// Fetch current exchange rate from API
async function fetchExchangeRate(currency) {
  const url = `https://economia.awesomeapi.com.br/json/last/${currency}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    const code = Object.keys(data)[0];
    return data[code].bid;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    alert("Failed to fetch exchange rate. Please try again later.");
    return null;
  }
}

// Main conversion function
async function convertCurrency() {
  const inputString = amountInput.value;
  let amount = parseFloat(inputString.replace(",", "."));

  if (isNaN(amount)) {
    alert("Please enter a valid numeric value.");
    return;
  }

  const fromCurrency = fromCurrencySelect.value;
  const toCurrency = toCurrencySelect.value;

  const fromCode = currencyApiMap[fromCurrency];
  const toCode = currencyApiMap[toCurrency];

  // Get exchange rates
  const [fromRateResponse, toRateResponse] = await Promise.all([
    fetchExchangeRate(fromCode.includes("BRL") ? fromCode : `${fromCode}-BRL`),
    fetchExchangeRate(toCode.includes("BRL") ? toCode : `${toCode}-BRL`)
  ]);

  const fromRate = fromRateResponse || 1;
  const toRate = toRateResponse || 1;

  // Calculate converted value
  const amountInBRL = amount * fromRate;
  const convertedAmount = amountInBRL / toRate;

  // Display original amount based on selected currency
  if (fromCurrency === "real") {
    baseCurrencyValue.innerHTML = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(amount);
  } else if (fromCurrency === "dolar") {
    baseCurrencyValue.innerHTML = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  } else if (fromCurrency === "euro") {
    baseCurrencyValue.innerHTML = new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR"
    }).format(amount);
  } else if (fromCurrency === "libra") {
    baseCurrencyValue.innerHTML = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP"
    }).format(amount);
  } else if (fromCurrency === "bitcoin") {
    baseCurrencyValue.textContent = `${amount.toFixed(5)} BTC`;
  }

  // Display converted amount
  if (toCurrency === "bitcoin") {
    targetCurrencyValue.textContent = `${convertedAmount.toFixed(5)} BTC`;
  } else {
    targetCurrencyValue.textContent = new Intl.NumberFormat(
      toCurrency === "dolar" ? "en-US" :
      toCurrency === "euro" ? "de-DE" :
      toCurrency === "libra" ? "en-GB" : "pt-BR",
      {
        style: "currency",
        currency:
          toCurrency === "dolar" ? "USD" :
          toCurrency === "euro" ? "EUR" :
          toCurrency === "libra" ? "GBP" :
          "BRL"
      }
    ).format(convertedAmount);
  }
}

// Validate and start conversion
function validateAndConvert() {
  const inputString = amountInput.value;
  let amount = parseFloat(inputString.replace(",", "."));

  if (isNaN(amount)) {
    alert("Please enter a valid numeric value.");
    return;
  }

  convertCurrency();
  conversionDone = true;
}

// Update names and images when selection changes
function updateCurrencyDisplay() {
  const fromCurrency = fromCurrencySelect.value;
  const toCurrency = toCurrencySelect.value;

  switch (fromCurrency) {
    case "real":
      baseCurrencyName.textContent = "Brazilian Real";
      baseCurrencyImage.src = "./assets/Real.png";
      break;
    case "dolar":
      baseCurrencyName.textContent = "US Dollar";
      baseCurrencyImage.src = "./assets/Dollar.png";
      break;
    case "euro":
      baseCurrencyName.textContent = "Euro";
      baseCurrencyImage.src = "./assets/Euro.png";
      break;
    case "libra":
      baseCurrencyName.textContent = "British Pound";
      baseCurrencyImage.src = "./assets/Libra 1.png";
      break;
    case "bitcoin":
      baseCurrencyName.textContent = "Bitcoin";
      baseCurrencyImage.src = "./assets/Bitcoin.png";
      break;
  }

  switch (toCurrency) {
    case "real":
      targetCurrencyName.textContent = "Brazilian Real";
      targetCurrencyImage.src = "./assets/Real.png";
      break;
    case "dolar":
      targetCurrencyName.textContent = "US Dollar";
      targetCurrencyImage.src = "./assets/Dollar.png";
      break;
    case "euro":
      targetCurrencyName.textContent = "Euro";
      targetCurrencyImage.src = "./assets/Euro.png";
      break;
    case "libra":
      targetCurrencyName.textContent = "British Pound";
      targetCurrencyImage.src = "./assets/Libra 1.png";
      break;
    case "bitcoin":
      targetCurrencyName.textContent = "Bitcoin";
      targetCurrencyImage.src = "./assets/Bitcoin.png";
      break;
  }
}

// Event listeners
convertButton.addEventListener("click", validateAndConvert);

// Automatic conversion after first click
amountInput.addEventListener("input", () => {
  if (conversionDone) convertCurrency();
});

fromCurrencySelect.addEventListener("change", () => {
  updateCurrencyDisplay();
  if (conversionDone) convertCurrency();
});

toCurrencySelect.addEventListener("change", () => {
  updateCurrencyDisplay();
  if (conversionDone) convertCurrency();
});

// Initial setup
window.addEventListener("load", () => {
  updateCurrencyDisplay();
});