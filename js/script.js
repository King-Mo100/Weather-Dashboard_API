// APIkey
const APIkey = "bf7122aa0b76f70b625211a786786f16";

// weatherToday URL
const todayURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" + APIkey;

// 5 dayforecastURL
const forecastURL =  "https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=" + APIkey;

//update weather with values
let searchInp = document.querySelector(".weatherSearch");
let city = document.querySelector(".weatherCity");
let day = document.querySelector(".weatherDay");
let humidity = document.querySelector(".weatherIndicator--humidity>.value");
let wind = document.querySelector(".weatherIndicator--wind>.value");
let pressure = document.querySelector(".weatherIndicator--pressure>.value");
let image = document.querySelector(".weatherImage");
let temeprature = document.querySelector(".weatherTemperature");
let forecastBlock = document.querySelector(".weatherForecast");

//weather images url matching the ids
let weatherImages = [
    {
        url: 'assets/images/clear-sky.png',
        ids: [800]
    },
    {
        url: 'assets/images/broken-clouds.png',
        ids: [803, 804]
    },
    {
        url: 'assets/images/few-clouds.png',
        ids:[801]
    },
    {
        url: 'assets/images/mist.png',
        ids:[701, 711, 721, 731, 741, 751, 761, 771, 781]
    },
    {
        url: 'assets/images/rain.png',
        ids: [500, 501, 502, 503, 504]
    },
    {
        url: 'assets/images/scattered-clouds.png',
        ids: [802]
    },
    {
        url: 'assets/images/shower-rain.png',
        ids: [520, 521, 522, 531, 300, 301, 302, 310, 311, 312, 313, 314, 321]

    },
    {
        url: 'assets/images/snow.png',
        ids: [511, 600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622]
    },
    {
        url: 'assets/images/thunderstorm.png',
        ids: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232]
    }


]

// function to retrive  weather by city name
let getWeatherByCityName = async (city) => {
  let endpoint = todayURL + "&q=" + city;
  let response = await fetch(endpoint);
  let weather = await response.json();

  return weather;
};
// functrion to retieve city using the openeather cityID api
let getForecastByCityId = async (id) => {
  let endpoint = forecastURL + "&id=" + id;
  let result = await fetch(endpoint);
  let forecast = await result.json();
  let forecastList = forecast.list;
  let daily = [];


// Loop through each day for the forecast if time includes 12
  forecastList.forEach((day) => {
    let date = new Date(day.dt_txt.replace(" ", "T"));
    let hours = date.getHours();
    if (hours === 12) {
      daily.push(day);
    }
  });
  return daily;
};

// event listener on key command 13 being the enter key
searchInp.addEventListener("keydown", async (e) => {
  if (e.keyCode === 13) {
    let weather = await getWeatherByCityName(searchInp.value);
    let cityID = weather.id;
    updateCurrentWeather(weather);
   let forecast = await getForecastByCityId(cityID);
   updateForecast(forecast)
  }
    
  
});

// function to input the values of the update current weather variable

let updateCurrentWeather = (data) => {
  city.textContent = data.name + ", " + data.sys.country;
  day.textContent = dayOfWeek();
  humidity.textContent = data.main.humidity;
  pressure.textContent = data.main.pressure;
  let windDirection;
  let deg = data.wind.deg;
  if (deg > 45 && deg <= 135) {
    windDirection = "East";
  } else if (deg > 135 && deg <= 225) {
    windDirection = "South";
  } else if (deg > 225 && deg <= 315) {
    windDirection = "South";
  } else {
    windDirection = "North";
  }
  wind.textContent = windDirection + ", " + data.wind.speed;

  //round the remperature using math.round
  temeprature.textContent =
    data.main.temp > 0
      ? "+" + Math.round(data.main.temp) + "°C"
      : Math.round(data.main.temp);
      
      //update the local images using the image id
      let imgID = data.weather[0].id;
      weatherImages.forEach(obj =>{
        if (obj.ids.includes(imgID)) {
            image.src = obj.url;
        }
      })
};

//update the 5 day forecast and append results onto the page
let updateForecast = (forecast) => {
  forecastBlock.innerHTML = " ";
  forecast.forEach((day) => {
    let iconURL =
      "http://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png";
    let dayName = dayOfWeek(day.dt * 1000);
    let temeprature =
      day.main.temp > 0
        ? "+" + Math.round(day.main.temp)
        : Math.round(day.main.temp);
    let forecastItem = ` 
        <article class="weatherForecastItem">
        <img src="${iconURL}" alt="${day.weather[0].description}" class="weather_forecast_icon">
        <h3 class="weatherForecastDay">${dayName}</h3>
        <p class="weatherForecastTemperature"><span class="value">${temeprature}</span>&deg;C</p>
    </article>
    `;
    forecastBlock.insertAdjacentHTML("beforeend", forecastItem);
  });
};
// function to retrieve the day of the week as a string in full and in english
let dayOfWeek = (dt = new Date().getTime()) => {
  return new Date(dt).toLocaleDateString("en-EN", { weekday: "long" });
};
