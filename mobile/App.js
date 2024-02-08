import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, TouchableOpacity, Text } from 'react-native';
import MapView from 'react-native-maps';

const App = () => {
  const [latitude, setLatitude] = useState(''); // State for latitude input
  const [longitude, setLongitude] = useState(''); // State for longitude input
  const [isMenuExpanded, setMenuExpanded] = useState(false);

  const mapRef = React.createRef(); // Reference for the MapView component

  const handleSetLocation = () => {
    // Implement logic to set the map location based on entered latitude and longitude
    if (latitude && longitude) {
      // Convert latitude and longitude to numbers
      const lat = parseFloat(latitude);
      const long = parseFloat(longitude);

      // Check if lat and long are valid numbers
      if (!isNaN(lat) && !isNaN(long)) {
        // Set the map location
        mapRef.current.animateToRegion({
          latitude: lat,
          longitude: long,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    }
  };

  const toggleMenu = () => {
    setMenuExpanded(!isMenuExpanded);
  };

  return (
    <View style={styles.container}>
      {/* Collapsible Menu */}
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Text style={styles.menuButtonText}>Menu</Text>
      </TouchableOpacity>

      {/* Collapsible Section */}
      {isMenuExpanded && (
        <View style={styles.collapsibleSection}>
          {/* Latitude Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter latitude"
            keyboardType="numeric"
            value={latitude}
            onChangeText={(text) => setLatitude(text)}
          />

          {/* Longitude Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter longitude"
            keyboardType="numeric"
            value={longitude}
            onChangeText={(text) => setLongitude(text)}
          />

          {/* Button to set location */}
          <Button title="Set Location" onPress={handleSetLocation} />
        </View>
      )}

      {/* MapView component */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 26.8467,
          longitude: 80.9462,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: 'lightgreen',
    borderWidth: 1,
    margin: 5,
    paddingLeft: 10,
  },
  menuButton: {
    backgroundColor: 'lightgreen',
    padding: 10,
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  collapsibleSection: {
    backgroundColor: 'white',
    padding: 10,
  },
});

export default App;
