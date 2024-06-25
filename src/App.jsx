import React, {useEffect, useState} from 'react'
import axios from 'axios'
import './index.css'


function App() {
  const [data,setData]=useState({})
  const [futureData,setFutureData]=useState([])
  const [location, setLocation] = useState('')
  
 const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=988cdcf53c4792a36770cd7c6f58ed96`


 useEffect(() => {
  getLocation()

}
,[])
 
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};

var latitude = 0;
var longitude = 0;


function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=988cdcf53c4792a36770cd7c6f58ed96`).then((response) => {
    setData(response.data)
    fetchFutureWeather(latitude, longitude)

  })
  .catch((error) => {
    console.log(error)
  })
}

const fetchFutureWeather = (lat, lon) => {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=988cdcf53c4792a36770cd7c6f58ed96`
    )
    .then((response) => {
      const dailyData = processForecastData(response.data.list);
      
      setFutureData(dailyData)
    })
    .catch((error) => {
      alert("Error fetching future weather data")
    });
};
const processForecastData = (forecastList) => {
  const dailyData = [];
  let currentDate = '';

  forecastList.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    
    if (date !== currentDate) {
      dailyData.push({
        date,
        temp: item.main.temp,
        weather: item.weather[0].main,
        icon: item.weather[0].icon,
      });
      currentDate = date;
    }
  });

  return dailyData.slice(1, 4);
};

const getDayOfWeek = (dt) => {
  const date = new Date(dt);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};


const searchLocation = (event) => {

  if(event.key === 'Enter'){
    axios
    .get(url)
    .then((response) => {
      setData(response.data)

      var lat = response.data.coord.lat;
      var lon = response.data.coord.lon;
     
      fetchFutureWeather(lat, lon)

      
    setLocation('')
  
    })
    .catch((error) => {
      console.error(error.response.data.message);
      setLocation('')
    });
    


  }
}
  


  return (
    <div className='app'>
      <div className="search">
        <input 
        value = {location}
        onChange={event => setLocation(event.target.value)}
        onKeyPress={searchLocation}
        placeholder='Enter Location'
        type="text" />
      </div>
      <div className="main">
      <div className='container'>
        <div className='top'>
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
            {data.weather ? (
                <img
                  src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                  alt={data.weather[0].main}
                />
              ) : null}
            
          </div>
        </div>

{data.main != undefined &&

        <div className='bottom'>
          <div className="feels">
            {data.main ? <p className='bold'>{data.main.feels_like.toFixed()}°C</p> : null}
          <p>Feels Like</p>
          </div>
          <div className="humidity">
            {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
            <p>Humidity</p>
            </div>
          <div className="wind">
            {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} MPH</p> : null}
            
            <p>Wind Speed</p>
            
            </div>
        </div>

}


      </div>
     <div className='container2'>
          {futureData.map((forecast, index) => (
            <div key={index} className='container2-1'>
              <div className='top-1'>
                <div className='location-1'>
                  <p>{getDayOfWeek(forecast.date)}</p>
                </div>
                <div className='temp-1'>
                  <h1>{forecast.temp.toFixed()}°C</h1>
                </div>
                <div className='description-1'>
                  <p>{forecast.weather}</p>
                  {forecast ? (
                <img
                  src={`http://openweathermap.org/img/wn/${forecast.icon}.png`}
                  alt={data.weather[0].main}
                />
              ) : null}
                </div>
                </div>
              </div>
          ))}
        </div>
        
      </div>
      </div>
     
  )
}

export default App
