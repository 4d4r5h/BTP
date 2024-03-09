// MapPage.js
import React, { useState, useRef } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Text, TextInput, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapWithMarkers from './MapWithMarkers';
import ResetButton from './ResetButton';
import SearchBar from './SearchBar';
import SearchResultList from './SearchResultList';
import StartButton from './StartButton';
import EndButton from './EndButton';
import { sendDataToEndpoint } from './sendDataToEndpoint';
import DashboardButton from './DashboardButton';

const defaultBatteryCharge = 10000;

const MapPage = () => {
  const navigation = useNavigation(); // Use useNavigation hook to get navigation object
  const route = useRoute();

  // State to manage whether the user is logged in as an admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [inputBatteryCharge, setInputBatteryCharge] = useState('');
  const [initialBatteryCharge, setInitialBatteryCharge] = useState(defaultBatteryCharge);  
  const [tripID, setTripID] = useState('');

  React.useEffect(() => {
    // Access the isAdmin value from the route parameter
    const { params } = route;
    if (params && params.username !== undefined && params.isAdmin !== undefined) {
      setUsername(params.username);
      setIsAdmin(params.isAdmin);
    }
  }, [route]);

  // useEffect to fetch charging stations when the component mounts
  React.useEffect(() => {
    fetchChargingStations();
  }, []); // Empty dependency array means this effect runs once when the component mounts

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

  // State to manage charging stations on the map
  const [responseStations, setResponseStations] = useState([]);
  const [allStations, setAllStations] = useState([]);

  // State to manage the way points
  const [wayPoints, setWayPoints] = useState([
    {
      latitude: defaultCoordinates.latitude,
      longitude: defaultCoordinates.longitude,
    },
  ]);

  // State to manage the path coordinates shown on map
  const [pathCoordinates, setPathCoordinates] = useState([]);

  // State for search results
  const [searchResults, setSearchResults] = useState([]);

  // State to control the visibility of the search results area
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Reference for the MapView component
  const mapRef = useRef(null);

  // Handler for changing the input battery charge
  const handleInputBatteryChargeChange = (text) => {
    setInputBatteryCharge(text);
  };

  // Handler for setting the initial battery charge
  const handleSetInitialBatteryCharge = () => {
    const parsedInput = parseInt(inputBatteryCharge, 10);
    if (!isNaN(parsedInput) && parsedInput >= 0 && parsedInput <= 100) {
      setInitialBatteryCharge(parsedInput * defaultBatteryCharge / 100.0);
      console.log('Initial Battery Charge:', initialBatteryCharge)
    } else {
      Alert.alert('Invalid Input', 'Please enter a valid non-negative number.');
    }
  };

  const fetchChargingStations = async () => {
    try {
      // Make a GET request to the /show_stations endpoint
      const response = await fetch('http://10.35.13.102:3000/show_stations');
      
      // Check if the response status is OK (200)
      if (response.ok) {
        // Parse the JSON response
        const stations = await response.json();

        // Update the allStations state
        setAllStations(stations);

        // Return the formatted stations data
        return stations;
      } else {
        // Handle non-OK response status
        console.error('Error fetching charging stations:', response.statusText);
        throw new Error('Error fetching charging stations');
      }
    } catch (error) {
      // Handle errors that may occur during the fetch or parsing process
      console.error('Error fetching charging stations:', error);
      throw new Error('Error fetching charging stations');
    }
  };

  const fetchRecentTrips = async () => {
    try {
      // Make a GET request to the /show_stations endpoint
      const response = await fetch('http://10.35.13.102:3000/show_trips');
      
      // Check if the response status is OK (200)
      if (response.ok) {
        // Parse the JSON response
        const trips = await response.json();

        // Return the formatted stations data
        return trips;
      } else {
        // Handle non-OK response status
        console.error('Error fetching recent trips:', response.statusText);
        throw new Error('Error fetching recent trips');
      }
    } catch (error) {
      // Handle errors that may occur during the fetch or parsing process
      console.error('Error fetching recent trips:', error);
      throw new Error('Error fetching recent trips');
    }
  };

  
  // Handle the press event on the map to add a new marker
  const handleMapPress = async (event) => {
    try {
      // Extracting the coordinate from the event
      const { coordinate } = event.nativeEvent;

      // Update the markers and pathCoordinates
      setMarkers((prevMarkers) => {
        const newMarker = {
          id: prevMarkers.length,
          coordinate: coordinate,
          title: `Marker ${prevMarkers.length}`,
        };
        console.log('New Marker in Map Press:', newMarker);
        return [...prevMarkers, newMarker];
      });

      setWayPoints([...wayPoints, coordinate]);
      // Prepare data to be sent to the server
      const requestData = {
        waypoints: [...wayPoints, coordinate],
        initialBatteryCharge: initialBatteryCharge,
      };
  
      // Use a temporary variable to store the response
      let response;
  
      try {
        // Call the function to send data to the endpoint
        response = await sendDataToEndpoint(requestData);
      } catch (error) {
        // Handle errors that may occur during the data sending process
        console.error('Error in sendDataToEndpoint:', error);
        throw new Error('Error in sendDataToEndpoint');
      }

      // Ensure that 'stations' property exists in the response
    if (response && response.stations !== undefined) {
      // Extract the 'stations' property from the response
      const stations = response.stations;
      console.log('Response stations in Map Press:', stations);

      // Update the state with response stations
      setResponseStations(stations);

      // Move the map to the first station
      if (stations.length > 0 && mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: stations[0].latitude,
          longitude: stations[0].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        // Handle the case where the response is invalid
        console.log('No charging stations on path.');
      }
    }
  
      // Ensure that 'path' property exists in the response
      if (response && response.path !== undefined) {
        // Extract the 'path' property from the response
        const responsePath = response.path;
        console.log('Response path in Map Press:', responsePath);

        setPathCoordinates(responsePath);
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
  const handleMarkerDragEnd = async (marker, newCoordinate) => {
    try {
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

      console.log('Earlier Waypoints:', wayPoints);

      // Update the wayPoints
      let updatedWayPoints = [...wayPoints];
      updatedWayPoints[markerIndex] = newCoordinate;
      setWayPoints((prevWayPoints) => {
        return updatedWayPoints;
      })

      console.log('Updated Waypoints:', updatedWayPoints);

      // Sending request to web server after marker drag
      const requestData = {
        waypoints: updatedWayPoints,
        initialBatteryCharge: initialBatteryCharge,
      };

      let response;
      try {
        // Call the function to send data to the endpoint
        response = await sendDataToEndpoint(requestData);
      } catch (error) {
        // Handle errors that may occur during the data sending process
        console.error('Error in sendDataToEndpoint:', error);
        throw new Error('Error in sendDataToEndpoint');
      }

      // Ensure that 'path' property exists in the response
      if (response && response.path !== undefined) {
        // Extract the 'path' property from the response
        const responsePath = response.path;
        console.log('Response path in Marker Drag:', responsePath);

        setPathCoordinates(responsePath);
      } else {
        // Handle the case where the response is invalid or missing the 'path' property
        console.error('Invalid response format.');
      }
    } catch (error) {
      // Handle unexpected errors during the marker drag handling
      console.error('Error in handleMarkerDragEnd:', error);
    }
  };

  // Handle the press event on the "Start" button
  const handleStartPress = async () => {
    try {
      // Check if there are at least two waypoints
      if (wayPoints.length < 2) {
        console.warn('Insufficient waypoints to start the journey.');
        return;
      }

      // Construct the request payload
      const requestData = {
        username: username,
        startLocation: wayPoints[0],
        endLocation: wayPoints[wayPoints.length - 1],
        chargingStations: responseStations,
      };

      console.log('Start journey request data:', requestData);
      const endpoint = 'http://10.35.13.102:3000/start_trip';

      // Use a temporary variable to store the response
      let response;

      try {
        // Call the function to send data to the endpoint
        const fetchResponse = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        response = await fetchResponse.json();
        console.log('Start journey response from server:', response);
        if(response.id) {
          setTripID(response.id);
        }
      } catch (error) {
        // Handle errors that may occur during the data sending process
        console.error('Error in sending data to endpoint:', error);
        throw new Error('Error in sending data to endpoint');
      }

      // Check if there is no 'error' field in the response
      if (response && !response.error) {
        // No error, journey started successfully
        Alert.alert('Journey started', 'Have a safe journey!');
      } else {
        // Handle the case where the server returns an error
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      // Handle unexpected errors during the start journey process
      console.error('Error in handleStartPress:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  // Handle the press event on the "End" button
  const handleEndPress = async () => {
    try {
      // Construct the request payload
      const endRequestData = {
        id: tripID,
      };

      // Define the endpoint for ending the trip
      const endEndpoint = 'http://10.35.13.102:3000/end_trip';

      // Use a temporary variable to store the end trip response
      let endResponse;

      try {
        // Send a POST request to the end_trip endpoint
        const endFetchResponse = await fetch(endEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(endRequestData),
        });

        // Parse the response into JSON format
        endResponse = await endFetchResponse.json();
        console.log('End journey response from server:', endResponse);
      } catch (error) {
        // Handle errors that may occur during the data sending process
        console.error('Error in sending data to endpoint:', error);
        throw new Error('Error in sending data to endpoint');
      }

      // Check if there is 'isCompleted' field in the response and it is true
      if (endResponse && endResponse.isCompleted) {
        // Journey ended successfully
        Alert.alert('Journey ended', 'Hope you had a great trip!');
        
        // Reset tripID to blank
        setTripID('');
      } else {
        // Handle the case where the server returns an error or isCompleted is not true
        Alert.alert('Error', 'Error in ending trip. Please try again.');
      }
    } catch (error) {
      // Handle unexpected errors during the end journey process
      console.error('Error in handleEndPress:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  // Handle the press event on the reset button
  const handleResetPress = () => {
    setMarkers([defaultMarker]);
    setPathCoordinates([]);
    setResponseStations([]);
    setWayPoints([
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

  // Handle the press event on the Dashboard button
  const handleDashboardPress = () => {
    // Show an alert when the Dashboard button is pressed
    Alert.alert('Welcome to the Dashboard', 'You have access to admin features.');
    // Navigate to the 'Dashboard' screen
    navigation.navigate('Dashboard');
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
  const handleSelectPlace = async (place) => {
    try {
    const newMarker = {
        id: markers.length,
        coordinate: {
          latitude: parseFloat(place.lat),
          longitude: parseFloat(place.lon),
        },
        title: place.display_name,
      };

      setMarkers([...markers, newMarker]);

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

      setWayPoints([...wayPoints, newMarker.coordinate]);
      // Sending request to web server
      const requestData = {
        waypoints: [...wayPoints, newMarker.coordinate],
        initialBatteryCharge: initialBatteryCharge,
      };

      let response;
      try {
        // Call the function to send data to the endpoint
        response = await sendDataToEndpoint(requestData);
      } catch (error) {
        // Handle errors that may occur during the data sending process
        console.error('Error in sendDataToEndpoint:', error);
        throw new Error('Error in sendDataToEndpoint');
      }

      // Ensure that 'path' property exists in the response
      if (response && response.path !== undefined) {
        // Extract the 'path' property from the response
        const responsePath = response.path;
        console.log('Response path in Select Place:', responsePath);

        setPathCoordinates(responsePath);
      } else {
        // Handle the case where the response is invalid or missing the 'path' property
        console.error('Invalid response format.');
      }
    } catch (error) {
      // Handle unexpected errors during the select place handling
      console.error('Error in handleSelectPlace:', error);
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

  // Conditionally render StartButton or EndButton based on tripID
  const renderActionButton = () => {
    if (tripID !== '') {
      // Render EndButton if tripID is not blank
      return <EndButton tripID={tripID} onEndPress={handleEndPress} />;
    } else {
      // Render StartButton if tripID is blank
      return <StartButton markers={markers} onStartPress={handleStartPress} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Input for initial battery charge */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Initial Battery Percentage"
          keyboardType="numeric"
          onChangeText={handleInputBatteryChargeChange}
        />
        <Button title="Set" onPress={handleSetInitialBatteryCharge} />
      </View>
      
      {/* MapWithMarkers component */}
      <MapWithMarkers
        markers={markers}
        pathCoordinates={pathCoordinates}
        onMapPress={handleMapPress}
        responseStations={responseStations}
        allStations={allStations}
        onMarkerPress={handleMarkerPress}
        onMarkerDragEnd={handleMarkerDragEnd}
        initialRegion={defaultCoordinates}
        mapRef={mapRef}
      />

      {/* Wrapper view for top center alignment */}
      <View style={styles.topCenterWrapper}>
        {/* Dashboard button */}
        {isAdmin && <DashboardButton onPress={handleDashboardPress} />}

        {/* Conditionally render StartButton or EndButton */}
        {renderActionButton()}

        {/* ResetButton component */}
        <ResetButton onReset={handleResetPress} />
      </View>

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
    paddingTop: '17.5%',
    // NOTE: padding 70 units works for my screen
  },
  topCenterWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingVertical: 5,
  },
});

export default MapPage;
