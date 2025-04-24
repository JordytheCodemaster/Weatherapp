import 'dotenv/config';

export default {
  name: 'Weer',
  slug: 'Weer',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/Splashscreen.png',
  userInterfaceStyle: 'dark',
  newArchEnabled: true,
  splash: {
    image: './assets/Splashscreen.png',
    resizeMode: 'cover', // Ensures the image fills the screen
  },
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/Splashscreen.png',
    }
  },
  web: {
    favicon: './assets/Splashscreen.png'
  },
  extra: {
    weatherApiKey: process.env.WEATHER_API_KEY
  }
};