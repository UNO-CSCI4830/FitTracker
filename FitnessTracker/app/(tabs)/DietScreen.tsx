import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, useColorScheme } from 'react-native';

const DietScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  
  const styles = getStyles(colorScheme);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Log Diet</Text>
      <TextInput 
        placeholder="Food Item" 
        placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#888'}
        style={styles.input} 
      />
      <TextInput 
        placeholder="Calories" 
        placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#888'}
        style={styles.input} 
        keyboardType="numeric" 
      />
      <Button title="Log Diet" />
    </View>
  );
};

const getStyles = (colorScheme: 'light' | 'dark' | null) => 
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? '#121212' : '#f9f9f9', // Dark/light background
    },
    header: {
      color: colorScheme === 'dark' ? '#fff' : '#333', // Dark/light text
      fontSize: 24,
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#666' : '#ccc', // Dark/light border color
      padding: 10,
      margin: 10,
      color: colorScheme === 'dark' ? '#fff' : '#333', // Dark/light input text color
      backgroundColor: colorScheme === 'dark' ? '#333' : '#fff', // Dark/light input background
      width: '80%',
    },
  });

export default DietScreen;
