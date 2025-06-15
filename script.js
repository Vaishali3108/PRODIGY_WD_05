const apiKey = "14ae6e94a414e77d80f3a22d04c9c433";
const loader = document.getElementById("loader");
const weatherInfo = document.getElementById("weatherInfo");

function showLoader() {
  loader.style.display = "block";
  weatherInfo.innerHTML = "";
}

function hideLoader() {
  loader.style.display = "none";
}

function getWeatherByCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }
  showLoader();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    showLoader();
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      fetchWeather(url);
    }, () => {
      hideLoader();
      alert("Geolocation access denied.");
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function updateBackground(condition) {
  let bgColor = "", glowColor = "";

  switch (condition.toLowerCase()) {
    case "clear":
      bgColor = "#f1c40f"; // Sunny yellow
      glowColor = "rgba(241, 196, 15, 0.6)";
      break;
    case "clouds":
      bgColor = "#7f8c8d"; // Cloudy grey
      glowColor = "rgba(189, 195, 199, 0.6)";
      break;
    case "rain":
    case "drizzle":
      bgColor = "#3498db"; // Rainy blue
      glowColor = "rgba(52, 152, 219, 0.6)";
      break;
    case "thunderstorm":
      bgColor = "#2c3e50"; // Stormy dark
      glowColor = "rgba(44, 62, 80, 0.7)";
      break;
    case "snow":
      bgColor = "#ecf0f1"; // Snow white
      glowColor = "rgba(236, 240, 241, 0.8)";
      break;
    case "mist":
    case "fog":
    case "haze":
      bgColor = "#95a5a6"; // Misty gray
      glowColor = "rgba(149, 165, 166, 0.6)";
      break;
    default:
      bgColor = "#34495e"; // Default fallback
      glowColor = "rgba(52, 73, 94, 0.6)";
  }

  document.body.style.background = bgColor;

  // Apply dynamic glow color
  const weatherCard = document.querySelector('.weather-card');
  if (weatherCard) {
    weatherCard.style.boxShadow = `0 0 25px ${glowColor}`;
  }
}


function fetchWeather(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      hideLoader();

      if (data.cod !== 200) {
        weatherInfo.innerHTML = `<p>❌ ${data.message}</p>`;
        return;
      }

      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      const condition = data.weather[0].main;
      updateBackground(condition);

      const html = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="${iconUrl}" alt="weather icon" />
        <p>🌡️ Temp: ${data.main.temp}°C</p>
        <p>🌤️ Condition: ${data.weather[0].description}</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>💨 Wind: ${data.wind.speed} m/s</p>
      `;

      weatherInfo.innerHTML = html;
    })
    .catch(err => {
      hideLoader();
      console.error(err);
      weatherInfo.innerHTML = "<p>❌ Failed to fetch data.</p>";
    });
}

function resetWeather() {
  document.getElementById("cityInput").value = "";
  weatherInfo.innerHTML = "";
  document.body.style.background = "linear-gradient(135deg, #2c3e50, #3498db)";
  const weatherCard = document.querySelector('.weather-card');
  if (weatherCard) {
    weatherCard.style.boxShadow = "0 0 20px rgba(255, 255, 255, 0.3)";
  }
}
