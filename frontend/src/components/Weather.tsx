import { useEffect, useState } from 'react';
import axios from 'axios';


interface Weather {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState<Weather | null>(null); 

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Montreal&appid=${apiKey}&units=metric&lang=zh_cn`;

  useEffect(() => {
    axios
      .get(apiUrl)
      .then(response => setWeatherData(response.data))
      .catch(error => {
        console.error("Error fetching the weather data", error);
      });
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
