import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TextInput, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import SettingsService from '../services/SettingsService';
import LocationService from '../services/LocationService';
import styles from '../Stylefolder/Settings.js';

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
  ];

  const languageOptions = [
    { label: 'English', value: 'English' },
    { label: 'Dutch', value: 'Dutch' },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  // Load saved settings
  const loadSettings = async () => {
    const settings = await SettingsService.loadSettings();
    setUseGPS(settings.useGPS || false);
    setDefaultLocation(settings.defaultLocation || '');
    setTemperatureUnit(settings.temperatureUnit || 'Celsius');
    setWindUnit(settings.windUnit || 'km/h');
    setDarkMode(settings.darkMode || false);
    setLanguage(settings.language || 'English');
  };

  // Save a specific setting
  const saveSetting = async (key, value) => {
    await SettingsService.updateSetting(key, value);
  };

  // Handle GPS toggle
  const handleToggleGPS = async (value) => {
    if (value) {
      try {
        await LocationService.getCurrentLocation();
        setUseGPS(true);
        saveSetting('useGPS', true);
      } catch (error) {
        Alert.alert('Permission Denied', 'You need to allow location access to use GPS.');
        setUseGPS(false);
      }
    } else {
      setUseGPS(false);
      saveSetting('useGPS', false);
    }
  };

  // Dropdown handlers
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
            style={[
              styles.input,
              useGPS && styles.disabledInput,
            ]}
            placeholder="Enter city name"
            value={defaultLocation}
            onChangeText={(text) => {
              setDefaultLocation(text);
              saveSetting('defaultLocation', text);
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
              value={temperatureUnit}
              items={tempUnitOptions}
              setOpen={handleTempUnitOpen}
              setValue={(callbackOrValue) => {
                const resolvedValue = typeof callbackOrValue === 'function' 
                  ? callbackOrValue(temperatureUnit) 
                  : callbackOrValue;
                setTemperatureUnit(resolvedValue);
                saveSetting('temperatureUnit', resolvedValue);
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
              value={windUnit}
              items={windUnitOptions}
              setOpen={handleWindUnitOpen}
              setValue={(callbackOrValue) => {
                const resolvedValue = typeof callbackOrValue === 'function' 
                  ? callbackOrValue(windUnit) 
                  : callbackOrValue;
                setWindUnit(resolvedValue);
                saveSetting('windUnit', resolvedValue);
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
              saveSetting('darkMode', value);
            }}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Language</Text>
          <View style={styles.dropdownWrapper}>
            <DropDownPicker
              open={languageOpen}
              value={language}
              items={languageOptions}
              setOpen={handleLanguageOpen}
              setValue={(callbackOrValue) => {
                const resolvedValue = typeof callbackOrValue === 'function' 
                  ? callbackOrValue(language) 
                  : callbackOrValue;
                setLanguage(resolvedValue);
                saveSetting('language', resolvedValue);
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