// Mapping manuale delle città italiane
const manualCityMapping = {
  // VALLE D'AOSTA
  "45.7359,7.3207": "Aosta",

  // PIEMONTE
  "45.0676,7.6825": "Torino",
  "44.8911,8.6267": "Alessandria",
  "45.5565,8.1828": "Novara",

  // LOMBARDIA
  "45.4642,9.1900": "Milano",
  "45.5417,9.6664": "Bergamo",
  "45.4098,9.2697": "Brescia",

  // TRENTINO-ALTO ADIGE
  "46.0679,11.1211": "Trento",
  "46.4983,11.3555": "Bolzano",

  // VENETO
  "45.4372,12.3346": "Venezia",
  "45.5421,11.5412": "Verona",
  "45.2742,11.8751": "Padova",

  // FRIULI-VENEZIA GIULIA
  "45.6495,13.7768": "Trieste",
  "45.9239,13.1939": "Udine",

  // LIGURIA
  "44.4056,8.9463": "Genova",
  "44.0565,8.2517": "Savona",

  // EMILIA-ROMAGNA
  "44.4938,11.3428": "Bologna",
  "44.6485,10.9278": "Modena",
  "44.8013,10.3286": "Parma",

  // TOSCANA
  "43.7696,11.2558": "Firenze",
  "43.5167,10.5045": "Pisa",
  "43.3179,11.3724": "Siena",

  // UMBRIA
  "43.1108,12.3911": "Perugia",
  "42.9178,12.2448": "Terni",

  // MARCHE
  "43.6168,13.5189": "Ancona",
  "43.9446,12.9014": "Pesaro",

  // LAZIO
  "41.8919,12.5113": "Roma",
  "41.7151,13.2116": "Latina",
  "42.3508,12.5625": "Viterbo",

  // ABRUZZO
  "42.3507,14.1674": "L'Aquila",
  "42.4537,14.2189": "Pescara",

  // MOLISE
  "41.5577,14.6591": "Campobasso",
  "41.8503,14.3576": "Isernia",

  // CAMPANIA
  "40.8518,14.2681": "Napoli",
  "40.9599,14.7569": "Salerno",
  "41.1167,15.5333": "Caserta",

  // PUGLIA
  "41.1256,16.8673": "Bari",
  "40.6501,18.1718": "Lecce",
  "41.5357,16.4628": "Foggia",

  // BASILICATA
  "40.6394,15.8052": "Potenza",
  "40.5074,16.5944": "Matera",

  // CALABRIA
  "38.9058,16.5944": "Reggio Calabria",
  "39.3021,16.2378": "Catanzaro",
  "39.7392,16.9047": "Cosenza",

  // SICILIA
  "38.1157,13.3615": "Palermo",
  "37.5079,15.0830": "Catania",
  "38.2913,15.5423": "Messina",

  // SARDEGNA
  "39.2153,9.1106": "Cagliari",
  "40.7202,8.5547": "Sassari",
  "39.9031,9.0183": "Nuoro",
};

// Mapping delle icone meteo in base al weather code
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

/**
 * Ottiene la posizione dell'utente e mostra il meteo locale.
 */
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(fetchLocalWeather, handleError);
  } else {
    alert("Geolocalizzazione non supportata dal browser.");
  }
}

/**
 * Gestisce gli errori di geolocalizzazione.
 * @param {PositionError} error - Oggetto errore.
 */
function handleError(error) {
  console.error("Errore di geolocalizzazione:", error.message);
  document.getElementById(
    "weatherInfo"
  ).innerHTML = `<p style="color: red;">Impossibile ottenere la posizione: ${error.message}</p>`;
}

/**
 * Ottiene il meteo locale per la posizione fornita.
 * @param {GeolocationPosition} position - Oggetto posizione.
 */
async function fetchLocalWeather(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  try {
    const city = await reverseGeocode(latitude, longitude);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,rain,cloud_cover,wind_speed_10m,weather_code`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Errore HTTP: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    displayWeather(data, city);
  } catch (error) {
    console.error("Errore durante il recupero dei dati meteo:", error);
    document.getElementById(
      "weatherInfo"
    ).innerHTML = `<p style="color: red;">Si è verificato un errore: ${error.message}</p>`;
  }
}

/**
 * Ottiene il meteo in base alla modalità di ricerca selezionata.
 */
async function fetchWeather() {
  const searchMode = document.getElementById("searchMode").value;

  let latitude, longitude;

  if (searchMode === "coordinates") {
    // Recupera le coordinate dagli input
    latitude = parseFloat(document.getElementById("latitude").value);
    longitude = parseFloat(document.getElementById("longitude").value);
  } else {
    // Recupera le coordinate dalla città selezionata
    const cityCoordinates = document
      .getElementById("citySelect")
      .value.split(",");
    latitude = parseFloat(cityCoordinates[0]);
    longitude = parseFloat(cityCoordinates[1]);
  }

  try {
    const city = await reverseGeocode(latitude, longitude);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,rain,cloud_cover,wind_speed_10m,weather_code`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Errore HTTP: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    displayWeather(data, city);
  } catch (error) {
    console.error("Errore durante il recupero dei dati meteo:", error);
    document.getElementById(
      "weatherInfo"
    ).innerHTML = `<p style="color: red;">Si è verificato un errore: ${error.message}</p>`;
  }
}

/**
 * Attiva/disattiva l'interfaccia in base alla modalità di ricerca selezionata.
 */
function toggleSearchMode() {
  const searchMode = document.getElementById("searchMode").value;
  const coordinatesInput = document.getElementById("coordinatesInput");
  const cityInput = document.getElementById("cityInput");

  if (searchMode === "coordinates") {
    coordinatesInput.style.display = "block";
    cityInput.style.display = "none";
  } else {
    coordinatesInput.style.display = "none";
    cityInput.style.display = "block";
  }
}

/**
 * Recupera il nome della città usando OpenStreetMap Nominatim.
 * @param {number} lat - Latitudine.
 * @param {number} lon - Longitudine.
 * @returns {Promise<string>} Nome della città o località.
 */
async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "MeteoApp/1.0" },
    });
    const data = await response.json();

    let city =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      "Località sconosciuta";

    // Mapping manuale per correggere eventuali discrepanze
    const coordinatesKey = `${lat},${lon}`;
    if (manualCityMapping[coordinatesKey]) {
      city = manualCityMapping[coordinatesKey];
    }

    return city;
  } catch (error) {
    console.error("Errore nel reverse geocoding:", error);
    return "Non disponibile";
  }
}

/**
 * Visualizza i dati del meteo e il nome della città.
 * @param {Object} data - Dati meteo.
 * @param {string} city - Nome della città.
 */
function displayWeather(data, city) {
  const current = data.current;
  const weatherCode = current.weather_code;
  const icon = weatherIcons[weatherCode] || "❓";

  const weatherInfo = `
      <h2>Meteo a ${city}</h2>
      <div class="weather-icon">${icon}</div>
      <p><strong>Temperatura:</strong> ${current.temperature_2m}°C</p>
      <p><strong>Umidità:</strong> ${current.relative_humidity_2m}%</p>
      <p><strong>Precipitazioni:</strong> ${current.precipitation} mm</p>
      <p><strong>Pioggia:</strong> ${current.rain} mm</p>
      <p><strong>Copertura Nuvole:</strong> ${current.cloud_cover}%</p>
      <p><strong>Velocità Vento:</strong> ${current.wind_speed_10m} km/h</p>
  `;

  document.getElementById("weatherInfo").innerHTML = weatherInfo;
}

/**
 * Carica e visualizza il meteo per le città famose.
 */
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
