import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { debounce } from 'lodash';
import Constants from 'expo-constants';


const API_KEY = Constants.expoConfig.extra.weatherApiKey;

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('Amsterdam');
  const [city, setCity] = useState('Amsterdam');

  // Fetch weather data when component mounts with default city
  useEffect(() => {
    fetchWeatherData(city);
  }, []);

  // This is our debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((text) => {
      if (text.trim().length > 2) { // Only search if user typed at least 3 characters
        setCity(text);
        fetchWeatherData(text);
      }
    }, 600), // 600ms delay before executing search
    []
  );

  // Update search text and trigger debounced search
  const handleSearchTextChange = (text) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  // Manual search function (for search button)
  const handleSearch = () => {
    if (searchText.trim()) {
      setCity(searchText);
      fetchWeatherData(searchText);
    }
  };

  const fetchWeatherData = async (cityName) => {
    if (!cityName.trim()) return;

    setLoading(true);
    setError('');
    try {
      // Fetch current weather
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      
      // Fetch 5-day forecast
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      
      setWeatherData(weatherResponse.data);
      
      // Process forecast data to get one forecast per day
      const dailyForecast = forecastResponse.data.list.filter((item, index) => index % 8 === 0).slice(0, 5);
      setForecast(dailyForecast);
      
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(`Could not find weather data for "${cityName}". Please check the city name.`);
      setWeatherData(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('nl-NL', { weekday: 'short' });
  };

  const formatTemp = (temp) => {
    return Math.round(temp);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Weather App</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter city name"
            value={searchText}
            onChangeText={handleSearchTextChange}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : weatherData ? (
        <ScrollView 
          style={styles.weatherContainer}
          contentContainerStyle={styles.weatherContentContainer}
        >
          <Text style={styles.cityName}>{weatherData.name}, {weatherData.sys.country}</Text>
          
          <View style={styles.currentWeather}>
            <Image 
              source={{ uri: getWeatherIcon(weatherData.weather[0].icon) }} 
              style={styles.weatherIcon} 
            />
            <Text style={styles.temperature}>{formatTemp(weatherData.main.temp)}°C</Text>
            <Text style={styles.weatherDescription}>{weatherData.weather[0].description}</Text>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Wind</Text>
              <Text style={styles.detailValue}>{Math.round(weatherData.wind.speed)} km/h</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Feels like</Text>
              <Text style={styles.detailValue}>{formatTemp(weatherData.main.feels_like)}°C</Text>
            </View>
          </View>
          
          <View style={styles.forecastContainer}>
            <Text style={styles.forecastTitle}>5-Day Forecast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastScrollView}>
              {forecast.map((item, index) => (
                <View key={index} style={styles.forecastItem}>
                  <Text style={styles.forecastDay}>{formatDate(item.dt)}</Text>
                  <Image 
                    source={{ uri: getWeatherIcon(item.weather[0].icon) }} 
                    style={styles.forecastIcon} 
                  />
                  <Text style={styles.forecastTemp}>
                    {formatTemp(item.main.temp_max)}°
                  </Text>
                  <Text style={styles.forecastTempMin}>
                    {formatTemp(item.main.temp_min)}°
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Search for a city to see weather information</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#4a90e2',
  },
  header: {
    backgroundColor: '#4a90e2',
    padding: 20,
    paddingTop: 50,
    paddingBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#1e6acc',
    borderRadius: 8,
    padding: 12,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  weatherContainer: {
    flex: 1,
  },
  weatherContentContainer: {
    padding: 20,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2c3e50',
  },
  currentWeather: {
    alignItems: 'center',
    marginVertical: 20,
  },
  weatherIcon: {
    width: 120,
    height: 120,
  },
  temperature: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  weatherDescription: {
    fontSize: 20,
    color: '#7f8c8d',
    textTransform: 'capitalize',
    marginTop: 5,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailBox: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  forecastContainer: {
    marginTop: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  forecastScrollView: {
    marginBottom: 10,
  },
  forecastItems: {
    flexDirection: 'row',
  },
  forecastItem: {
    alignItems: 'center',
    marginRight: 25,
    paddingVertical: 10,
    minWidth: 70,
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  forecastIcon: {
    width: 50,
    height: 50,
    margin: 5,
  },
  forecastTemp: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  forecastTempMin: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 4,
  },
});
