import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import styles from '../Stylefolder/About.js';
export default function AboutPage() {
  return (
    <View style={styles.container}>
      {/* App Icon and Title */}
      <Image
        source={{ uri: 'https://openweathermap.org/img/wn/02d.png' }} // URL van de afbeelding
        style={styles.icon}
      />
      <Text style={styles.title}>Deltion weatherapp</Text>
      <Text style={styles.version}>App Version 1.0.0</Text>

      {/* Additions Section */}
      <View style={styles.additionsContainer}>
        <Text style={styles.additionsTitle}>Additions</Text>
        <Text style={styles.additionItem}>📍 GPS Settings</Text>
        <Text style={styles.additionItem}>📍 Gps Weather Tracking</Text>
        <Text style={styles.additionItem}>🗺️ Map System</Text>
        <Text style={styles.additionItem}>🌦️ Weather Forecast</Text>
      </View>
{/* features Section */}
      <View style={styles.additionsContainer}>
        <Text style={styles.additionsTitle}>Comming next:</Text>
        <Text style={styles.additionItem}>Dark mode/ lightmode option</Text>
        <Text style={styles.additionItem}>Language settings</Text>
        <Text style={styles.additionItem}> In depth weather</Text>
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>@2025 Jordy & Joram. All rights reserved.</Text>
    </View>
  );
}

