import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';

// Weather component
const Weather = () => {
  // Initialize state variables for weather and error
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  // useEffect hook to fetch weather data when component mounts
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Fetch weather data from Open-Meteo API
        const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=41.8781&longitude=-87.6298&current_weather=true');
        // Set weather state variable to fetched weather data
        setWeather(weatherResponse.data.current_weather);
      } catch (err) {
        // Log error if error fetching weather data
        setError('Failed to fetch weather data.');
        console.error(err);
      }
    };

    // Call fetchWeather function
    fetchWeather();
  }, []);

  // If there is an error, display error message
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If weather data is not fetched yet, display loading message
  if (!weather) {
    return <div>Loading...</div>;
  }

  // Return weather data in a Card component
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