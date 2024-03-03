// DashboardPage.js
import React from 'react';
import { View, ScrollView, Text, TextInput, Button, Alert } from 'react-native';

const DashboardPage = () => {
  // Mock data for recent trips
  const recentTripsData = [
    { id: 1, tripName: 'Trip 1', distance: '30 miles' },
    { id: 2, tripName: 'Trip 2', distance: '45 miles' },
    { id: 3, tripName: 'Trip 3', distance: '20 miles' },
    { id: 4, tripName: 'Trip 4', distance: '60 miles' },
    { id: 5, tripName: 'Trip 5', distance: '15 miles' },
    { id: 6, tripName: 'Trip 6', distance: '25 miles' },
    { id: 7, tripName: 'Trip 7', distance: '50 miles' },
    { id: 8, tripName: 'Trip 8', distance: '40 miles' },
    { id: 9, tripName: 'Trip 9', distance: '35 miles' },
    { id: 10, tripName: 'Trip 10', distance: '55 miles' },
    { id: 11, tripName: 'Trip 11', distance: '22 miles' },
    // ... (add more data)
  ];

  // Mock data for charging stations
  const chargingStationsData = [
    { id: 1, name: 'Station 1', location: 'City A' },
    { id: 2, name: 'Station 2', location: 'City B' },
    { id: 3, name: 'Station 3', location: 'City C' },
    { id: 4, name: 'Station 4', location: 'City D' },
    { id: 5, name: 'Station 5', location: 'City E' },
    { id: 6, name: 'Station 6', location: 'City F' },
    { id: 7, name: 'Station 7', location: 'City G' },
    { id: 8, name: 'Station 8', location: 'City H' },
    { id: 9, name: 'Station 9', location: 'City I' },
    { id: 10, name: 'Station 10', location: 'City J' },
    { id: 11, name: 'Station 11', location: 'City K' },
    // ... (add more data)
  ];

  const handleAddStation = () => {
    // You can add the logic to handle adding a station here
    Alert.alert('Station Added', 'Station has been added.');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Recent Trips Table */}
      <ScrollView style={{ height: 200, marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Recent Trips</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
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
        </ScrollView>
      </ScrollView>

      {/* Charging Stations Table */}
      <ScrollView style={{ height: 200, marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Charging Stations</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
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
        </ScrollView>
      </ScrollView>

      {/* Line 1: Enter Label and Add Station */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <TextInput
          style={{ flex: 1, marginRight: 8, padding: 8, borderColor: 'gray', borderWidth: 1 }}
          placeholder="Enter Label"
        />
        <Button title="Add Station" onPress={handleAddStation} />
      </View>

      {/* Line 2: Enter Latitude and Enter Longitude */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextInput
          style={{ flex: 1, marginRight: 8, padding: 8, borderColor: 'gray', borderWidth: 1 }}
          placeholder="Enter Latitude"
        />
        <TextInput
          style={{ flex: 1, marginRight: 8, padding: 8, borderColor: 'gray', borderWidth: 1 }}
          placeholder="Enter Longitude"
        />
      </View>
    </View>
  );
};

export default DashboardPage;
