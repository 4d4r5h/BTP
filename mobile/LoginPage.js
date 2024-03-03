// LoginPage.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';

const LoginPage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implement your authentication logic here
    // For simplicity, I'll consider a successful login when both fields are non-empty
    if (username.trim() !== '' && password.trim() !== '') {
      Alert.alert('Login Successful', 'Ready, set, go!');
      // Navigate to the MapPage on successful login
      navigation.navigate('Map');
    } else {
      // Display an alert or error message for unsuccessful login
      Alert.alert('Invalid credentials', 'Please try again.');
    }
  };

  const handleSignupLinkPress = () => {
    // Navigate to the Signup page
    navigation.navigate('Signup');
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
      <Button title="Login" onPress={handleLogin} />

      {/* "Don't have an account?" hyperlink */}
      <TouchableOpacity onPress={handleSignupLinkPress}>
        <Text style={styles.signupLink}>Don't have an account?</Text>
      </TouchableOpacity>
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
  signupLink: {
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default LoginPage;
