import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import styles from '../Stylefolder/Settings.js';
import * as Localization from 'expo-localization';

export default function SettingsPage() {
  const [useGPS, setUseGPS] = useState(false);
  const [defaultLocation, setDefaultLocation] = useState('');
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius');
  const [windUnit, setWindUnit] = useState('km/h');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  const [tempUnitOpen, setTempUnitOpen] = useState(false);
  const [windUnitOpen, setWindUnitOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const tempUnitOptions = [
    { label: 'Celsius', value: 'Celsius' },
    { label: 'Fahrenheit', value: 'Fahrenheit' },
    { label: 'Kelvin', value: 'Kelvin' },
  ];

  const windUnitOptions = [
    { label: 'km/h', value: 'km/h' },
    { label: 'mph', value: 'mph' },
    { label: 'knots', value: 'knots' },
  ];

  const languageOptions = [
    { label: 'English', value: 'English' },
    { label: 'Dutch', value: 'Dutch' },
  ];

  useEffect(() => {
    // AsyncStorage.removeItem('weatherSettings'); // Clear settings for testing
    const loadSystemDefaults = () => {
      const systemLanguage = Localization.locale || 'en';
      const defaultLanguage = systemLanguage.startsWith('nl') ? 'Dutch' : 'English';
      const defaultTemperatureUnit = systemLanguage === 'en-US' ? 'Fahrenheit' : 'Celsius';
      const defaultWindUnit = systemLanguage === 'en-US' ? 'mph' : 'km/h';

      setLanguage((prev) => prev || defaultLanguage);
      setTemperatureUnit((prev) => prev || defaultTemperatureUnit);
      setWindUnit((prev) => prev || defaultWindUnit);
    };

    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('weatherSettings');
        if (savedSettings) {
          const { useGPS, defaultLocation, temperatureUnit, windUnit, darkMode, language } = JSON.parse(savedSettings);
          setUseGPS(useGPS || false);
          setDefaultLocation(defaultLocation || '');
          setTemperatureUnit(temperatureUnit || 'Celsius');
          setWindUnit(windUnit || 'km/h');
          setDarkMode(darkMode || false);
          setLanguage(language || 'English');
          console.log('Settings loaded:', JSON.parse(savedSettings)); // Debugging
        } else {
          // Load system defaults if no saved settings
          loadSystemDefaults();
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async (updatedSettings) => {
    try {
      const currentSettings = {
        useGPS,
        defaultLocation,
        temperatureUnit,
        windUnit,
        darkMode,
        language,
        ...updatedSettings,
      };
      await AsyncStorage.setItem('weatherSettings', JSON.stringify(currentSettings));
      console.log('Settings saved:', currentSettings); // Debugging
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleToggleGPS = async (value) => {
    if (value) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setUseGPS(true);
        saveSettings({ useGPS: true });
      } else {
        Alert.alert('Permission Denied', 'You need to allow location access to use GPS.');
        setUseGPS(false);
      }
    } else {
      setUseGPS(false);
      saveSettings({ useGPS: false });
    }
  };

  const handleTempUnitOpen = (open) => {
    setTempUnitOpen(open);
    if (open) {
      setWindUnitOpen(false);
      setLanguageOpen(false);
    }
  };

  const handleWindUnitOpen = (open) => {
    setWindUnitOpen(open);
    if (open) {
      setTempUnitOpen(false);
      setLanguageOpen(false);
    }
  };

  const handleLanguageOpen = (open) => {
    setLanguageOpen(open);
    if (open) {
      setTempUnitOpen(false);
      setWindUnitOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Location Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location Settings</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Update Default Location with GPS</Text>
          <Switch value={useGPS} onValueChange={handleToggleGPS} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Default Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter city name"
            value={defaultLocation}
            onChangeText={(text) => {
              setDefaultLocation(text);
              saveSettings({ defaultLocation: text });
            }}
            editable={!useGPS}
          />
        </View>
      </View>

      {/* Measurement Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Measurement Preferences</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Temperature Unit</Text>
          <View style={styles.dropdownWrapper}>
          <DropDownPicker
  open={tempUnitOpen}
  value={temperatureUnit} // Always reflects the current setting
  items={tempUnitOptions}
  setOpen={handleTempUnitOpen}
  setValue={(callbackOrValue) => {
    const resolvedValue = typeof callbackOrValue === 'function' ? callbackOrValue(temperatureUnit) : callbackOrValue;
    setTemperatureUnit(resolvedValue);
    saveSettings({ temperatureUnit: resolvedValue });
  }}
  style={[styles.dropdown, styles.zIndexTemp]}
  dropDownContainerStyle={styles.dropdownContainer}
  textStyle={styles.dropdownText}
/>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Wind Unit</Text>
          <View style={styles.dropdownWrapper}>
          <DropDownPicker
  open={windUnitOpen}
  value={windUnit} // Always reflects the current setting
  items={windUnitOptions}
  setOpen={handleWindUnitOpen}
  setValue={(callbackOrValue) => {
    const resolvedValue = typeof callbackOrValue === 'function' ? callbackOrValue(windUnit) : callbackOrValue;
    setWindUnit(resolvedValue);
    saveSettings({ windUnit: resolvedValue });
  }}
  style={[styles.dropdown, styles.zIndexWind]}
  dropDownContainerStyle={styles.dropdownContainer}
  textStyle={styles.dropdownText}
/>
          </View>
        </View>
      </View>

      {/* Appearance and Language */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance and Language</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={(value) => {
              setDarkMode(value);
              saveSettings({ darkMode: value });
            }}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Language</Text>
          <View style={styles.dropdownWrapper}>
          <DropDownPicker
  open={languageOpen}
  value={language} // Always reflects the current setting
  items={languageOptions}
  setOpen={handleLanguageOpen}
  setValue={(callbackOrValue) => {
    const resolvedValue = typeof callbackOrValue === 'function' ? callbackOrValue(language) : callbackOrValue;
    setLanguage(resolvedValue);
    saveSettings({ language: resolvedValue });
  }}
  style={[styles.dropdown, styles.zIndexLang]}
  dropDownContainerStyle={styles.dropdownContainer}
  textStyle={styles.dropdownText}
/>
          </View>
        </View>
      </View>
    </View>
  );
}