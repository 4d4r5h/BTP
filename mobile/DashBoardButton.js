// DashboardButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const DashboardButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.dashboardButton} onPress={onPress}>
      <Text style={styles.dashboardButtonText}>Dashboard</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dashboardButton: {
    position: 'absolute',
    top: 16,
    backgroundColor: 'purple',
    padding: 12,
    borderRadius: 8,
  },
  dashboardButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DashboardButton;
