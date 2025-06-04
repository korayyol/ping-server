const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

let lastPing = Date.now();

// Ping alma kontrolü (her dakika)
setInterval(() => {
  const now = Date.now();
  if (now - lastPing > 12 * 60 * 1000) {
    sendTelegram("⚠️ Elektrik kesintisi: 12 dakikadır ping alınmıyor.");
    lastPing = now; // tekrar tekrar bildirim gönderilmesin
  }
}, 60 * 1000);

// Ping endpoint
app.post('/ping', (req, res) => {
  lastPing = Date.now();
  console.log("Ping alındı:", req.body);
  res.send("ok");
});

// Telegram bildirimi gönder
function sendTelegram(msg) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: msg
    })
  })
  .then(res => res.json())
  .then(data => console.log("Telegram bildirimi gönderildi:", data))
  .catch(err => console.error("Telegram hatası:", err));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});

