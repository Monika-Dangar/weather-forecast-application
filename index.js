import { API_KEY, API, GEO_API, ICON_URL } from './config.js'

const citySearch = document.getElementById("citySearch");
const searchButton = document.getElementById("searchButton")
const currentLocation = document.getElementById("currentLocation")
const errorMessage = document.getElementById("errorMessage");
// Default fallback coordinates (Mumbai, for example)
const DEFAULT_LAT = 19.07; // Mumbai Latitude
const DEFAULT_LON = 72.87; // Mumbai Longitude

// Temperature Conversion
function convertToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(2);
}

// Wind Speed Conversion: function to convert wind speed to km/h:
function convertWindSpeedToKmH(mps) {
    return (mps * 3.6).toFixed(2);
}

function airQualityIndex(aqi) {
    let aqiMsg = `aqi`;
    switch (aqi) {
        case 1:
            aqiMsg = `Good`;
            break;
        case 2:
            aqiMsg = `Fair`;
            break;
        case 3:
            aqiMsg = `Moderate`;
            break;
        case 4:
            aqiMsg = `Poor`;
            break;
        case 5:
            aqiMsg = `Very Poor`;
            break;
        default:
            break;
    }

    return aqiMsg;
}

function convertDataAndTime(dt) {
    // Convert Unix timestamp to Date object
    const date = new Date(dt * 1000);
    const dateString = date.toLocaleDateString();  // Format the date
    const timeString = date.toLocaleTimeString();  // Format the time    
    const todayDate = `${dateString} ${timeString}`

    return todayDate;
}

async function fetchCoordinates(cityName) {
    try {
        const resp = await fetch(`${GEO_API}?q=${cityName}&appid=${API_KEY}`);
        const data = await resp.json();

        if (data.length > 0) {
            const { lat, lon } = data[0];
            return { lat, lon };
        } else {
            // console.log("city now found");
            // throw new Error("City not found");

        }
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
    }
}

function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {

                    const { latitude, longitude } = position.coords;
                    resolve({ lat: latitude, lon: longitude });
                },
                (error) => {
                    reject(error);
                    // console.log("Error getting location.", error);
                }
            )
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    })
}

async function fetchWeatherForCoordinates(lat, lon) {
    try {
        const weatherResponse = await fetch(`${API}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        const weatherData = await weatherResponse.json();

        const pollutionResponse = await fetch(`${API}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        const pollutionData = await pollutionResponse.json();
        // console.log(pollutionData);
        displayCurrentWeather(weatherData, pollutionData);

        const forecastResponse = await fetch(`${API}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        const forecastData = await forecastResponse.json();
        displayForecastWeather(forecastData);

    } catch (err) {
        console.log(err);
    }
}

function displayCurrentWeather(resp, pollutants) {
    const currentWeather = document.getElementById("currentWeather");

    currentWeather.querySelector(".currentDateAndTime").textContent = convertDataAndTime(resp.dt);

    currentWeather.querySelector("img").src = `${ICON_URL}${resp.weather[0].icon}@2x.png`;

    const aqiMsg = airQualityIndex(pollutants.list[0].main.aqi);
    currentWeather.querySelector("#aqiDisplay").textContent = `${aqiMsg}`

    currentWeather.querySelector("#weatherDesc").textContent = resp.weather[0].description

    currentWeather.querySelector("#cityName").textContent = resp.name;

    currentWeather.querySelector("#currentTemperature").textContent = `Temperature: ${convertToCelsius(resp.main.temp)}°C`;

    currentWeather.querySelector("#currentHumidity").textContent = `Humidity: ${resp.main.humidity}%`;

    currentWeather.querySelector("#currentWind").textContent = `Wind: ${convertWindSpeedToKmH(resp.wind.speed)} km/h`;
}

function displayForecastWeather(resp) {
    const extendedForecast = document.getElementById("extendedForecast");
    const forecastTemplate = document.querySelector("#forecastTemplate");

    // Clear previous forecast cards
    extendedForecast.innerHTML = ''; // Clears all child elements of the container

    // Get today's date and normalize it to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create a Map to group forecasts by date (12 PM for uniformity)
    const forecastMap = new Map();

    // Iterate over the forecast data
    resp.list.forEach(item => {
        const forecastDate = new Date(item.dt * 1000); // Convert UNIX timestamp to Date
        const forecastDateMidday = new Date(forecastDate.setHours(12, 0, 0, 0)); // Normalize to 12 PM for each day

        // If the forecast is for a future day and not already in the map
        if (forecastDateMidday > today && !forecastMap.has(forecastDateMidday.toDateString())) {
            forecastMap.set(forecastDateMidday.toDateString(), item);
        }
    });

    // Convert the map to an array and get the first 5 days
    const forecastDays = Array.from(forecastMap.values()).slice(0, 5);

    // Display the forecast for each of the 5 days
    forecastDays.forEach(day => {
        const card = forecastTemplate.cloneNode(true);

        // Set the forecast date
        card.querySelector('h3').textContent = new Date(day.dt * 1000).toLocaleDateString();

        // Set weather icon and description
        card.querySelector('img').src = `${ICON_URL}${day.weather[0].icon}@2x.png`;
        card.querySelector('.desc').textContent = day.weather[0].description;

        // Set temperature, humidity, and wind speed
        card.querySelector(".temperature").textContent = `Temperature: ${convertToCelsius(day.main.temp)}°C`;
        card.querySelector(".humidity").textContent = `Humidity: ${day.main.humidity}%`;
        card.querySelector(".wind").textContent = `Wind Speed: ${convertWindSpeedToKmH(day.wind.speed)} km/h`;

        extendedForecast.append(card); // Add the new card to the container
    });
}

const citySuggestions = new Set();
const dropdownList = document.querySelector("#dropdownList");
const MAX_SUGGESTIONS = 5; // Limit the dropdown to 5 cities

function dropDownList(cityName) {

    // Add the city to the Set if not already present
    if (!citySuggestions.has(cityName)) {
        citySuggestions.add(cityName);
        const cityArray = Array.from(citySuggestions);
        sessionStorage.setItem("cityName", JSON.stringify(cityArray));  // Store in sessionStorage
    }

    // Clear any existing items in the dropdown list
    dropdownList.innerHTML = '';

    let cities = sessionStorage.getItem("cityName");
    if (cities) {
        cities = JSON.parse(cities);

        // Limit the number of cities shown in the dropdown
        const filteredCities = cities.slice(0, MAX_SUGGESTIONS);

        filteredCities.forEach((city) => {
            // Create the list item for each city
            const list = document.createElement("li");
            list.textContent = city;
            list.style.cursor = "pointer"; // Make the cursor a pointer for click action

            // Event listener to update input field on click
            list.addEventListener("click", () => {
                console.log(city);

                citySearch.value = city;  // Set the value of the input field
                dropdownList.classList.add("hidden");  // Hide the dropdown after selection
            });

            dropdownList.appendChild(list);  // Append the list item to the dropdown
        });

        // Show the dropdown if there are cities to display
        dropdownList.classList.remove("hidden");

    } else {
        console.log("No cities found in sessionStorage.");
    }
}

// Event listener for focus event to show dropdown list
citySearch.addEventListener("focus", () => {
    const cityName = citySearch.value.trim();
    dropDownList(cityName);
});

// Event listener for focusout event to hide the dropdown
citySearch.addEventListener("focusout", () => {
    // Use a small timeout to allow click event on the list item
    setTimeout(() => {
        dropdownList.classList.add("hidden");
    }, 200);
});

citySearch.addEventListener("focus", () => {
    const cityName = citySearch.value.trim();
    dropDownList(cityName);
});

citySearch.addEventListener("focusout", () => {
    dropdownList.classList.add("hidden")
})

searchButton.addEventListener("click", async () => {
    const cityName = citySearch.value.trim();
    if (!cityName) {
        errorMessage.classList.remove("hidden");
        errorMessage.querySelector("#errorText").textContent = `Please enter city name.`
        setTimeout(() => {
            citySearch.value = ""
            errorMessage.classList.add("hidden");
        }, 2000)

    }

    if (cityName) {
        const coordinates = await fetchCoordinates(cityName);

        if (coordinates) {
            const { lat, lon } = coordinates;
            fetchWeatherForCoordinates(lat, lon);
        } else {
            errorMessage.classList.remove("hidden");
            errorMessage.querySelector("#errorText").textContent = `City not found.`
            setTimeout(() => {
                citySearch.value = ""
                errorMessage.classList.add("hidden");
            }, 2000)
        }
    }
})

currentLocation.addEventListener("click", async () => {

    try {
        const { lat, lon } = await getUserLocation();
        fetchWeatherForCoordinates(lat, lon);

    } catch (error) {
        errorMessage.classList.remove("hidden");
        errorMessage.querySelector("#errorText").textContent = `Please enable your location .`
        // console.log("Error: ", error);
        setTimeout(() => {
            errorMessage.classList.add("hidden");
        }, 2000)
    }
})

window.addEventListener("load", async () => {
    try {
        const { lat, lon } = await getUserLocation();
        fetchWeatherForCoordinates(lat, lon);
    } catch (error) {
        // console.error("Error getting user location:", error);
        fetchWeatherForCoordinates(DEFAULT_LAT, DEFAULT_LON);
    }
})