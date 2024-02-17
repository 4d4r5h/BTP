import React, { useState, useRef } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Text, TextInput, Button, FlatList } from 'react-native';
import MapWithMarkers from './MapWithMarkers'; // Import MapWithMarkers component
import ResetButton from './ResetButton'; // Import ResetButton component
import SearchBar from './SearchBar'; // Import SearchBar component
import SearchResultList from './SearchResultList'; // Import SearchResultList component

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
    const { coordinate } = event.nativeEvent;
    const newMarker = {
      id: markers.length,
      coordinate: coordinate,
      title: `Marker ${markers.length}`,
    };

    setMarkers((prevMarkers) => {
      console.log('New Marker:', newMarker); // Log the new marker
      setPathCoordinates([...pathCoordinates, coordinate]);
      return [...prevMarkers, newMarker];
    });
  };

  // Handle the press event on a marker to show an alert
  const handleMarkerPress = (marker) => {
    Alert.alert('Marker Pressed', `You clicked on ${marker.title}`);
    console.log('Marker Pressed', `You clicked on ${marker.title}`);
  };

  // Handle the press event on the reset button
  const handleResetPress = () => {
    setMarkers([defaultMarker]);
    setPathCoordinates([
      {
        latitude: defaultCoordinates.latitude,
        longitude: defaultCoordinates.longitude,
      },
    ]);

    if (mapRef.current) {
      mapRef.current.animateToRegion(defaultCoordinates);
    }

    console.log('Reset button pressed!');
  };

  // Handle the search for a place by name
  const handleSearchPlace = async (query) => {
    // Check if there is a valid search query
    if (query.trim() !== '') {
      try {
        // Construct the API URL for geocoding with the search query
        const response = await fetch(
          `https://geocode.maps.co/search?q=${encodeURIComponent(query)}&api_key=65c44417e0aca565166909xnt731e24`
        );

        // Parse the response into JSON format
        const result = await response.json();

        // Log the raw result to the console for debugging purposes
        console.log('Raw Result:', result);

        // Check if there are results and update the state with the search results
        if (result && result.length > 0) {
          // Update the state with the search results
          setSearchResults(result);
        } else {
          // If no results are found, reset the search results state
          setSearchResults([]);
          console.error('No results found for the search query');
        }
      } catch (error) {
        // Handle any errors that occur during the fetch or parsing process
        console.error('Error searching for a place:', error);
      }
    } else {
      // Handle the case where the search query is empty
      console.warn('Empty search query. Please enter a place name.');
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

    if (mapRef.current) {
      mapRef.current.animateToRegion(newMarker.coordinate);
    }
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
      {/* MapWithMarkers component */}
      <MapWithMarkers
        markers={markers}
        pathCoordinates={pathCoordinates}
        onMapPress={handleMapPress}
        onMarkerPress={handleMarkerPress}
        initialRegion={defaultCoordinates}
        mapRef={mapRef}
      />

      {/* ResetButton component */}
      <ResetButton onReset={handleResetPress} />

      {/* SearchBar and SearchResultList components */}
      <SearchBar onSearch={handleSearchPlace} />
      <SearchResultList data={searchResults} onSelect={handleSelectPlace} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
});

export default App;
