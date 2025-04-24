import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MapView, { UrlTile, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Constants from 'expo-constants';
import LocationService from '../services/LocationService';
import SettingsService from '../services/SettingsService';

const API_KEY = Constants.expoConfig.extra.weatherApiKey;

// Available weather layers from OpenWeatherMap
const WEATHER_LAYERS = [
  { id: 'clouds_new', name: 'Clouds' },
  { id: 'precipitation_new', name: 'Rain' },
  { id: 'temp_new', name: 'Temperature' },
  { id: 'wind_new', name: 'Wind' },
  { id: 'pressure_new', name: 'Pressure' },
];

export default function MapPage() {
  const [currentLayer, setCurrentLayer] = useState(WEATHER_LAYERS[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [region, setRegion] = useState({
    latitude: 52.3676,  // Amsterdam default
    longitude: 4.9041,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [settings, setSettings] = useState({});
  const mapRef = useRef(null);

  // Load user settings and location
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
  
        // Load user settings
        const userSettings = await SettingsService.loadSettings();
        setSettings(userSettings);
  
        // Attempt to get the user's current location
        const location = await LocationService.getCurrentLocation();
        setUserLocation(location);
        setRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 5,
          longitudeDelta: 5,
        });
      } catch (locError) {
        console.error('Location error:', locError);
        setError('Could not fetch your location. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    initialize();
  }, []);

  // Handle finding user's location
  const goToUserLocation = async () => {
    // Clear any previous errors
    setError('');
    
    try {
      setLoading(true);
      
      let location;
      try {
        // Attempt to get location with a reasonable timeout
        location = await LocationService.getCurrentLocation();
      } catch (error) {
        // If it fails, show alert but continue with last known location if available
        if (userLocation) {
          Alert.alert(
            "Location Error",
            "Using your last known location. " + error.message,
            [{ text: "OK" }]
          );
          location = userLocation;
        } else {
          throw error; // Re-throw if we have no fallback
        }
      }
      
      // Update the user location state
      setUserLocation(location);
      
      // Animate map to the location
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }, 500);
        
        // Wait for animation to complete before turning off loading
        setTimeout(() => {
          setLoading(false);
        }, 600);
      } else {
        setLoading(false);
      }
      
    } catch (error) {
      console.error('Location error:', error);
      
      // More user-friendly error handling
      if (error.message.includes("timed out")) {
        setError("Location request timed out. Please check your device settings and try again.");
      } else {
        setError("Could not get your location: " + error.message);
      }
      
      setLoading(false);
    }
  };

  // Generate OpenWeatherMap tile URL based on the selected layer
  const getTileUrl = () => {
    // Get units based on user settings
    const units = settings.temperatureUnit === 'Fahrenheit' ? 'imperial' : 'metric';
    
    return `https://tile.openweathermap.org/map/${currentLayer.id}/{z}/{x}/{y}.png?appid=${API_KEY}`;
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Loading Map...</Text>
        </View>
      )}
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.dismissButton} 
            onPress={() => setError('')}
          >
            <Text style={styles.dismissButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation={false}  // Change this to false to hide the blue dot
            followsUserLocation={false}
          >
            {/* OpenWeatherMap tile overlay */}
            <UrlTile 
              urlTemplate={getTileUrl()}
              zIndex={1}
              maximumZ={19}
            />
            
            {/* Keep the custom marker (waypoint) */}
            {userLocation && (
              <Marker
                coordinate={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude
                }}
                title="Your Location"
                pinColor="#3498db"
              />
            )}
          </MapView>
          
          {/* Layer selection controls */}
          <View style={styles.layerControls}>
            <Text style={styles.layerTitle}>Weather Layers</Text>
            <View style={styles.layerButtons}>
              {WEATHER_LAYERS.map(layer => (
                <TouchableOpacity
                  key={layer.id}
                  style={[
                    styles.layerButton,
                    currentLayer.id === layer.id && styles.activeLayerButton
                  ]}
                  onPress={() => setCurrentLayer(layer)}
                >
                  <Text 
                    style={[
                      styles.layerButtonText,
                      currentLayer.id === layer.id && styles.activeLayerButtonText
                    ]}
                  >
                    {layer.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Location button */}
          <TouchableOpacity style={styles.locationButton} onPress={goToUserLocation}>
            <Text style={styles.locationButtonText}>My Location</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e272e',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10,
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    margin: 20,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  dismissButton: {
    backgroundColor: '#ffffff20',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  dismissButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  layerControls: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(30, 39, 46, 0.8)',
    borderRadius: 10,
    padding: 10,
  },
  layerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  layerButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  layerButton: {
    backgroundColor: '#2f3542',
    padding: 8,
    borderRadius: 20,
    margin: 4,
    minWidth: 90,
  },
  layerButtonText: {
    color: '#d2dae2',
    textAlign: 'center',
    fontSize: 12,
  },
  activeLayerButton: {
    backgroundColor: '#3498db',
  },
  activeLayerButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  locationButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
  },
  locationButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});