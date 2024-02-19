import React, { useState, useRef } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Text, TextInput, Button, FlatList } from 'react-native';
import MapWithMarkers from './MapWithMarkers'; // Import MapWithMarkers component
import ResetButton from './ResetButton'; // Import ResetButton component
import SearchBar from './SearchBar'; // Import SearchBar component
import SearchResultList from './SearchResultList'; // Import SearchResultList component
import StartButton from './StartButton'; // Import StartButton component
import { sendDataToEndpoint } from './sendDataToEndpoint'; // Import sendDataToEndpoint function

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

  // State for search results
  const [searchResults, setSearchResults] = useState([]);

  // State to control the visibility of the search results area
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Reference for the MapView component
  const mapRef = useRef(null);

  // Handle the press event on the map to add a new marker
  const handleMapPress = async (event) => {
    try {
      // Extracting the coordinate from the event
      const { coordinate } = event.nativeEvent;
  
      // Prepare data to be sent to the server
      const requestData = {
        waypoints: [...pathCoordinates, coordinate],
        initialBatteryCharge: 1200,
        fullBatteryChargeCapacity: 5000,
        dischargingRate: 0.3,
        chargingRate: 13,
        chargingStations: [{
          latitude: 25.54,
          longitude: 84.84,
        }],
      };
  
      const endpoint = 'http://10.35.13.102:3000/api';
  
      // Use a temporary variable to store the response
      let response;
  
      try {
        // Call the function to send data to the endpoint
        response = await sendDataToEndpoint(requestData, endpoint);
      } catch (error) {
        // Handle errors that may occur during the data sending process
        console.error('Error in sendDataToEndpoint:', error);
        throw new Error('Error in sendDataToEndpoint');
      }
  
      // Ensure that 'path' property exists in the response
      if (response && response.path !== undefined) {
        // Extract the 'path' property from the response
        const responsePath = response.path;
        console.log('Response path:', responsePath);
  
        // Update the markers and pathCoordinates
        setMarkers((prevMarkers) => {
          const newMarker = {
            id: prevMarkers.length,
            coordinate: coordinate,
            title: `Marker ${prevMarkers.length}`,
          };
  
          console.log('New Marker:', newMarker);
          setPathCoordinates(responsePath);
          return [...prevMarkers, newMarker];
        });
      } else {
        // Handle the case where the response is invalid or missing the 'path' property
        console.error('Invalid response format.');
      }
    } catch (error) {
      // Handle unexpected errors during the map press handling
      console.error('Error in handleMapPress:', error);
    }
  };

  // Handle the press event on a marker to show an alert
  const handleMarkerPress = (marker) => {
    Alert.alert('Marker Pressed', `You clicked on ${marker.title}`);
    console.log('Marker Pressed', `You clicked on ${marker.title}`);
  };

  // Handle the drag end event on a marker
  const handleMarkerDragEnd = (marker, newCoordinate) => {
    // Find the index of the dragged marker in the markers array
    const markerIndex = markers.findIndex((m) => m.id === marker.id);

    // Update the marker's position
    setMarkers((prevMarkers) => {
      const updatedMarkers = [...prevMarkers];
      updatedMarkers[markerIndex] = {
        ...marker,
        coordinate: newCoordinate,
      };
      return updatedMarkers;
    });

    // Update the pathCoordinates if needed
    setPathCoordinates((prevPathCoordinates) => {
      const updatedPathCoordinates = [...prevPathCoordinates];
      updatedPathCoordinates[markerIndex] = newCoordinate;
      return updatedPathCoordinates;
    });

    // Sending request to web server after marker drag
    const waypoints = pathCoordinates;
    const requestData = {
      waypoints,
      initialBatteryCharge: 1200,
      fullBatteryChargeCapacity: 5000,
      dischargingRate: 0.3,
      chargingRate: 13,
      chargingStations: [{
        latitude: 25.54,
        longitude: 84.84,
      }],
    };

    const endpoint = 'http://10.35.13.102:3000/api';

    // Call the function to send data to the endpoint
    sendDataToEndpoint(requestData, endpoint);
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

    // Hide the search results area
    setShowSearchResults(false);

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
          // Show the search results area
          setShowSearchResults(true);

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

    // Hide the search results area after selecting a place
    setShowSearchResults(false);

    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: newMarker.coordinate.latitude,
        longitude: newMarker.coordinate.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }

    // Sending request to web server
    const waypoints = [...pathCoordinates, newMarker.coordinate];
    const requestData = {
      waypoints,
      initialBatteryCharge: 1200,
      fullBatteryChargeCapacity: 5000,
      dischargingRate: 0.3,
      chargingRate: 13,
      chargingStations: [{
        latitude: 25.54,
        longitude: 84.84,
      }],
    };

    const endpoint = 'http://10.35.13.102:3000/api';

    // Call the function to send data to the endpoint
    sendDataToEndpoint(requestData, endpoint);
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
        onMarkerDragEnd={handleMarkerDragEnd} // Pass the handleMarkerDragEnd function
        initialRegion={defaultCoordinates}
        mapRef={mapRef}
      />

      {/* ResetButton component */}
      <ResetButton onReset={handleResetPress} />

      {/* StartButton component */}
      <StartButton markers={markers} />

      {/* SearchBar and SearchResultList components */}
      <SearchBar onSearch={handleSearchPlace} />

      {/* Conditional rendering of SearchResultList based on showSearchResults state */}
      {showSearchResults && (
        <SearchResultList data={searchResults} onSelect={handleSelectPlace} />
      )}
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
