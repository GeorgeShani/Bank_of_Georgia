let _BOGConvertCurrenciesAPI = "https://bankofgeorgia.ge/api/currencies/convert";
let _BOGCalculateLoanAPI = "https://bankofgeorgia.ge/api/main-page/calculate";
const _BOGCurrencyHistoryAPI = "https://bankofgeorgia.ge/api/currencies/history/";

async function fetchData(apiEndpoint) {
    try {
        const response = await fetch(apiEndpoint);
        const data = response.json();
        return data;
    } catch(error) {
        console.log(`Error fetching data from ${apiEndpoint}: `, error);
        return null;
    }
}

async function displayCurrencies() {
    const currencyData = await fetchData(_BOGCurrencyHistoryAPI);
    if(!currencyData) return;

    const currencyTable = document.getElementById("currency-info-table");
    
    currencyData.data.forEach((currency) => {
        currencyTable.innerHTML += `
            <div class="currency-card">
                <div class="currency-name">
                    <div class="cont-inner">
                        <div class="currency-symbol" style="background-color: 
                        ${currency.difference > 0 ? "#06A74C" : currency.difference == 0 ? "#E1E1E1" : "#E22820" };">
                            <p style="color: ${currency.difference == 0 ? "#131313" : "#fff"};">${currency.ccy}</p>
                        </div>
                        <p class="name">${currency.rateWeight} ${currency.name}</p>
                    </div>
                </div>
                <div class="official-value">
                    <div class="cont-inner">
                        <div class="current-rate">
                            <p>${currency.currentRate}</p>
                        </div>
                        <div class="difference" style="color: 
                        ${currency.difference > 0 ? "#06A74C" : 
                        currency.difference == 0 ? "#131313" : "#E22820"}">
                            <p>${currency.difference > 0 ? `<i class="fa-solid fa-arrow-up"></i> ${currency.difference}` : 
                            currency.difference == 0 ? `${currency.difference}` : 
                            `<i class="fa-solid fa-arrow-down"></i> ${Math.abs(currency.difference)}`}</p>
                        </div>
                    </div>
                </div>
                <div class="commercial-value">
                    <div class="cont-inner">
                        <div class="buy-rate">
                            <p>${currency.buyRate}</p>
                        </div>
                        <div class="sell-rate">
                            <p>${currency.sellRate}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

async function fillSelects() {
    const currencyData = await fetchData(_BOGCurrencyHistoryAPI);
    if (!currencyData) return;

    const fromCurrencySelect = document.getElementById("fromCurrency");
    const toCurrencySelect = document.getElementById("toCurrency");

    currencyData.data.forEach((currency) => {
        fromCurrencySelect.innerHTML += `<option value="${currency.ccy}">${currency.name}</option>`;
        toCurrencySelect.innerHTML += `<option value="${currency.ccy}">${currency.name}</option>`;
    });
}

function swapCurrencies() {
    const fromCurrencySelect = document.getElementById("fromCurrency");
    const toCurrencySelect = document.getElementById("toCurrency");

    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    convertCurrencies();
}

async function convertCurrencies() {
    let fromCurrency = document.getElementById("fromCurrency").value;
    let toCurrency = document.getElementById("toCurrency").value;
    let amount = document.getElementById("fromCurrencyAmount").value;

    let _fullUrl = _BOGConvertCurrenciesAPI + `/${fromCurrency}/${toCurrency}?amountFrom=${amount}`;

    const currencyData = await fetchData(_fullUrl);
    if (!currencyData) return;

    let conversionResult = document.getElementById("conversion-result");
    conversionResult.innerHTML = `${amount} ${fromCurrency} = ${currencyData.data.amount} ${toCurrency}`;
}

async function calculateLoan() {
    let currency = document.getElementById("loanCurrency").value;
    let loanType = document.getElementById("loanType").value;
    let paymentCount = document.getElementById("paymentCount").value;
    let amount = document.getElementById("loanAmount").value;

    let _fullUrl = _BOGCalculateLoanAPI + `?ccy=${currency}&paymentCount=${paymentCount}&principalAmount=${amount}&loanType=${loanType}`;

    const loanData = await fetchData(_fullUrl);
    if(!loanData) return;

    if (loanType === "CNS") {
        if (amount < 400) {
            alert("სამომხმარებლო სესხის მინიმალური თანხა 400 ლარია");
            return;
        } else if (amount > 75000) {
            alert("სამომხმარებლო სესხის მაქსიმალური თანხა 75000 ლარია");
            return;
        }
    }

    if (loanType === "MRT" && amount < 1500) {
        if (currency == "GEL") {
            alert("იპოთეკური სესხის მინიმალური თანხა 1500 ლარია");
            return;
        } else if (currency == "EUR") {
            alert("იპოთეკური სესხის მინიმალური თანხა 1500 ევროა");
            return;
        } else if (currency == "USD") {
            alert("იპოთეკური სესხის მინიმალური თანხა 1500 აშშ დოლარია");
            return;
        }
    } 

    let calculationOutput = document.getElementById("calculationOutput");
    let monthlyPaymentAmount = document.getElementById("monthlyPaymentAmount");
    let minRateInfo = document.getElementById("minRateInfo");
    let maxRateInfo = document.getElementById("maxRateInfo");
    let principalAmountInfo = document.getElementById("principalAmountInfo");
    let paymentCountInfo = document.getElementById("paymentCountInfo");

    minRateInfo.innerHTML = `<span>${loanData.data.minInterestRate}%</span>-დან`;
    maxRateInfo.innerHTML = `<span>${loanData.data.maxInterestRate}%</span>-დან`;
    monthlyPaymentAmount.innerText = `${loanData.data.paymentAmount} ${loanData.data.ccy == "USD" ? "$" : loanData.data.ccy == "EUR" ? "€" : "₾"}`;
    principalAmountInfo.innerHTML = `<span>${loanData.data.principalAmount} ${loanData.data.ccy == "USD" ? "$" : loanData.data.ccy == "EUR" ? "€" : "₾"}</span>`;
    paymentCountInfo.innerHTML = `<span>${loanType === "CNS" ? loanData.data.paymentCount : (loanData.data.paymentCount / 12)}</span> ${loanType === "CNS" ? "თვე" : "წელი"}`;

    calculationOutput.style["display"] = "flex";
    calculationOutput.style["flex-direction"] = "column";
    calculationOutput.style["align-items"] = "center";
    calculationOutput.style["justify-content"] = "center";

    calculationOutput.scrollIntoView({ behavoir: "smooth", block: "center", inline: "nearest" });
}

function manageOptions() {
    let loanType = document.getElementById("loanType");
    let currencyInput = document.getElementById("loanCurrency");
    let paymentCountInput = document.getElementById("paymentCount");

    currencyInput.innerHTML = "<option disabled selected>Loan Currency</option>";
    paymentCountInput.innerHTML = "<option disabled selected>Payment Count</option>";

    let currenciesArray = [
        { name: "ევრო", value: "EUR" },
        { name: "ლარი", value: "GEL" },
        { name: "აშშ დოლარი", value: "USD" }
    ];

    if (loanType.value === "CNS") {
        currencyInput.innerHTML += `<option value="GEL">ლარი</option>`;

        for (let i = 3; i <= 48; i++) {
            paymentCountInput.innerHTML += `
                <option value="${i}">${i} თვე</option>
            `;
        }
    }

    if (loanType.value === "MRT") {
        currenciesArray.forEach((currency) => {
            currencyInput.innerHTML += `
                <option value="${currency.value}">${currency.name}</option>
            `;
        });

        for (let i = 1; i <= 20; i++) {
            paymentCountInput.innerHTML += `
                <option value="${i * 12}">${i} წელი</option>
            `;
        }
    }
}

function displaySubscriptionMessage() {
    const emailInputValue = document.getElementById("email-input").value;
    const subscriptionMessage = document.getElementById("subscription-message");

    if (emailInputValue === "") {
        subscriptionMessage.innerText = "გთხოვთ შეიყვანოთ ელ. ფოსტა";
        subscriptionMessage.style.color = "#F15956";
    } else if (!validateEmail(emailInputValue)) {
        subscriptionMessage.innerText = "არასწორია ელ. ფოსტა";
        subscriptionMessage.style.color = "#F15956";
    } else {
        document.getElementById("email-input").value = "";
        subscriptionMessage.innerText = "თქვენ წარმატებით გამოწერეთ არხი. გთხოვთ, შეამოწმოთ თქვენი ელ. ფოსტა";
        subscriptionMessage.style.color = "#6D7780";
    }
}

function checkCredentials() {
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;

    if (username === "" && password === "") {
        alert("გთხოვთ შეავსოთ საჭირო ველები");
        return;
    }

    if (username === "") {
        showError("usernameInput", "username-error-message", "The field is required. Please fill it first!");
        return;
    } else if (!validateUsername(username)) {
        showError("usernameInput", "username-error-message", "The username is not valid. Please try again!");
        return;
    } else {
        hideError("usernameInput", "username-error-message");
    }

    if (password === "") {
        showError("passwordInput", "password-error-message", "The field is required. Please fill it first!");
    } else if (!validatePassword(password)) {
        showError("passwordInput", "password-error-message", "Password must contain special characters, numbers, lowercase and capital letters!");
        return;
    } else {
        hideError("passwordInput", "password-error-message");
    }

    if ((username !== "" && password !== "") && (validateUsername(username) && validatePassword(password))) {
        alert("You are authorized [ not really ;) ]");
        document.getElementById("usernameInput").value = "";
        document.getElementById("passwordInput").value = "";
    }
}

function validateUsername(username) {
    const regex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/igm;
    return regex.test(username);
}

function validateEmail(email) {
    const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    return regex.test(email);
}

function validatePassword(password) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    return regex.test(password);
}

function showError(inputID, errorID, errorMessage) {
    const input = document.getElementById(inputID);
    const error = document.getElementById(errorID);
    input.style.borderColor = "#f52c25";
    error.innerText = errorMessage;
}

function hideError(inputID, errorID) {
    const input = document.getElementById(inputID);
    const error = document.getElementById(errorID);
    input.style.borderColor = "#d5d5d5";
    error.innerText = "";
}

fillSelects();
displayCurrencies();


// Event listeners
document.addEventListener("DOMContentLoaded", function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinksContainer = document.querySelector('.navigation-links-container');

    burgerMenu.addEventListener('click', function () {
        navLinksContainer.classList.toggle('show');
        toggleBurgerMenu();
    });

    function toggleBurgerMenu() {
        burgerMenu.classList.toggle('open');

        if (!burgerMenu.classList.contains('open')) {
            navLinksContainer.classList.remove('show');
        }
    }
});


document.addEventListener("DOMContentLoaded", function() {
    const fromCurrencySelect = document.getElementById("fromCurrency");
    const toCurrencySelect = document.getElementById("toCurrency");

    fromCurrencySelect.addEventListener("change", convertCurrencies);
    toCurrencySelect.addEventListener("change", convertCurrencies);

    const amountInput = document.getElementById("fromCurrencyAmount");
    amountInput.addEventListener("keypress", function(event) {
        if (event.key == "Enter") {
            event.preventDefault();
            convertCurrencies();
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const loanTypeSelect = document.getElementById("loanType");
    loanTypeSelect.addEventListener("change", manageOptions);
});

document.addEventListener("DOMContentLoaded", function() {
    const emailInput = document.getElementById("email-input");
    emailInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            displaySubscriptionMessage();
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    let currentYear = new Date().getFullYear();

    const copyrightInfo = document.getElementById("copyright-info");
    copyrightInfo.innerHTML = `&copy; ${currentYear} საქართველოს ბანკი`;

    const copyrightInfoNavBar = document.getElementById("copy-info-nav-bar");
    copyrightInfoNavBar.innerHTML = `&copy; 1997 - ${currentYear} საქართველოს ბანკი`;
});

document.addEventListener("DOMContentLoaded", function() {
    let currentYear = new Date().getFullYear();
    const copyrightInfoForm = document.getElementById("form-copy-info");
    copyrightInfoForm.innerHTML = `&copy; 1997 - ${currentYear} საქართველოს ბანკი`;
});