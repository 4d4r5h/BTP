import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const App = () => {
  // Default coordinates for the initial map region
  const defaultCoordinates = {
    latitude: 25.5356,
    longitude: 84.8513,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Initial default marker
  const defaultMarker = {
    id: 0,
    coordinate: {
      latitude: defaultCoordinates.latitude,
      longitude: defaultCoordinates.longitude,
    },
    title: 'Default Location',
  };

  // State to manage markers on the map
  const [markers, setMarkers] = useState([defaultMarker]);

  // State to manage the path coordinates
  const [pathCoordinates, setPathCoordinates] = useState([{
    latitude: defaultCoordinates.latitude,
    longitude: defaultCoordinates.longitude,
  }]);

  // Handle the press event on the map to add a new marker
  const handleMapPress = (event) => {
    // Extract coordinates from the pressed event
    const { coordinate } = event.nativeEvent;

    // Create a new marker with a unique ID and coordinates
    const newMarker = {
      id: markers.length,
      coordinate: coordinate,
      title: `Marker ${markers.length}`,
    };

    // Update the state using the callback function to log the updated state
    setMarkers((prevMarkers) => {
      console.log('New Marker:', newMarker);

      // Update the path coordinates
      setPathCoordinates([...pathCoordinates, coordinate]);

      return [...prevMarkers, newMarker];
    });
  };

  // Handle the press event on a marker to show an alert
  const handleMarkerPress = (marker) => {
    // Show an alert with information about the pressed marker
    Alert.alert('Marker Pressed', `You clicked on ${marker.title}`);
    console.log('Marker Pressed', `You clicked on ${marker.title}`);
  };

  return (
    <View style={styles.container}>
      {/* MapView component */}
      <MapView
        style={styles.map}
        initialRegion={defaultCoordinates}
        onPress={handleMapPress} // Call handleMapPress function on map press
      >
        {/* Display markers on the map */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            onPress={() => handleMarkerPress(marker)} // Call handleMarkerPress function on marker press
          />
        ))}

        {/* Display polyline for the path between markers */}
        {pathCoordinates.length > 1 && (
          <Polyline
            coordinates={pathCoordinates}
            strokeWidth={2}
            strokeColor="blue"
          />
        )}
      </MapView>
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

// Export the component
export default App;