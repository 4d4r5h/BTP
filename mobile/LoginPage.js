// LoginPage.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

const LoginPage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const endpoint = 'http://10.35.13.102:3000/login';
  const handleLogin = async () => {
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
          // Successful login
          Alert.alert('Login Successful', 'Ready, set, go!');
          navigation.navigate('Map');
        } else {
          // Unsuccessful login
          Alert.alert('Invalid credentials', 'Please try again.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        Alert.alert('Login Failed', 'An error occurred. Please try again later.');
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
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupLink}>Don't have an account?</Text>
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
  loginButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  signupLink: {
    marginTop: 10,
    color: '#3498db',
    fontSize: 14,
  },
});

export default LoginPage;
