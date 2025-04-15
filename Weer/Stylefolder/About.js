import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1e272e',
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
      color: '#ffffff',
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

export default styles;