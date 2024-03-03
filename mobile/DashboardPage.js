// DashboardPage.js
import React from 'react';
import { View, ScrollView, Text, TextInput, Button, Alert } from 'react-native';

const DashboardPage = () => {
  // Mock data for recent trips
  const recentTripsData = [
    { id: 1, tripName: 'Trip 1', distance: '30 miles' },
    { id: 2, tripName: 'Trip 2', distance: '45 miles' },
    // ... (add more data)
  ];

  // Mock data for charging stations
  const chargingStationsData = [
    { id: 1, name: 'Station 1', location: 'City A' },
    { id: 2, name: 'Station 2', location: 'City B' },
    // ... (add more data)
  ];

  const handleAddStation = () => {
    // You can add the logic to handle adding a station here
    Alert.alert('Station Added', 'Station has been added.');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Recent Trips Table */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Recent Trips</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {/* Table header */}
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              <Text style={{ width: 100 }}>ID</Text>
              <Text style={{ width: 150 }}>Trip Name</Text>
              <Text style={{ width: 100 }}>Distance</Text>
            </View>

            {/* Table data */}
            {recentTripsData.map((trip) => (
              <View key={trip.id} style={{ flexDirection: 'row', marginBottom: 8 }}>
                <Text style={{ width: 100 }}>{trip.id}</Text>
                <Text style={{ width: 150 }}>{trip.tripName}</Text>
                <Text style={{ width: 100 }}>{trip.distance}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Charging Stations Table */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Charging Stations</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {/* Table header */}
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              <Text style={{ width: 100 }}>ID</Text>
              <Text style={{ width: 150 }}>Name</Text>
              <Text style={{ width: 100 }}>Location</Text>
            </View>

            {/* Table data */}
            {chargingStationsData.map((station) => (
              <View key={station.id} style={{ flexDirection: 'row', marginBottom: 8 }}>
                <Text style={{ width: 100 }}>{station.id}</Text>
                <Text style={{ width: 150 }}>{station.name}</Text>
                <Text style={{ width: 100 }}>{station.location}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Add Station Section */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={{ flex: 1, marginRight: 8, padding: 8, borderColor: 'gray', borderWidth: 1 }}
          placeholder="Enter Latitude"
        />
        <TextInput
          style={{ flex: 1, marginRight: 8, padding: 8, borderColor: 'gray', borderWidth: 1 }}
          placeholder="Enter Longitude"
        />
        <Button title="Add Station" onPress={handleAddStation} />
      </View>
    </View>
  );
};

export default DashboardPage;
