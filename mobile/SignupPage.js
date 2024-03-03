// SignupPage.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const endpoint = 'http://10.35.13.102:3000/signup';
  const handleSignup = async () => {
    if (username.trim() !== '' && password.trim() !== '') {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    isAdmin: false,
                }),
            });

            console.log('Request sent to server!');
            const data = await response.json();
            console.log('Response from server:', data);

            if (data && Object.keys(data).length > 0) {
            // Successful signup
            Alert.alert('Signup Successful', 'Your account has been created successfully.');
            navigation.navigate('Login');
            } else {
                // Display an alert or error message for unsuccessful signup
                Alert.alert('Invalid credentials', 'Please try again.');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            Alert.alert('Signup Failed', 'An error occurred. Please try again later.');
        }
    } else {
        // Display an alert or error message for empty credentials
        Alert.alert('Invalid credentials', 'Please enter both username and password.');
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
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  signupButton: {
    backgroundColor: '#27ae60',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SignupPage;
