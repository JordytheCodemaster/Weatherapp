import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

class SettingsService {
  // Load settings from storage
  async loadSettings() {
    try {
      const savedSettings = await AsyncStorage.getItem('weatherSettings');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      } else {
        return this.getDefaultSettings();
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      return this.getDefaultSettings();
    }
  }

  // Save settings to storage
  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem('weatherSettings', JSON.stringify(settings));
      console.log('Settings saved:', settings);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  // Update specific setting
  async updateSetting(key, value) {
    try {
      const currentSettings = await this.loadSettings();
      const updatedSettings = { ...currentSettings, [key]: value };
      return await this.saveSettings(updatedSettings);
    } catch (error) {
      console.error(`Error updating setting ${key}:`, error);
      return false;
    }
  }

  // Get system default settings
  getDefaultSettings() {
    const systemLanguage = Localization.locale || 'en';
    return {
      useGPS: false,
      defaultLocation: 'Amsterdam',
      temperatureUnit: systemLanguage === 'en-US' ? 'Fahrenheit' : 'Celsius',
      windUnit: systemLanguage === 'en-US' ? 'mph' : 'km/h',
      darkMode: false,
      language: systemLanguage.startsWith('nl') ? 'Dutch' : 'English',
    };
  }
}

export default new SettingsService();