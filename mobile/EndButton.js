// EndButton.js
import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';

const EndButton = ({ tripID, onEndPress }) => {
  const handleEndPress = async () => {
    // Add any additional logic you need for handling the end press
    // Call the onEndPress function passed from the parent component (MapPage)
    onEndPress();
  };

  return (
    <TouchableOpacity style={styles.endButton} onPress={handleEndPress}>
      <Text style={styles.endButtonText}>End</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  endButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'red', // Change color as needed
    padding: 12,
    borderRadius: 8,
  },
  endButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EndButton;
