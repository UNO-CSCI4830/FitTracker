import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

const ExerciseScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercise Screen</Text>
    </View>
  );
};

const getStyles = (colorScheme: 'light' | 'dark' | null) => 
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? '#121212' : '#f9f9f9',
    },
    title: {
      color: colorScheme === 'dark' ? '#fff' : '#333',
      fontSize: 24,
    },
  });

export default ExerciseScreen;
