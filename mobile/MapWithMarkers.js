// MapWithMarkers.js
import React from 'react';
import { View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const MapWithMarkers = ({ markers, pathCoordinates, responseStations = [], onMapPress, onMarkerPress, onMarkerDragEnd, initialRegion, mapRef }) => {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        onPress={onMapPress} // Call onMapPress function on map press
      >
        {/* Display markers on the map */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            draggable={true} // Set draggable to true
            onDragEnd={(e) => onMarkerDragEnd(marker, e.nativeEvent.coordinate)} // Handle drag end event
            onPress={() => onMarkerPress(marker)} // Call onMarkerPress function on marker press
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
      </MapView>
    </View>
  );
};

export default MapWithMarkers;
