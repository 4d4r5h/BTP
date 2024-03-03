// DashboardButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const DashboardButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.DashboardButton} onPress={onPress}>
      <Text style={styles.DashboardButtonText}>Dashboard</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  DashboardButton: {
    position: 'absolute',
    top: 16,
    backgroundColor: 'purple',
    padding: 12,
    borderRadius: 8,
  },
  DashboardButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DashboardButton;
