import React, { useState, useRef } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Text, TextInput, Button, FlatList } from 'react-native';
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
  const [pathCoordinates, setPathCoordinates] = useState([
    {
      latitude: defaultCoordinates.latitude,
      longitude: defaultCoordinates.longitude,
    },
  ]);

  // State for search query in the "Search Place" section
  const [searchQuery, setSearchQuery] = useState('');

  // State for search results
  const [searchResults, setSearchResults] = useState([]);

  // Reference for the MapView component
  const mapRef = useRef(null);

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

  // Handle the press event on the reset button
  const handleResetPress = () => {
    // Reset the markers and path coordinates to the initial state
    setMarkers([defaultMarker]);
    setPathCoordinates([
      {
        latitude: defaultCoordinates.latitude,
        longitude: defaultCoordinates.longitude,
      },
    ]);
    mapRef.current.animateToRegion(defaultCoordinates);
    console.log('Reset button pressed!');
  };

  // Handle the search for a place by name
  const handleSearchPlace = async () => {
    if (searchQuery) {
      try {
        const response = await fetch(
          `https://geocode.maps.co/search?q=${encodeURIComponent(searchQuery)}&api_key=65c44417e0aca565166909xnt731e24`
        );
        const result = await response.json();

        console.log('Results:', result);

        if (result && result.length > 0) {
          setSearchResults(result);
        } else {
          setSearchResults([]);
          // Handle case where no results are found
          console.error('No results found for the search query');
        }
      } catch (error) {
        console.error('Error searching for a place:', error);
      }
    }
  };

  // Handle selecting a place from the search results
  const handleSelectPlace = (place) => {
    const newMarker = {
      id: markers.length,
      coordinate: {
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
      },
      title: place.display_name,
    };

    setMarkers([...markers, newMarker]);
    setPathCoordinates([...pathCoordinates, newMarker.coordinate]);
    setSearchResults([]);
    mapRef.current.animateToRegion(newMarker.coordinate);
  };

  // Render function for the search results flat list
  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handleSelectPlace(item)}
    >
      <Text>{item.display_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* MapView component */}
      <MapView
        ref={mapRef}
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

      {/* Reset button */}
      <TouchableOpacity style={styles.resetButton} onPress={handleResetPress}>
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>

      {/* Search Bar and Button */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Place"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <Button title="Search" onPress={handleSearchPlace} />
      </View>

      {/* FlatList to Display Search Results */}
      <FlatList
        data={searchResults}
        renderItem={renderSearchResult}
        keyExtractor={(item) => item.place_id}
        style={styles.searchResultsList}
      />
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
  resetButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingLeft: 10,
  },
  searchResultsList: {
    marginTop: 10,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
});

export default App;
