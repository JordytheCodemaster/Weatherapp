import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapPage() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Map</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e272e',
    },
    text: {
        color: '#ffffff',
        fontSize: 20,
    },
});