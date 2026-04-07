//add event listener to submit button
document
  .getElementById("submit")
  .addEventListener("click", () => getLocation());

//add event listener to input field to allow user to press enter to submit
document.getElementById("zip").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission
    getLocation(); // Call the function to get location and weather data
  }
});

//get zip code from input field and call api to get lat and lon
async function getLocation() {
  const zipCode = document.getElementById("zip").value;

  //validate zip code input
  if (!zipCode || !/^\d{5}$/.test(zipCode)) {
    alert("Please enter a valid 5-digit zip code.");
    return;
  }
  const key = "17010bd4883647de84e81dbecbc5ae88";
  const url = `https://api.geoapify.com/v1/geocode/search?text=${zipCode}&format=json&apiKey=${key}`;
  // console.log(url);

  try {
    //fetch data from api
    const requestOptions = {
      method: "GET",
    };

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    //get lat, lon, city, and state from data
    const lat = data.results["0"].lat;
    const lon = data.results["0"].lon;
    const city = data.results["0"].city;
    const state = data.results["0"].state_code;

    //call function to display weather data
    displayWeather(lat, lon, city, state);
  } catch (error) {
    console.log("error:", error);
  }
}
async function displayWeather(lat, lon, city, state) {
  const api_Key = "a69eac5b6f584dcfa36211529260604";
  const lattitude = lat;
  const longitude = lon;
  const api_Url = `http://api.weatherapi.com/v1/current.json?key=${api_Key}&q=${lattitude},${longitude}`;

  try {
    //fetch data from api
    const response = await fetch(api_Url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();

    //display weather data on page

    //display date and time since last update
    const dateDiv = document.getElementById("date_time");
    dateDiv.innerHTML = result.current.last_updated;

    //display location
    const locationDiv = document.getElementById("location");
    locationDiv.innerHTML = `${city}, ${state}`;

    //display weather condition
    const weatherDiv = document.getElementById("weather");
    weatherDiv.innerHTML = result.current.condition.text;

    //display weather icon
    const iconSpan = document.getElementById("icon");
    const iconUrl = result.current.condition.icon;
    iconSpan.innerHTML = `<img src="${iconUrl}" alt="Weather Icon">`;

    //display temperature in F by default
    const tempDiv = document.getElementById("temperature");
    tempDiv.innerHTML = `${Math.round(result.current.temp_f)}°F`;

    //add event listener to unit toggle button
    document
      .getElementById("unit-toggle")
      .addEventListener("click", () => changeUnits(result));
  } catch (e) {
    console.log("error:", e);
  }
}
//function to change units from F to C and vice versa
function changeUnits(result) {
  const tempDiv = document.getElementById("temperature");
  if (tempDiv.innerHTML.includes("°F")) {
    tempDiv.innerHTML = result.current.temp_c + "°C";
  } else {
    tempDiv.innerHTML = Math.round(result.current.temp_f) + "°F";
  }
}
