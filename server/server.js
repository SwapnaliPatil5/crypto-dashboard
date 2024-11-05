const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Update with your MySQL username
    password: 'cdac',  // Update with your MySQL password
    database: 'crypto_dashboard'
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL database");
});

// Fetch and store top 10 results from WazirX API
const fetchCryptoData = async () => {
    try {
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
        const tickers = Object.values(response.data)     // Convert the object to an array
            .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume))  // Sort by volume
            .slice(0, 10);  // Get top 10 results

        const query = "REPLACE INTO crypto_data (name, last, buy, sell, volume, base_unit) VALUES ?";
        const values = tickers.map(ticker => [
            ticker.name, ticker.last, ticker.buy, ticker.sell, ticker.volume, ticker.base_unit
        ]);

        db.query(query, [values], (err) => {
            if (err) throw err;
            console.log("Top 10 data inserted/updated successfully.");
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// Run fetchCryptoData every minute (60000 ms)
setInterval(fetchCryptoData, 60000);
fetchCryptoData();  // Initial fetch when server starts

// API route to get data from MySQL and send it to the frontend
app.get('/crypto', (req, res) => {
    db.query("SELECT * FROM crypto_data", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
