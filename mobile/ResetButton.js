import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ResetButton = ({ onReset }) => {
  return (
    <TouchableOpacity style={styles.resetButton} onPress={onReset}>
      <Text style={styles.resetButtonText}>Reset</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  resetButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ResetButton;
