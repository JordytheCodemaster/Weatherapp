import axios from 'axios';
import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig.extra.weatherApiKey;

class WeatherService {
  constructor() {
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  // Get units based on temperature preference
  getUnits(temperatureUnit) {
    switch (temperatureUnit) {
      case 'Fahrenheit':
        return 'imperial';
      case 'Celsius':
        return 'metric';
      case 'Kelvin':
        return 'standard';
      default:
        return 'metric';
    }
  }

  // Get weather by city name
  async getWeatherByCity(cityName, temperatureUnit) {
    if (!cityName.trim()) {
      throw new Error('City name cannot be empty');
    }
    
    const units = this.getUnits(temperatureUnit);
    console.log(`Fetching weather with units: ${units} for temperature unit: ${temperatureUnit}`);
    
    try {
      const weatherResponse = await axios.get(
        `${this.baseUrl}/weather?q=${cityName}&units=${units}&appid=${API_KEY}`
      );

      const forecastResponse = await axios.get(
        `${this.baseUrl}/forecast?q=${cityName}&units=${units}&appid=${API_KEY}`
      );

      // Add the temperatureUnit to the response data for reference
      weatherResponse.data.temperatureUnit = temperatureUnit;
      forecastResponse.data.temperatureUnit = temperatureUnit;

      return {
        currentWeather: weatherResponse.data,
        forecast: this.processForecast(forecastResponse.data)
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error(`Could not find weather data for "${cityName}".`);
    }
  }

  // Get weather by coordinates
  async getWeatherByCoordinates(latitude, longitude, temperatureUnit) {
    const units = this.getUnits(temperatureUnit);
    console.log(`Fetching weather with units: ${units} for temperature unit: ${temperatureUnit}`);
    
    try {
      const weatherResponse = await axios.get(
        `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${API_KEY}`
      );

      const forecastResponse = await axios.get(
        `${this.baseUrl}/forecast?lat=${latitude}&lon=${longitude}&units=${units}&appid=${API_KEY}`
      );

      // Add the temperatureUnit to the response data for reference
      weatherResponse.data.temperatureUnit = temperatureUnit;
      forecastResponse.data.temperatureUnit = temperatureUnit;

      return {
        currentWeather: weatherResponse.data,
        forecast: this.processForecast(forecastResponse.data)
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Could not fetch weather for this location');
    }
  }

  // Process forecast to get daily data
  processForecast(forecastData) {
    // Preserve the temperatureUnit in each forecast item
    const temperatureUnit = forecastData.temperatureUnit;
    const forecastList = forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 5);
    
    // Add temperatureUnit to each forecast item
    forecastList.forEach(item => {
      item.temperatureUnit = temperatureUnit;
    });
    
    return forecastList;
  }
}

export default new WeatherService();