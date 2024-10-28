import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, useColorScheme } from 'react-native';

const SleepScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Sleep</Text>
      <TextInput
        placeholder="Hours Slept"
        placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#888'}
        style={styles.input}
        keyboardType="numeric"
      />
      <Button title="Log Sleep" />
    </View>
  );
};

const getStyles = (colorScheme: 'light' | 'dark' | null) => 
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colorScheme === 'dark' ? '#121212' : '#f9f9f9',
    },
    title: {
      color: colorScheme === 'dark' ? '#fff' : '#333',
      fontSize: 24,
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#666' : '#ccc',
      padding: 10,
      margin: 10,
      color: colorScheme === 'dark' ? '#fff' : '#333',
      backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
      width: '80%',
    },
  });

export default SleepScreen;
