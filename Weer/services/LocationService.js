import * as Location from 'expo-location';

class LocationService {
  constructor() {
    this.permissionGranted = false;
  }

  // Request location permissions and get current coordinates
  async getCurrentLocation() {
    // Only request permissions if not already granted
    if (!this.permissionGranted) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }
      this.permissionGranted = true;
    }

    // Use high accuracy for faster results
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.high // Balance between speed and accuracy
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };
  }
}

export default new LocationService();