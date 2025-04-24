import * as Location from 'expo-location';

class LocationService {
  // Get current location with progressive fallbacks
  async getCurrentLocation() {
    try {
      // Always check permission status first
      const { status } = await Location.getForegroundPermissionsAsync();
      
      // Request permission if not granted
      if (status !== 'granted') {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        if (newStatus !== 'granted') {
          throw new Error('Location permission denied');
        }
      }

      // First try: Get cached location (fastest)
      try {
        const cachedLocation = await Location.getLastKnownPositionAsync();
        if (cachedLocation) {
          console.log('Using cached location');
          return {
            latitude: cachedLocation.coords.latitude,
            longitude: cachedLocation.coords.longitude
          };
        }
      } catch (error) {
        console.log('No cached location available');
      }

      // Second try: Low accuracy location (faster, more reliable)
      try {
        console.log('Trying low accuracy location');
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
          timeInterval: 5000  // Limit time spent looking
        });
        
        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        };
      } catch (error) {
        console.log('Low accuracy failed, trying balanced accuracy');
      }
      
      // Third try: Balanced accuracy (best compromise)
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000  // Limit time spent looking
      });
      
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
      
    } catch (error) {
      console.error('Location error:', error);
      
      if (error.message.includes('location services')) {
        throw new Error('Please enable location services in your device settings');
      } else if (error.message.includes('timed out')) {
        throw new Error('Location request timed out. Try again or check your device settings');
      }
      
      throw error;
    }
  }

  // Add this new method for reverse geocoding
  async getCityFromCoordinates(latitude, longitude) {
    try {
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      
      if (geocode && geocode.length > 0) {
        // City name could be in different fields depending on the location
        return geocode[0].city || geocode[0].district || 
               geocode[0].subregion || geocode[0].region;
      }
      throw new Error('Could not determine city name from location');
    } catch (error) {
      console.error('Error getting city name:', error);
      throw error;
    }
  }
}

export default new LocationService();