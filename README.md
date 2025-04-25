# 🌦️ Weather App

A **React Native** mobile application that provides real-time weather information and forecasts using the **OpenWeatherMap API**.

Built with **Expo**, this app uses your device's GPS to provide local weather conditions, along with an interactive map and various display options.

---

## ✨ Features

- 📍 **Current weather** conditions for your location
- 📅 **5-day forecast** with daily weather insights
- 🌍 **Location-based weather** using GPS
- 🗺️ **Interactive weather map** with multiple layers:
  - Clouds
  - Rain
  - Temperature
  - Wind
  - Pressure
- 🌡️ **Customizable units**: Celsius, Fahrenheit, or Kelvin
- 💨 **Wind speed** in km/h or mph
- 🌙 **Dark mode** capability
- 🌐 **Multiple language support**

---

## 🔧 Prerequisites

Before getting started, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or newer)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- An OpenWeatherMap API Key from [https://openweathermap.org/api](https://openweathermap.org/api)
- A mobile device with the **Expo Go** app, or an emulator/simulator:
  - iOS Simulator (macOS only)
  - Android Emulator
  - Physical Android/iOS device

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/JordytheCodemaster/Weatherapp.git
cd weather-app
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using Yarn:

```bash
yarn install
```

### 3. Install Expo CLI

If you don’t have Expo installed yet, install it globally:

```bash
npm install -g expo-cli
```

You can verify the installation with:

```bash
expo --version
```

### 4. Add Your OpenWeatherMap API Key

Create a file called `.env` in the root directory and add the following:

```env
OPENWEATHER_API_KEY=your_api_key_here
```

You can get your API key for free from: [https://openweathermap.org/api](https://openweathermap.org/api)

If you're not using a `.env` setup, you can also hardcode it (not recommended for production).

### 5. Run the App

To start the development server, run:

```bash
expo start
```

This will open the Expo Dev Tools in your browser. Choose one of the following options:

- Scan the QR code using Expo Go (Android/iOS) on your phone.
- Press `i` to launch the iOS simulator (macOS only).
- Press `a` to launch the Android emulator.

---

## 📱 Testing on Device

1. Install the Expo Go app:
   - [Android (Play Store)](https://play.google.com/store)
   - [iOS (App Store)](https://apps.apple.com/)

2. Open Expo Go and scan the QR code from your terminal or browser after running `expo start`.

---

## 🌐 API Reference

This app uses OpenWeatherMap's One Call API and map tile layers.

- **Current Weather**: `/weather`
- **Forecast**: `/forecast`
- **Maps**: `/maps/{layer}`

---

## ⚙️ Project Structure

```plaintext
weather-app/
├── assets/
├── components/
├── screens/
├── utils/
├── App.js
├── app.json
├── .env
└── package.json
```

