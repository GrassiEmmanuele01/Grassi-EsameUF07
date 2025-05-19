const weatherIcons = {
  0: "☀️", // Sereno
  1: "🌤️", // Parzialmente nuvoloso
  2: "☁️", // Nuvoloso
  3: "🌧️", // Pioggia leggera
  45: "🌫️", // Nebbia
  61: "🌧️", // Pioggia moderata
  80: "⛈️", // Temporale
};

const famousCities = [
  { name: "Roma", lat: 41.9028, lon: 12.4964 },
  { name: "Parigi", lat: 48.8566, lon: 2.3522 },
  { name: "Londra", lat: 51.5074, lon: -0.1278 },
  { name: "New York", lat: 40.7128, lon: -74.006 },
  { name: "Tokyo", lat: 35.6895, lon: 139.6917 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 },
];

document.addEventListener("DOMContentLoaded", () => {
  loadFamousCitiesWeather();
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(fetchLocalWeather, handleError);
  } else {
    alert("Geolocalizzazione non supportata dal browser.");
  }
}

function handleError(error) {
  console.error("Errore di geolocalizzazione:", error.message);
  document.getElementById("weatherInfo").textContent =
    "Impossibile ottenere la posizione.";
}

async function fetchLocalWeather(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const city = await reverseGeocode(latitude, longitude);

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,rain,cloud_cover,wind_speed_10m,weather_code`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayLocalWeather(data, city);
  } catch (error) {
    console.error("Errore durante il recupero dei dati meteo:", error);
    document.getElementById("weatherInfo").textContent =
      "Impossibile recuperare i dati meteo.";
  }
}

async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "MeteoApp/1.0",
      },
    });
    const data = await response.json();
    return (
      data.address.city ||
      data.address.town ||
      data.address.village ||
      "Località sconosciuta"
    );
  } catch (error) {
    console.error("Errore nel reverse geocoding:", error);
    return "Non disponibile";
  }
}

function displayLocalWeather(data, city) {
  const current = data.current;
  const weatherCode = current.weather_code;
  const icon = weatherIcons[weatherCode] || "❓";

  const weatherInfo = `
      <h2>${city}</h2>
      <div class="weather-icon">${icon}</div>
      Temperatura: ${current.temperature_2m}°C<br>
      Umidità: ${current.relative_humidity_2m}%<br>
      Precipitazioni: ${current.precipitation} mm<br>
      Pioggia: ${current.rain} mm<br>
      Copertura nuvole: ${current.cloud_cover}%<br>
      Velocità vento: ${current.wind_speed_10m} km/h<br>
    `;
  document.getElementById("weatherInfo").innerHTML = weatherInfo;
}

async function loadFamousCitiesWeather() {
  const container = document.getElementById("famousCities");

  for (const city of famousCities) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const weatherCode = data.current.weather_code;
      const icon = weatherIcons[weatherCode] || "❓";

      const div = document.createElement("div");
      div.className = "city-box";
      div.innerHTML = `
          <h3>${city.name}</h3>
          <div class="weather-icon">${icon}</div>
          Temperatura: ${data.current.temperature_2m}°C`;
      container.appendChild(div);
    } catch (error) {
      console.error(`Errore nel recupero del meteo per ${city.name}:`, error);
    }
  }
}