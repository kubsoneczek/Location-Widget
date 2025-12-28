const API_KEY = "PUT_YOUR_API_KEY_HERE";
const UNITS = "metric";

let timezoneOffset = 0;

// ⏰ TIME WITH CITY TIMEZONE
function updateTime() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const localTime = new Date(utc + timezoneOffset * 1000);

  const h = String(localTime.getHours()).padStart(2, "0");
  const m = String(localTime.getMinutes()).padStart(2, "0");

  document.getElementById("time").textContent = `${h}:${m}`;
}
setInterval(updateTime, 1000);

// 🌍 LOCATION + TEMP + FLAG
async function loadLocationAndData() {
  const locText = await fetch("location.txt").then(r => r.text());
  const clean = locText.trim();
  document.getElementById("location").textContent = clean;

  const city = clean.split(",")[0];

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${UNITS}&appid=${API_KEY}`
  );
  const data = await res.json();

  // 🌡️ TEMPERATURE
  if (data.main?.temp !== undefined) {
    document.getElementById("temp").textContent =
      `${Math.round(data.main.temp)}°C`;
  }

  // 🌍 TIMEZONE
  if (data.timezone !== undefined) {
    timezoneOffset = data.timezone;
  }

  // 🇺🇳 FLAG AS PNG (STABLE)
  if (data.sys?.country) {
    const cc = data.sys.country.toLowerCase();
    document.getElementById("flag").src =
      `https://flagcdn.com/w20/${cc}.png`;
  }

  updateTime();
}

loadLocationAndData();
setInterval(loadLocationAndData, 600000); // co 10 min
