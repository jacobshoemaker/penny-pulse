import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Fetch weather data from Open-Meteo API
        const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=41.8781&longitude=-87.6298&current_weather=true');
        setWeather(weatherResponse.data.current_weather);
      } catch (err) {
        setError('Failed to fetch weather data.');
        console.error(err);
      }
    };

    fetchWeather();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!weather) {
    return <div>Loading...</div>;
  }

  return (
    <Card style={{ width: '18rem', margin: '10px' }}>
      <Card.Body>
        <Card.Title>Current Weather</Card.Title>
        <Card.Text>
          <strong>Temperature:</strong> {weather.temperature}°C<br />
          <strong>Weather:</strong> {weather.weathercode}<br />
          <strong>Wind Speed:</strong> {weather.windspeed} km/h
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Weather;