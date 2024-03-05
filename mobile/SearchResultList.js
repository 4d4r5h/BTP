// SearchResultList.js
import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';

// Component to display a list of search results
const SearchResultList = ({ data, onSelect }) => {
  // Render function for each search result item
  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => onSelect(item)}
    >
      <Text>{item.display_name}</Text>
    </TouchableOpacity>
  );

  // Return the SearchResultList component structure
  return (
    <FlatList
      data={data}
      renderItem={renderSearchResult}
      keyExtractor={(item) => item.place_id}
      style={styles.searchResultsList}
    />
  );
};

// Stylesheet for the SearchResultList component
const styles = StyleSheet.create({
  searchResultsList: {
    marginTop: 10,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
});

// Export the SearchResultList component
export default SearchResultList;
