import React, { useRef } from 'react';
import { View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const MapWithMarkers = ({ markers, pathCoordinates, onMapPress, onMarkerPress, initialRegion, mapRef }) => {
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
      </MapView>
    </View>
  );
};

export default MapWithMarkers;
