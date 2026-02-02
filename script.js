const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const suggestions = document.getElementById("suggestions");
const dashboard = document.querySelector(".dashboard");
const recentSection = document.querySelector(".recent-cities");
const recentList = document.getElementById("recentList");

const API_KEY = "YOUR_API_KEY_HERE"; // demo mode if not replaced

const cities = [
  { name: "Mumbai", country: "India", code: "IN" },
  { name: "Delhi", country: "India", code: "IN" },
  { name: "Jaipur", country: "India", code: "IN" },
  { name: "Bangalore", country: "India", code: "IN" },
  { name: "Hyderabad", country: "India", code: "IN" },
  { name: "Chennai", country: "India", code: "IN" },
  { name: "Kolkata", country: "India", code: "IN" },
];

let recentCities = [];

// Search suggestions
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

// Fetch weather
async function fetchWeather(city) {
  suggestions.style.display = "none";
  dashboard.classList.remove("hidden");
  recentSection.classList.remove("hidden");

  // Demo mode
  if (API_KEY === "YOUR_API_KEY_HERE") {
    const mockData = loadMockData(city.name);
    updateUI(mockData);
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
    const mockData = loadMockData(city.name);
    updateUI(mockData);
    updateRecent(city.name);
  }
}

// Update UI
function updateUI(data) {
  document.getElementById("cityName").textContent = data.name;
  document.getElementById("countryName").textContent =
    data.sys.country === "IN" ? "India" : data.sys.country;

  // Flag
  const flag = document.getElementById("flagIcon");
  flag.src = `https://flagcdn.com/w40/${data.sys.country.toLowerCase()}.png`;
  flag.alt = data.sys.country;

  // Main temperature
  document.getElementById("bigTemp").textContent =
    Math.round(data.main.temp) + "°C";

  // Weather icon
  const icon = data.weather[0].icon || "01d";
  document.getElementById("weatherIcon")?.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${icon}@2x.png`
  );

  // Conditions
  document.getElementById("bigCondition").textContent =
    data.weather[0].description;

  document.getElementById("temperature").textContent =
    data.main.temp + "°C";
  document.getElementById("humidity").textContent =
    data.main.humidity + "%";
  document.getElementById("windSpeed").textContent =
    data.wind.speed + " km/h";
  document.getElementById("feelsLike").textContent =
    data.main.feels_like + "°C";
  document.getElementById("pressure").textContent =
    data.main.pressure + " hPa";
  document.getElementById("sunrise").textContent =
    new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  document.getElementById("sunset").textContent =
    new Date(data.sys.sunset * 1000).toLocaleTimeString();

  // Date & time
  document.getElementById("date").textContent =
    new Date().toDateString();
  document.getElementById("time").textContent =
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  document.getElementById("updateTime").textContent =
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Weather description
  // document.getElementById("weatherCondition").textContent =
  //   data.weather[0].main;
  document.getElementById("conditionDescription").textContent =
    data.weather[0].description;

  // Hourly forecast
  loadHourlyForecast();

  setWeatherBackground(data.weather[0].main);
}

// Update recent cities
function updateRecent(cityName) {
  if (!recentCities.includes(cityName)) {
    recentCities.unshift(cityName);
    if (recentCities.length > 3) recentCities.pop();
  }

    console.log("Recent Cities:", recentCities); // Debugging line
  recentList.innerHTML = "";
  recentCities.forEach(city => {
    const div = document.createElement("div");
    div.className = "recent-item";
    div.textContent = city;
    div.onclick = () => fetchWeather({ name: city });
    recentList.appendChild(div);
  });


}

// Background based on weather
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

// Demo data
function loadMockData(cityName) {
  return {
    name: cityName,
    sys: { country: "IN", sunrise: 1700000000, sunset: 1700040000 },
    main: { temp: 27, feels_like: 29, humidity: 58, pressure: 1012 },
    wind: { speed: 12 },
    weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
  };
}

// Demo hourly forecast
function loadHourlyForecast() {
  const hourlyDiv = document.getElementById("hourlyContainer");
  hourlyDiv.innerHTML = "";
  const hours = [
    { time: "01:00", temp: 26 },
    { time: "03:00", temp: 25 },
    { time: "05:00", temp: 24 },
    { time: "07:00", temp: 27 },
    { time: "09:00", temp: 29 },
    { time: "11:00", temp: 31 },
  ];
  hours.forEach(h => {
    const div = document.createElement("div");
    div.className = "hour-card";
    div.innerHTML = `<p>${h.time}</p><p>${h.temp}°C</p>`;
    hourlyDiv.appendChild(div);
  });
}

// Initial load
loadHourlyForecast();
