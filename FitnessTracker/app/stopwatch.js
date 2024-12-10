import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';

const Stopwatch = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const colorScheme = useColorScheme(); // Detect system color scheme
  const styles = getStyles(colorScheme);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const secs = time % 60;
    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stopwatch</Text>
      <View style={styles.logEntriesContainer}>
        <Text style={styles.totalMinutesText}>{formatTime(seconds)}</Text>
      </View>
      <View style={styles.inputGroup}>
        <TouchableOpacity
          onPress={() => setIsRunning((prev) => !prev)}
          style={[
            styles.actionButton,
            { backgroundColor: isRunning ? '#d9534f' : '#5cb85c' },
          ]}
        >
          <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSeconds(0)} style={[styles.actionButton, { backgroundColor: '#5bc0de' }]}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Dynamic styles based on provided color values
const getStyles = (colorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? '#121212' : '#ffffff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: colorScheme === 'dark' ? '#ffffff' : '#000000',
    },
    logEntriesContainer: {
      marginTop: 20,
      width: '80%',
      alignSelf: 'center',
    },
    totalMinutesText: {
      fontSize: 36,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? 'white' : 'black',
      textAlign: 'center',
    },
    inputGroup: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
      width: '80%',
    },
    actionButton: {
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#555' : '#ccc',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
  });

export default Stopwatch;
