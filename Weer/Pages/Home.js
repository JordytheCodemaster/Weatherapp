import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import WeatherService from '../services/WeatherService';
import SettingsService from '../services/SettingsService';
import LocationService from '../services/LocationService';
import { formatTemp, formatDate, getWeatherIcon, formatWindSpeed } from '../utils/UIUtils';
import SettingsPage from './SettingsPage';
import AboutPage from './AboutPage';
import MapPage from './MapPage';
import styles from '../Stylefolder/style';

function HomeScreen() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('Amsterdam');
  const [city, setCity] = useState('');
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius'); 
  const [windUnit, setWindUnit] = useState('m/s');

  // Load settings from storage
  const loadSettings = async () => {
    try {
      const settings = await SettingsService.loadSettings();
      setTemperatureUnit(settings.temperatureUnit);
      setWindUnit(settings.windUnit);
      if (settings.defaultLocation) {
        setSearchText(settings.defaultLocation);
        setCity(settings.defaultLocation);
      }
      return settings;
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Initial load
  useEffect(() => {
    loadSettings();
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('Home screen in focus, loading settings...');
      loadSettings().then(() => {
        if (city) {
          console.log('Refreshing weather data after settings change');
          fetchWeatherData(city);
        }
      });
    }, [])
  );

  // Fetch weather when city or temperature unit changes
  useEffect(() => {
    if (city) {
      fetchWeatherData(city);
    }
  }, [city, temperatureUnit]);

  // Fetch weather data by city name
  const fetchWeatherData = async (cityName) => {
    if (!cityName.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const weatherData = await WeatherService.getWeatherByCity(cityName, temperatureUnit);
      setWeatherData(weatherData.currentWeather);
      setForecast(weatherData.forecast);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // Get weather data using the device's location
  const fetchWeatherByLocation = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { latitude, longitude } = await LocationService.getCurrentLocation();
      
      const weatherData = await WeatherService.getWeatherByCoordinates(
        latitude, 
        longitude, 
        temperatureUnit
      );
      
      setWeatherData(weatherData.currentWeather);
      setCity(weatherData.currentWeather.name);
      setForecast(weatherData.forecast);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Loading indicator */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Loading</Text>
        </View>
      )}

      {/* Header */}
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

      {/* Content */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : weatherData ? (
        <ScrollView
          style={styles.weatherContainer}
          contentContainerStyle={styles.weatherContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.cityName}>{weatherData.name}, {weatherData.sys.country}</Text>

          <View style={styles.currentWeather}>
            <Image source={{ uri: getWeatherIcon(weatherData.weather[0].icon) }} style={styles.weatherIcon} />
            <Text style={styles.temperature}>{formatTemp(weatherData.main.temp, temperatureUnit)}</Text>
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
                {formatWindSpeed(
                  weatherData.wind.speed, 
                  windUnit, 
                  temperatureUnit === 'Fahrenheit' ? 'imperial' : 'metric'
                )}
              </Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Pressure</Text>
              <Text style={styles.detailValue}>{weatherData.main.pressure} hPa</Text>
            </View>
          </View>

          <View style={styles.forecastContainer}>
            <Text style={styles.forecastTitle}>5-day forecast</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.forecastScrollView}
            >
              {forecast.map((item, index) => (
                <View key={index} style={styles.forecastItem}>
                  <Text style={styles.forecastDay}>{formatDate(item.dt)}</Text>
                  <Image source={{ uri: getWeatherIcon(item.weather[0].icon) }} style={styles.forecastIcon} />
                  <Text style={styles.forecastTemp}>{formatTemp(item.main.temp_max, temperatureUnit)}</Text>
                  <Text style={styles.forecastTempMin}>{formatTemp(item.main.temp_min, temperatureUnit)}</Text>
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
          tabBarStyle: {
            backgroundColor: '#1e272e',
          },
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: '#7f8c8d',
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