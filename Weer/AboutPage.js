import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function AboutPage() {
  return (
    <View style={styles.container}>
      {/* App Icon and Title */}
      <Image
        source={{ uri: 'https://openweathermap.org/img/wn/02d.png' }} // URL van de afbeelding
        style={styles.icon}
      />
      <Text style={styles.title}>Deltion weatherapp</Text>
      <Text style={styles.version}>app versie 1.0.0</Text>

      {/* Additions Section */}
      <View style={styles.additionsContainer}>
        <Text style={styles.additionsTitle}>Toevoegingen</Text>
        <Text style={styles.additionItem}>📍 GPS Instellingen</Text>
        <Text style={styles.additionItem}>📍 Gps tracking weer</Text>
        <Text style={styles.additionItem}>🗺️ Map systeem</Text>
        <Text style={styles.additionItem}>🌦️ Weer forcast</Text>
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>@2025 Jordy & Joram. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  version: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  additionsContainer: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  additionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  additionItem: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 5,
  },
  footerText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 20,
  },
});