// SignupPage.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleSignup = () => {
    // Implement your signup logic here
    // For simplicity, I'll consider a successful signup when both fields are non-empty
    if (username.trim() !== '' && password.trim() !== '') {
      // Display a pop-up message on successful signup
      Alert.alert('Signup Successful', 'Your account has been created successfully.');

      // Navigate back to the login page
      navigation.navigate('Login');
    } else {
      // Display an alert or error message for unsuccessful signup
      Alert.alert('Invalid credentials', 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default SignupPage;
