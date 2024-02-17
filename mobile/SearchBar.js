import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // In SearchBar.js
  const handleSearch = () => {
    // Use the callback function to ensure that searchQuery is updated before calling onSearch
    setSearchQuery((prevSearchQuery) => {
      console.log('Input Value:', prevSearchQuery); // Log the input value

      // Check if the trimmed searchQuery is not empty before calling onSearch
      if (prevSearchQuery.trim() !== '') {
        onSearch(prevSearchQuery);
      } else {
        console.warn('Empty search query. Please enter a place name.');
      }

      return prevSearchQuery;
    });
  };


  return (
    <View style={styles.searchBarContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Place"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingLeft: 10,
  },
});

export default SearchBar;
