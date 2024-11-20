import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, Text, Platform } from 'react-native';
import { Pedometer } from 'expo-sensors'; // Import Pedometer from expo-sensors
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function FitnessTrackerScreen() {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0.0);
  const [calories, setCalories] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const startTracking = async () => {
      setIsLoading(true);
      try {
        if (await Pedometer.isAvailableAsync()) {
          const subscription = await Pedometer.watchStepCount(result => {
            setSteps(result.steps);
            // Calculate distance and calories based on steps (adjust as needed)
            setDistance(result.steps * 0.0007); // Adjust the factor based on stride length
            setCalories(0); // Will include Users total calories based on their inputed calories
          });

          return () => subscription.remove();
        } else {
          setError('Step count is not available on this device');
        }
      } catch (error) {
        setError('Error tracking steps: ' + error);
      } finally {
        setIsLoading(false);
      }
    };

    startTracking();
  }, []);

  return (
    <ThemedView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={<Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo} />}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Fitness Tracker</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statsContainer}>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text>{error}</Text>
          ) : (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Steps</Text>
                <Text style={styles.statValue}>{steps}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Distance</Text>
                <Text style={styles.statValue}>{distance.toFixed(2)} km</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Calories</Text>
                <Text style={styles.statValue}>{calories.toFixed(0)}</Text>
              </View>
            </>
          )}
        </ThemedView>
        <ThemedView style={styles.actionContainer}>
          <Text style={styles.actionButton}>Track Activity</Text>
        </ThemedView>
      </ParallaxScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statsContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 16,
  },
  actionContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#333',
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});