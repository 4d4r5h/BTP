import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const App = () => {
  // State for latitude and longitude in the "Set Coordinates" section
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // States for controlling the visibility of different sections in the menu
  const [isMenuExpanded, setMenuExpanded] = useState(false);
  const [isCoordinatesSectionExpanded, setCoordinatesSectionExpanded] = useState(false);
  const [isShowPathSectionExpanded, setShowPathSectionExpanded] = useState(false);

  // States for input values in the "Show Path" section
  const [sourceLatitude, setSourceLatitude] = useState('');
  const [sourceLongitude, setSourceLongitude] = useState('');
  const [destLatitude, setDestLatitude] = useState('');
  const [destLongitude, setDestLongitude] = useState('');

  // State for storing the coordinates to draw a polyline in the map
  const [pathCoordinates, setPathCoordinates] = useState([]);

  // Reference for the MapView component
  const mapRef = React.createRef();

  // Function to handle setting the location on the map based on entered latitude and longitude
  const handleSetLocation = () => {
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const long = parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(long)) {
        mapRef.current.animateToRegion({
          latitude: lat,
          longitude: long,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    }
  };

  // Function to toggle the visibility of the menu
  const toggleMenu = () => {
    setMenuExpanded(!isMenuExpanded);
    setCoordinatesSectionExpanded(false);
    setShowPathSectionExpanded(false);
  };

  // Function to toggle the visibility of the "Set Coordinates" section
  const toggleCoordinatesSection = () => {
    setCoordinatesSectionExpanded(!isCoordinatesSectionExpanded);
    setShowPathSectionExpanded(false);
  };

  // Function to toggle the visibility of the "Show Path" section
  const toggleShowPathSection = () => {
    setShowPathSectionExpanded(!isShowPathSectionExpanded);
    setCoordinatesSectionExpanded(false);
  };

  // Function to handle showing the path on the map based on entered source and destination coordinates
  const handleShowPath = () => {
    if (sourceLatitude && sourceLongitude && destLatitude && destLongitude) {
      const source = { latitude: parseFloat(sourceLatitude), longitude: parseFloat(sourceLongitude) };
      const destination = { latitude: parseFloat(destLatitude), longitude: parseFloat(destLongitude) };
      setPathCoordinates([source, destination]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Button to Toggle the Menu */}
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Text style={styles.menuButtonText}>Menu</Text>
      </TouchableOpacity>

      {/* Expanded Menu with Additional Buttons */}
      {isMenuExpanded && (
        <View style={styles.expandedMenu}>
          {/* Button to Toggle "Set Coordinates" Section */}
          <TouchableOpacity style={styles.menuButton} onPress={toggleCoordinatesSection}>
            <Text style={styles.menuButtonText}>Set Coordinates</Text>
          </TouchableOpacity>

          {/* Button to Toggle "Show Path" Section */}
          <TouchableOpacity style={styles.menuButton} onPress={toggleShowPathSection}>
            <Text style={styles.menuButtonText}>Show Path</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* "Set Coordinates" Section */}
      {isCoordinatesSectionExpanded && (
        <View style={styles.coordinatesSection}>
          {/* Latitude and Longitude Inputs in the Same Line */}
          <View style={styles.fullInputContainer}>
            <TextInput
              style={styles.fullInput}
              placeholder="Enter latitude"
              keyboardType="numeric"
              value={latitude}
              onChangeText={(text) => setLatitude(text)}
            />
            <TextInput
              style={styles.fullInput}
              placeholder="Enter longitude"
              keyboardType="numeric"
              value={longitude}
              onChangeText={(text) => setLongitude(text)}
            />
          </View>
          {/* Button to Set Location */}
          <Button title="Set Location" onPress={handleSetLocation} />
        </View>
      )}

      {/* "Show Path" Section */}
      {isShowPathSectionExpanded && (
        <View style={styles.showPathSection}>
          {/* Source and Destination Inputs in the Same Line */}
          <View style={styles.fullInputContainer}>
            <TextInput
              style={styles.fullInput}
              placeholder="Source Latitude"
              keyboardType="numeric"
              value={sourceLatitude}
              onChangeText={(text) => setSourceLatitude(text)}
            />
            <TextInput
              style={styles.fullInput}
              placeholder="Source Longitude"
              keyboardType="numeric"
              value={sourceLongitude}
              onChangeText={(text) => setSourceLongitude(text)}
            />
          </View>
          <View style={styles.fullInputContainer}>
            <TextInput
              style={styles.fullInput}
              placeholder="Dest Latitude"
              keyboardType="numeric"
              value={destLatitude}
              onChangeText={(text) => setDestLatitude(text)}
            />
            <TextInput
              style={styles.fullInput}
              placeholder="Dest Longitude"
              keyboardType="numeric"
              value={destLongitude}
              onChangeText={(text) => setDestLongitude(text)}
            />
          </View>
          {/* Button to Make Path */}
          <Button title="Make Path" onPress={handleShowPath} />
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
      >
        {/* Polyline to Show Path */}
        {pathCoordinates.length > 0 && (
          <Polyline coordinates={pathCoordinates} strokeWidth={2} strokeColor="red" />
        )}
        {/* Markers for Path Coordinates */}
        {pathCoordinates.map((coordinate, index) => (
          <Marker key={index} coordinate={coordinate} title={`Marker ${index + 1}`} />
        ))}
      </MapView>
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
  fullInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fullInput: {
    height: 40,
    borderColor: 'lightgreen',
    borderWidth: 1,
    paddingLeft: 10,
    flex: 1, // Adjusted size for equal spacing
    marginRight: 10, // Spacing between input boxes
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
  expandedMenu: {
    backgroundColor: 'white',
    padding: 10,
  },
  coordinatesSection: {
    marginTop: 10,
  },
  showPathSection: {
    marginTop: 10,
  },
});

export default App;
