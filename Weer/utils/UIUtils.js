// Helper functions for UI formatting and display

export const formatTemp = (temp, unit) => {
  if (unit === 'Kelvin') return `${Math.round(temp)} K`;
  if (unit === 'Fahrenheit') return `${Math.round(temp)}°F`;
  return `${Math.round(temp)}°C`; // Default to Celsius
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getWeatherIcon = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Convert wind speed based on selected unit
export const formatWindSpeed = (speed, unit, apiUnit) => {
  // If apiUnit is imperial (mph) and user wants km/h
  if (apiUnit === 'imperial' && unit === 'km/h') {
    return `${Math.round(speed * 1.60934)} ${unit}`;
  }
  // If apiUnit is metric (m/s) and user wants mph
  else if (apiUnit === 'metric' && unit === 'mph') {
    return `${Math.round(speed * 2.23694)} ${unit}`;
  }
  // If apiUnit is metric (m/s) and user wants km/h
  else if (apiUnit === 'metric' && unit === 'km/h') {
    return `${Math.round(speed * 3.6)} ${unit}`;
  }
  // If apiUnit matches user's selection or other cases
  else {
    return `${Math.round(speed)} ${unit}`;
  }
};