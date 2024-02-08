import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const App = () => {
  const [latitude, setLatitude] = useState(''); // State for latitude input
  const [longitude, setLongitude] = useState(''); // State for longitude input
  const [isMenuExpanded, setMenuExpanded] = useState(false);
  const [isCoordinatesSectionExpanded, setCoordinatesSectionExpanded] = useState(false);
  const [sourceLat, setSourceLat] = useState('');
  const [sourceLong, setSourceLong] = useState('');
  const [destLat, setDestLat] = useState('');
  const [destLong, setDestLong] = useState('');
  const [isShowPathSectionExpanded, setShowPathSectionExpanded] = useState(false);
  const [pathCoordinates, setPathCoordinates] = useState([]);

  const mapRef = React.createRef(); // Reference for the MapView component

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

  const toggleMenu = () => {
    setMenuExpanded(!isMenuExpanded);
  };

  const toggleCoordinatesSection = () => {
    setCoordinatesSectionExpanded(!isCoordinatesSectionExpanded);
  };

  const toggleShowPathSection = () => {
    setShowPathSectionExpanded(!isShowPathSectionExpanded);
  };

  const handleShowPath = () => {
    if (sourceLat && sourceLong && destLat && destLong) {
      const source = { latitude: parseFloat(sourceLat), longitude: parseFloat(sourceLong) };
      const destination = { latitude: parseFloat(destLat), longitude: parseFloat(destLong) };
      setPathCoordinates([source, destination]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Collapsible Menu */}
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Text style={styles.menuButtonText}>Menu</Text>
      </TouchableOpacity>

      {/* Expanded Menu with Additional Buttons */}
      {isMenuExpanded && (
        <View style={styles.expandedMenu}>
          {/* Button to Toggle Coordinates Section */}
          <TouchableOpacity style={styles.menuButton} onPress={toggleCoordinatesSection}>
            <Text style={styles.menuButtonText}>Set Coordinates</Text>
          </TouchableOpacity>

          {/* Button to Toggle Show Path Section */}
          <TouchableOpacity style={styles.menuButton} onPress={toggleShowPathSection}>
            <Text style={styles.menuButtonText}>Show Path</Text>
          </TouchableOpacity>

          {/* Coordinates Section */}
          {isCoordinatesSectionExpanded && (
            <View style={styles.coordinatesSection}>
              <TextInput
                style={styles.input}
                placeholder="Enter latitude"
                keyboardType="numeric"
                value={latitude}
                onChangeText={(text) => setLatitude(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter longitude"
                keyboardType="numeric"
                value={longitude}
                onChangeText={(text) => setLongitude(text)}
              />
              <Button title="Set Location" onPress={handleSetLocation} />
            </View>
          )}

          {/* Show Path Section */}
          {isShowPathSectionExpanded && (
            <View style={styles.showPathSection}>
              <TextInput
                style={styles.input}
                placeholder="Enter source latitude"
                keyboardType="numeric"
                value={sourceLat}
                onChangeText={(text) => setSourceLat(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter source longitude"
                keyboardType="numeric"
                value={sourceLong}
                onChangeText={(text) => setSourceLong(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter destination latitude"
                keyboardType="numeric"
                value={destLat}
                onChangeText={(text) => setDestLat(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter destination longitude"
                keyboardType="numeric"
                value={destLong}
                onChangeText={(text) => setDestLong(text)}
              />
              <Button title="Make Path" onPress={handleShowPath} />
            </View>
          )}
        </View>
      )}

      {/* MapView component with Markers and Polyline */}
      <MapView ref={mapRef} style={styles.map} initialRegion={{latitude: 26.8467, longitude: 80.9462, latitudeDelta: 0.0922, longitudeDelta: 0.0421}}>
        {pathCoordinates.length > 0 && (
          <Polyline coordinates={pathCoordinates} strokeColor="#FF0000" strokeWidth={2} />
        )}
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
