// MapWithMarkers.js
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const MapWithMarkers = ({ markers, pathCoordinates, responseStations = [], allStations = [], onMapPress, onMarkerPress, onMarkerDragEnd, initialRegion, mapRef }) => {
  // Introduce state to manage charging stations
  const [chargingStations, setChargingStations] = useState([]);

  // Update chargingStations when allStations changes
  useEffect(() => {
    setChargingStations(allStations);
  }, [allStations]);

  console.log('List of all charging stations on Map:', chargingStations);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        onPress={onMapPress}
      >
        {/* Display markers on the map */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            draggable={true}
            onDragEnd={(e) => onMarkerDragEnd(marker, e.nativeEvent.coordinate)}
            onPress={() => onMarkerPress(marker)}
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

        {/* Display blue markers for response stations */}
        {responseStations.map((station, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: station.latitude, longitude: station.longitude }}
            title={`Charging Station ${index + 1}`}
            pinColor="blue"
          />
        ))}

        {/* Display yellow labels for all charging stations */}
        {chargingStations.map((station, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: station.location.latitude, longitude: station.location.longitude }}
            title={station.label}
            pinColor="blue"
          />
        ))}
      </MapView>
    </View>
  );
};

export default MapWithMarkers;
