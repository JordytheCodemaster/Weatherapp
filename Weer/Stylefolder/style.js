import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1e272e',
    paddingTop: 50,
    paddingLeft: 20,
    paddingRight: 20,
    height: '100%',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  windContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Add spacing between the icon and text
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#dfe4ea',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 0,
  },
  searchButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  locationButton: {
    backgroundColor: '#1abc9c',
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // Makes the overlay cover the entire screen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Semi-transparent background
  },
  tabBarStyle: {
    backgroundColor: '#1e272e', // Dark theme background
    borderTopColor: '#57606f', // Border color for the top of the tab bar
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    marginTop: 20,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
  weatherContainer: {
    flex: 1,
  },
  weatherContentContainer: {
    paddingBottom: 40,
  },
  cityName: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  currentWeather: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  temperature: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  weatherDescription: {
    fontSize: 18,
    color: '#d2dae2',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  detailBox: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  detailLabel: {
    color: '#ced6e0',
    marginBottom: 5,
  },
  detailValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forecastContainer: {
    marginBottom: 20,
  },
  forecastTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  forecastScrollView: {
    flexDirection: 'row',
    paddingLeft: 5,
  },
  forecastItem: {
    backgroundColor: '#2f3542',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    flexDirection: 'column',
    alignItems: 'center',
    width: 80,
  },
  forecastDay: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  forecastIcon: {
    width: 50,
    height: 50,
  },
  forecastTemp: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forecastTempMin: {
    color: '#d2dae2',
    fontSize: 14,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noDataText: {
    color: '#ffffff',
    fontSize: 16,
  },

  //about

  aboutSection: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  aboutText: {
    color: '#d2dae2',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  additionsContainer: {
    marginTop: 30,
    backgroundColor: '#2f3542',
    padding: 15,
    borderRadius: 10,
  },
  additionsTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  additionItem: {
    color: '#d2dae2',
    fontSize: 16,
    marginBottom: 5,
  },
  footerText: {
    marginTop: 30,
    color: '#d2dae2',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default styles;