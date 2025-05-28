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

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,rain,cloud_cover,wind_speed_10m`;

  try {
    const city = await reverseGeocode(latitude, longitude);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Errore HTTP: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    displayWeather(data, city);
  } catch (error) {
    console.error("Errore durante il recupero dei dati:", error);
    document.getElementById("weatherInfo").innerHTML = `
          <p style="color: red;">Si è verificato un errore: ${error.message}</p>
      `;
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

/**
 * Visualizza i dati del meteo e il nome della città.
 * @param {Object} data - Dati meteo.
 * @param {string} city - Nome della città.
 */
function displayWeather(data, city) {
  const current = data.current;

  const weatherInfo = `
      <h2>Meteo a ${city}</h2>
      <p><strong>Temperatura:</strong> ${current.temperature_2m}°C</p>
      <p><strong>Umidità:</strong> ${current.relative_humidity_2m}%</p>
      <p><strong>Precipitazioni:</strong> ${current.precipitation} mm</p>
      <p><strong>Pioggia:</strong> ${current.rain} mm</p>
      <p><strong>Copertura Nuvole:</strong> ${current.cloud_cover}%</p>
      <p><strong>Velocità Vento:</strong> ${current.wind_speed_10m} km/h</p>
  `;

  document.getElementById("weatherInfo").innerHTML = weatherInfo;
}
