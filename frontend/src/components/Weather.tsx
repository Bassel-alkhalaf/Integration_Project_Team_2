import { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Montreal&appid=${apiKey}`;

  useEffect(() => {
    axios.get(apiUrl).then(response => setWeatherData(response.data));
  }, [apiUrl]);

  if (!weatherData) return <div>Loading...</div>;

  return (
    <div>
      <h1>Weather in {weatherData.name}</h1>
      <p>{weatherData.main.temp}°C</p>
      <p>{weatherData.weather[0].description}</p>
    </div>
  );
};

export default WeatherComponent;