let searchHistoryForWeather = [];
const weatherApiBaseURL = "https://api.openweathermap.org";
const weatherApiKey = "5c0827e6dfab0abc1d7d91077faa8a42";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const todayContainer = document.querySelector("#today");
const forecastContainer = document.querySelector("#forecast");
const weatherHistoryContainer = document.querySelector("#weather-history");


const displayCurrentWeather = (city, weatherData) => {
    const date = dayjs().format("M/D/YYYY");
    const tempF = weatherData.main.temp;
    const windMph = weatherData.wind.speed;
    const humidity = weatherData.main.humidity
    const iconUrl = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    const iconDescription = weatherData.weather[0].description || "No description";
 
    const card = document.createElement("div");
    const cardBody = document.createElement("div");
    const heading = document.createElement("h3");
    const weatherIcon = document.createElement("img");
    const temperatureElement = document.createElement("p");
    const windElement = document.createElement("p");
    const humidityElement = document.createElement("p");

    card.setAttribute("class", "card bg-dark text-white");
    cardBody.setAttribute("class", "card-body");
    card.append(cardBody);

    heading.setAttribute("class","h3 card-title");
    temperatureElement.setAttribute("class", "card-text");
    windElement.setAttribute("class", "card-text");
    humidityElement.setAttribute("class", "card-text");

    heading.textContent = `${city} (${date})`;
    weatherIcon.setAttribute("src", iconUrl);
    weatherIcon.setAttribute("alt", iconDescription);
    heading.append(weatherIcon);
    temperatureElement.textContent = `Temperature: ${tempF} °F`;
    windElement.textContent = `Wind: ${windMph} MPH`;
    humidityElement.textContent =`Humidity: ${humidity} %`;
    cardBody.append(heading, temperatureElement, windElement, humidityElement);

    todayContainer.innerHTML = "";
    todayContainer.append(card);
}

const fetchWeather = (location) => {
    const latitude = location.lat;
    const longitude = location.lon;

    const city = location.name;
  
   const apiURL = `${weatherApiBaseURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherApiKey}`;
   fetch(apiURL).then(function(response){
    return response.json();
   }).then(function(data){
    displayCurrentWeather(city, data.list[0])
    // dispayForecast(data);
   }).catch(function(error){
   console.log(error);
   })

}

const createSearchHistory =  () => {
    weatherHistoryContainer.innerHTML = "";
    for(let index = 0; index < searchHistoryForWeather.length; index++) {
        const buttonElement = document.createElement("button");
        buttonElement.setAttribute("id", "city-button");
        buttonElement.setAttribute("type", "button");
        buttonElement.setAttribute("class", "btn btn-secondary");
        buttonElement.setAttribute("aria-controls", "today forecast");
        buttonElement.classList.add("history-button")
        buttonElement.setAttribute("data-search", searchHistoryForWeather[index]);
        buttonElement.textContent = searchHistoryForWeather[index];
        weatherHistoryContainer.append(buttonElement);
    }

}

const appendWeatherHistory = (search) => {
    if(searchHistoryForWeather.indexOf(search) !== -1) {
        return;
    }
    searchHistoryForWeather.push(search);
    localStorage.setItem("weatherHistory", JSON.stringify(searchHistoryForWeather));
    createSearchHistory();
}


const fetchCoordinates = (search) => {
  
    const url = `${weatherApiBaseURL}/geo/1.0/direct?q=${search}&appid=${weatherApiKey}`;
    fetch(url)
    .then(function(response) {
        return response.json();
    }).then(function(data ){

        if(!data[0]){
            alert("City not found");
        } else {
            console.log(data);
            console.log(search);
            appendWeatherHistory(search);
            fetchWeather(data[0])
        }
 
        
    }).catch(function(error){
        console.log(error);
    });
    
}

const handleSearchFormSubmit = (event) => {
    event.preventDefault();
    
    const search = searchInput.value.trim();
    if(search) {
        fetchCoordinates(search);
    }
    searchInput.value = "";
}

const initializeSearchHistory = () => {
    const storedWeatherHistory = JSON.parse(localStorage.getItem("weatherHistory"));
    if(storedWeatherHistory) {
        searchHistoryForWeather = storedWeatherHistory;
    }
    createSearchHistory();

}

const handleSearchHistoryClick = (event) => {
    
    if (!event.target.matches(".history-button")){
        return;
    }

    const buttonElement = event.target;

    const search = buttonElement.getAttribute("data-search")
    fetchCoordinates(search);

}


// events
initializeSearchHistory();
searchForm.addEventListener("submit", handleSearchFormSubmit)
weatherHistoryContainer.addEventListener("click", handleSearchHistoryClick);