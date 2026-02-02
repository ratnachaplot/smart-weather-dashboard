const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const suggestions = document.getElementById("suggestions");
const dashboard = document.querySelector(".dashboard");
const recentSection = document.querySelector(".recent-cities");
const recentList = document.getElementById("recentList");

const API_KEY = "YOUR_API_KEY_HERE"; // 👈 paste your key

const cities = [
  { name: "Mumbai", country: "India", code: "IN" },
  { name: "Delhi", country: "India", code: "IN" },
  { name: "Jaipur", country: "India", code: "IN" },
  { name: "London", country: "United Kingdom", code: "GB" },
  { name: "New York", country: "USA", code: "US" },
  { name: "Tokyo", country: "Japan", code: "JP" },
  { name: "Paris", country: "France", code: "FR" },
];

let recentCities = [];

cityInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  suggestions.innerHTML = "";
  if (!value) return (suggestions.style.display = "none");

  cities
    .filter(c => c.name.toLowerCase().includes(value))
    .forEach(city => {
      const li = document.createElement("li");
      li.textContent = `${city.name}, ${city.country}`;
      li.onclick = () => fetchWeather(city);
      suggestions.appendChild(li);
    });

  suggestions.style.display = "block";
});

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather({ name: city });
});

async function fetchWeather(city) {
  suggestions.style.display = "none";
  dashboard.classList.remove("hidden");
  recentSection.classList.remove("hidden");

  // 👉 If API key not added, show demo data
  if (API_KEY === "YOUR_API_KEY_HERE") {
    loadMockData(city.name);
    updateRecent(city.name);
    return;
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&appid=${API_KEY}`
    );

    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    updateUI(data);
    updateRecent(city.name);

  } catch (err) {
    alert("❌ Unable to fetch weather. Showing demo data.");
    loadMockData(city.name);
  }
}



function updateUI(cityData, data) {
  document.getElementById("cityName").textContent = cityData.name;
  document.getElementById("countryName").textContent = cityData.sys.country;

  document.getElementById("bigTemp").textContent =
    Math.round(data.current.temp) + "°C";
  document.getElementById("bigCondition").textContent =
    data.current.weather[0].description;

  document.getElementById("temperature").textContent =
    data.current.temp + "°C";
  document.getElementById("humidity").textContent =
    data.current.humidity + "%";
  document.getElementById("windSpeed").textContent =
    data.current.wind_speed + " km/h";

  document.getElementById("feelsLike").textContent =
    data.current.feels_like + "°C";
  document.getElementById("pressure").textContent =
    data.current.pressure + " hPa";

  document.getElementById("sunrise").textContent =
    new Date(data.current.sunrise * 1000).toLocaleTimeString();
  document.getElementById("sunset").textContent =
    new Date(data.current.sunset * 1000).toLocaleTimeString();

  // Hourly
  const hourlyDiv = document.getElementById("hourlyContainer");
  hourlyDiv.innerHTML = "";
  data.hourly.slice(0, 6).forEach(h => {
    const div = document.createElement("div");
    div.className = "hour-card";
    div.innerHTML = `
      <p>${new Date(h.dt * 1000).getHours()}:00</p>
      <p>${Math.round(h.temp)}°</p>
    `;
    hourlyDiv.appendChild(div);
  });

  setWeatherBackground(data.current.weather[0].main);
}


function updateRecent(cityName) {
  if (!recentCities.includes(cityName)) {
    recentCities.unshift(cityName);
    if (recentCities.length > 3) recentCities.pop();
  }

  recentList.innerHTML = "";
  recentCities.forEach(city => {
    const div = document.createElement("div");
    div.className = "recent-item";
    div.textContent = city;
    div.onclick = () => fetchWeather({ name: city });
    recentList.appendChild(div);
  });
}

function setWeatherBackground(condition) {
  if (condition.includes("Rain"))
    document.body.style.background =
      "linear-gradient(135deg, #314755, #26a0da)";
  else if (condition.includes("Cloud"))
    document.body.style.background =
      "linear-gradient(135deg, #2c3e50, #bdc3c7)";
  else if (condition.includes("Clear"))
    document.body.style.background =
      "linear-gradient(135deg, #56ccf2, #2f80ed)";
  else if (condition.includes("Snow"))
    document.body.style.background =
      "linear-gradient(135deg, #83a4d4, #b6fbff)";
  else
    document.body.style.background =
      "linear-gradient(135deg, #1c1c2a, #222940)";
}

function loadMockData(cityName) {
  const mockData = {
    name: cityName,
    sys: { country: "IN" },
    main: {
      temp: 27,
      humidity: 58
    },
    wind: {
      speed: 12
    },
    weather: [
      {
        main: "Clear",
        description: "clear sky"
      }
    ]
  };

  updateUI(mockData);
}
