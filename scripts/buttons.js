function changeLocationButton(windowLocation) {
    window.open(windowLocation, "_blank");
}

// Slider buttons in index.html
function openPage1() { changeLocationButton("https://bankofgeorgia.ge/ka/retail/cards"); }
function openPage2() { changeLocationButton("https://bankofgeorgia.ge/ka/retail/set"); }
function openPage3() { changeLocationButton("https://miamiadschool.de/nika2024"); }
function openPage4() { changeLocationButton("https://bankofgeorgia.ge/ka/retail/cifruli-banki/manqanis-sivrtse"); }
function openPage5() { changeLocationButton("https://bankofgeorgia.ge/ka/retail/gzavnilebis-aqcia"); }

// Other buttons in index.html
function openAllOffers() { changeLocationButton("https://bankofgeorgia.ge/ka/offers-hub"); }
function openAllNewFeatures() { changeLocationButton("https://bankofgeorgia.ge/ka/about/news"); }

// More about loans button in loan.html
function openLoansPage() { changeLocationButton("https://bankofgeorgia.ge/ka/retail/seskhebi") }

// Relocations to login.html
function goToFormPage() { window.location.href = "./pages/login.html"; }
function goToLoginPage() { window.location.href = "./login.html"; }

function updateData() { changeLocationButton("https://account.bog.ge/auth/realms/bog/login-actions/registration?client_id=ribweb&tab_id=fnWkDdi0cRY&flowName=resetCredential"); }
function goToRegistration() { changeLocationButton("https://account.bog.ge/auth/realms/bog/login-actions/registration?client_id=ribweb&tab_id=CH6q9G_Q2OE&flowName=registration") };

// Shows How to use QR code
function showQRInfo() { alert("1) გახსენი მობილბანკი\n2) დააჭირე QR-ს\n3) და დაასკანერე კოდი"); }