import React, {useState} from 'react'
import axios from 'axios'
import './index.css'


function App() {
  const [data,setData]=useState({})
  const [location, setLocation] = useState('')
 const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=988cdcf53c4792a36770cd7c6f58ed96`

 function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  console.log(position.coords.latitude)
  console.log(position.coords.longitude)
  axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=988cdcf53c4792a36770cd7c6f58ed96`).then((response) => {
    setData(response.data)
    console.log(response.data)

  })
}

if (data.name === undefined){
  getLocation()
}

const searchLocation = (event) => {

  if(event.key === 'Enter'){
    axios.get(url).then((response) => {
      setData(response.data)
      console.log(response.data)
  
    })
    setLocation('')

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

    </div>
  )
}

export default App
