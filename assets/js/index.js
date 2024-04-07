let searchHistoryForWeather = [];
const weatherApiBaseURL = "https://api.openweathermap.org";
const weatherApiKey = "5c0827e6dfab0abc1d7d91077faa8a42";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const todayContainer = document.querySelector("#today");
const forecastContainer = document.querySelector("#forecast");
const weatherHistoryContainer = document.querySelector("#weather-history");

const fetchWeather = (location) => {

}

const createSearchHistory =  () => {
    weatherHistoryContainer.innerHTML = "";
    for(let index = 0; index < searchHistoryForWeather.length; index++) {
        const buttonElement = document.createElement("button");
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
    .then(function(respone) {
        return respone.json();
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

searchForm.addEventListener("submit", handleSearchFormSubmit)