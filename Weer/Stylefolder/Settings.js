import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1e272e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15, // Space between dropdowns
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    marginRight: 10, // Space between label and dropdown
  },
  input: {
    backgroundColor: '#ffffff', // Restored default location input color
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  dropdown: {
    backgroundColor: '#2f3542',
    borderColor: '#57606f',
    borderWidth: 1,
    width: 150,
    marginBottom: 10,
    color: '#fff',
  
},
  dropdownContainer: {
    backgroundColor: '#2f3542',
    borderColor: '#57606f',
  },
  dropdownText: {
    color: '#ffffff',
  },
  dropdownWrapper: {
    width: 150,
  }
  
});

export default styles;