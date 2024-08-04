//weather app

 const userTab = document.querySelector("[data-userWeather]");
 const searchTab = document.querySelector("[data-SearchWeather]");
 const userContainer = document.querySelector("[weather-container]");
 
const grantAcessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container"); 
const userInfoContainer = document.querySelector(".user-info-container");

//initial setup
let currentTab= userTab;
//const API_KEY = 
currentTab.classList.add("current-tab");
const options = {  method: 'GET',  headers: {   
    'x-rapidapi-key': 'e830aabfeemshe53c22cce3ad47fp16613ajsnf5045b580713',  
     'x-rapidapi-host': 'open-weather13.p.rapidapi.com'  } };
getfromSessionStorage();

function switchTab(newTab){
    if(newTab != currentTab){
        //shift background color
        currentTab.classList.remove("current-tab");
        currentTab = newTab;
        currentTab.classList.add("current-tab");

        
         if(!searchForm.classList.contains("active")){
            //your tab ---> search tab
            userInfoContainer.classList.remove("active");
            grantAcessContainer.classList.remove("active");
            searchForm.classList.add("active");
         }
         else{
            //search tab ---> your tab
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
             //check for coordinate is saved 
            getfromSessionStorage();


         }
    }

}

userTab.addEventListener("click",() => {
    switchTab(userTab);
})
searchTab.addEventListener("click",() => {
    switchTab(searchTab);
})

function getfromSessionStorage(){
    //check if coordinates are already present in sessiom storage
    //sesion storage is a web storage tech. that allows you to store data in a web browser

    const localCoordinates = sessionStorage.getItem('user-coordinates');
    if(!localCoordinates){
        grantAcessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


async function fetchUserWeatherInfo(coordinates){
     const {lat , lon} = coordinates;
    // make grant container invisible
    grantAcessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    try {
        //API Fetching
        const response = await fetch(`https://open-weather13.p.rapidapi.com/city/latlon/${lat}/${lon}`, options);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        console.log(data);
    } catch (error) {
        loadingScreen.classList.remove("active");
        console.error(error);
    }
}
function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-countryIcon]');
    const description = document.querySelector('[data-weatherDesc]');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temp = document.querySelector('[data-temp]');
    const windspeed = document.querySelector('[data-windspeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloudiness = document.querySelector('[data-cloudiness]');

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    description.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    const tempInKelvin = weatherInfo?.main?.temp;
    const tempInCelsius = tempInKelvin - 273.15;
    temp.innerText = `${tempInCelsius.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity.toFixed(2)} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all.toFixed(2)} %`;
}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        grantAccessButton.style.display = 'none';

    }

}
function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
} 
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e) =>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAcessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://open-weather13.p.rapidapi.com/city/${city}/EN`, options);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
       
    } catch (error) {
        console.error(error);
    }
}