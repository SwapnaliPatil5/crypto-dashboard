document.addEventListener("DOMContentLoaded", () => {
    fetch('/crypto')
        .then(response => response.json())
        .then(data => displayCryptoData(data))
        .catch(error => console.error("Error fetching data:", error));
});

function displayCryptoData(data) {
    const cryptoRows = document.getElementById("crypto-rows");
    cryptoRows.innerHTML = '';  // Clear any existing rows

    data.forEach((crypto, index) => {
        const row = document.createElement("div");
        row.classList.add("crypto-row");
        row.innerHTML = `
            <div>${index + 1}</div>
            <div>${crypto.name}</div>
            <div>₹ ${crypto.last}</div>
            <div>₹ ${crypto.buy} / ₹ ${crypto.sell}</div>
            <div>${((crypto.buy - crypto.sell) / crypto.sell * 100).toFixed(2)}%</div>
            <div>₹ ${Math.abs(crypto.buy - crypto.sell).toFixed(2)}</div>
        `;
        cryptoRows.appendChild(row);
    });
}
