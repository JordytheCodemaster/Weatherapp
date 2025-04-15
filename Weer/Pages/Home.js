import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsPage from './SettingsPage';
import AboutPage from './AboutPage';
import MapPage from './MapPage';
import styles from '../Stylefolder/style';
const API_KEY = Constants.expoConfig.extra.weatherApiKey;

function HomeScreen() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('Amsterdam');
  const [city, setCity] = useState('Amsterdam');
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius'); // Default to Celsius
  const [windUnit, setWindUnit] = useState('m/s'); // Default to m/s

  // Function to load settings from AsyncStorage
  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('weatherSettings');
      if (savedSettings) {
        const { temperatureUnit, windUnit } = JSON.parse(savedSettings);
        setTemperatureUnit(temperatureUnit || 'Celsius');
        setWindUnit(windUnit || 'm/s');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Use useFocusEffect to load settings and fetch weather data when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchSettingsAndWeather = async () => {
        await loadSettings(); // Load settings
        if (city) {
          fetchWeatherData(city); // Fetch weather data for the current city
        }
      };

      fetchSettingsAndWeather();
    }, [city]) // Dependencies: re-run when `city` changes
  );

  const getUnits = () => {
    if (temperatureUnit === 'Fahrenheit') return 'imperial';
    if (temperatureUnit === 'Celsius') return 'metric';
    return ''; // Default to Kelvin (Standard)
  };

  const fetchWeatherData = async (cityName) => {
    if (!cityName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const units = getUnits(); // Get units based on temperature setting
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${units}&appid=${API_KEY}`
      );

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${units}&appid=${API_KEY}`
      );

      setWeatherData(weatherResponse.data);

      const dailyForecast = forecastResponse.data.list.filter((item, index) => index % 8 === 0).slice(0, 5);
      setForecast(dailyForecast);

    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(`Could not find weather data for "${cityName}".`);
      setWeatherData(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async () => {
    setLoading(true);
    setError('');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location access denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const units = getUnits(); // Get units based on temperature setting
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${API_KEY}`
      );

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${units}&appid=${API_KEY}`
      );

      setWeatherData(weatherResponse.data);
      setCity(weatherResponse.data.name);

      const dailyForecast = forecastResponse.data.list.filter((item, index) => index % 8 === 0).slice(0, 5);
      setForecast(dailyForecast);

    } catch (error) {
      console.error('Error fetching location:', error);
      setError('Could not fetch location');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatTemp = (temp) => {
    if (temperatureUnit === 'Kelvin') return `${Math.round(temp)} K`;
    if (temperatureUnit === 'Fahrenheit') return `${Math.round(temp)}°F`;
    return `${Math.round(temp)}°C`; // Default to Celsius
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
            placeholder="Type a city"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => fetchWeatherData(searchText)}
          />
          <TouchableOpacity style={styles.searchButton} onPress={() => fetchWeatherData(searchText)}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.locationButton} onPress={fetchWeatherByLocation}>
          <Text style={styles.locationButtonText}>Use my location</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : weatherData ? (
        <ScrollView style={styles.weatherContainer} contentContainerStyle={styles.weatherContentContainer}>
          <Text style={styles.cityName}>{weatherData.name}, {weatherData.sys.country}</Text>

          <View style={styles.currentWeather}>
            <Image source={{ uri: getWeatherIcon(weatherData.weather[0].icon) }} style={styles.weatherIcon} />
            <Text style={styles.temperature}>{formatTemp(weatherData.main.temp)}</Text>
            <Text style={styles.weatherDescription}>{weatherData.weather[0].description}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
            </View>
            <View style={styles.detailBox}>
    <Text style={styles.detailLabel}>Wind</Text>
    <Text style={styles.detailValue}>
  {weatherData.wind.speed} {windUnit}
</Text>
  </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Pressure</Text>
              <Text style={styles.detailValue}>{weatherData.main.pressure} hPa</Text>
            </View>
          </View>

          <View style={styles.forecastContainer}>
            <Text style={styles.forecastTitle}>5-day forecast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastScrollView}>
              {forecast.map((item, index) => (
                <View key={index} style={styles.forecastItem}>
                  <Text style={styles.forecastDay}>{formatDate(item.dt)}</Text>
                  <Image source={{ uri: getWeatherIcon(item.weather[0].icon) }} style={styles.forecastIcon} />
                  <Text style={styles.forecastTemp}>{formatTemp(item.main.temp_max)}</Text>
                  <Text style={styles.forecastTempMin}>{formatTemp(item.main.temp_min)}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Search for a city to see weather data</Text>
        </View>
      )}
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'About') {
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            } else if (route.name === 'Map') {
              iconName = focused ? 'map' : 'map-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Map" component={MapPage} />
        <Tab.Screen name="Settings" component={SettingsPage} />
        <Tab.Screen name="About" component={AboutPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}