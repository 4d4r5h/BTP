// StartButton.js
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';

const StartButton = ({ markers, onStartPress }) => {
  const handleStartPress = () => {
    if (markers.length > 1) {
      // If there are more than 1 markers, log "Journey started"
      console.log('Journey started');
      Alert.alert('Trip started.', 'Have a safe journey!');
    } else {
      // If there is only 1 marker, show an alert
      Alert.alert('Missing destination', 'Please select your destination first!');
    }
  };

  return (
    <TouchableOpacity style={styles.startButton} onPress={handleStartPress}>
      <Text style={styles.startButtonText}>Start</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  startButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'green', // Change color as needed
    padding: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default StartButton;
