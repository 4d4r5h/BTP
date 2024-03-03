// LoginPage.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

const LoginPage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminTab, setIsAdminTab] = useState(false);

  const handleLogin = async () => {
    if (username.trim() !== '' && password.trim() !== '') {
      try {
        const response = await fetch('http://10.35.13.102:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
            isAdmin: isAdminTab, // Set isAdmin value based on the selected tab
          }),
        });

        if (!response.ok) {
          Alert.alert('Failed to send data', `HTTP status code: ${response.status}`);
          return;
        }

        console.log('Login request sent to server!');
        const data = await response.json();
        console.log('Login response from server:', data);

        if (data) {
          if (!data.hasOwnProperty("error")) {
            // Successful login
            Alert.alert('Login Successful', 'Ready, set, go!');
            navigation.navigate('Map', { isAdmin: isAdminTab });
          } else {
            Alert.alert('Login failed', data.error.message);
          }
        } else {
          // Unsuccessful login
          Alert.alert('Something went wrong', 'Please try again.');
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

  const handleTabChange = (isAdminTab) => {
    setIsAdminTab(isAdminTab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, !isAdminTab && styles.activeTab]}
          onPress={() => handleTabChange(false)}
        >
          <Text style={styles.tabButtonText}>User</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, isAdminTab && styles.activeTab]}
          onPress={() => handleTabChange(true)}
        >
          <Text style={styles.tabButtonText}>Admin</Text>
        </TouchableOpacity>
      </View>

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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderBottomWidth: 2,
    borderBottomColor: '#fff', // Border color when inactive
  },
  activeTab: {
    backgroundColor: '#3498db',
    borderBottomColor: '#3498db', // Border color when active
  },
  tabButtonText: {
    color: '#000', // Text color when inactive
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
