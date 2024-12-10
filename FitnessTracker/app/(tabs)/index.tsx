import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, Text, Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { useColorScheme } from 'react-native';
import * as Notifications from 'expo-notifications';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import Stopwatch from '../stopwatch';
import { db } from '../../firebaseConfig';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { useUser } from './userContext';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function FitnessTrackerScreen() {
  const colorScheme = useColorScheme();
  const { user } = useUser();

  const getGreeting = (): string => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0.0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [calories, setCalories] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Request permissions (Notifications and Pedometer)
    const requestPermissions = async () => {
      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
      if (notificationStatus !== 'granted') {
        console.log('Notification permissions not granted!');
      }

      const { status: pedometerStatus } = await Pedometer.requestPermissionsAsync();
      if (pedometerStatus !== 'granted') {
        console.log('Pedometer permissions not granted!');
      }
    };

    requestPermissions();
  }, []);

  const fetchExerciseGoalFromFirestore = async () => {
    try {
      if (user?.uid) {
        const exerciseGoalsCollection = collection(db, 'exerciseGoals');
        const goalDocRef = doc(exerciseGoalsCollection, user.uid);
        const goalDoc = await getDoc(goalDocRef);

        if (goalDoc.exists()) {
          return goalDoc.data().goal;
        } else {
          console.log('No exercise goal found!');
          return 0;
        }
      }
    } catch (error) {
      console.error('Error fetching exercise goal:', error);
      return 0;
    }
  };

  const fetchTotalMinutesFromFirestore = async () => {
    try {
      if (user?.uid) {
        const today = new Date().toDateString();
        const exerciseLogsCollection = collection(db, 'exerciseLog');
        const q = query(exerciseLogsCollection, where('uid', '==', user.uid), where('date', '==', today));
        const querySnapshot = await getDocs(q);

        let totalMinutes = 0;
        querySnapshot.forEach((doc) => {
          totalMinutes += doc.data().minutes;
        });

        return totalMinutes;
      }
    } catch (error) {
      console.error('Error fetching total minutes:', error);
      return 0;
    }
  };

  const checkAndSendNotification = async () => {
    const exerciseGoal = await fetchExerciseGoalFromFirestore();
    const totalMinutes = await fetchTotalMinutesFromFirestore();

    const exerciseGoalMet = totalMinutes >= exerciseGoal;

    if (!exerciseGoalMet) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Reminder: Don't forget your fitness goals!",
          body: "You haven't met your exercise goal for today.",
        },
        trigger: {
          hour: 21,
          minute: 0,
        },
      });
    }
  };

  useEffect(() => {
    const checkGoalsTimeout = setTimeout(() => {
      checkAndSendNotification();
    }, calculateTimeUntil9PM());

    return () => clearTimeout(checkGoalsTimeout);
  }, []);

  const calculateTimeUntil9PM = () => {
    const now = new Date();
    const ninePM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 0, 0);
    if (now > ninePM) {
      ninePM.setDate(ninePM.getDate() + 1);
    }
    return ninePM.getTime() - now.getTime();
  };

  useEffect(() => {
    const startTracking = async () => {
      try {
        const { status } = await Pedometer.requestPermissionsAsync();
        if (status === 'granted') {
          console.log('Pedometer permission granted!');

          if (await Pedometer.isAvailableAsync()) {
            console.log('Pedometer is available!');

            const subscription = await Pedometer.watchStepCount(result => {
              console.log('Step count updated:', result.steps);
              setSteps(result.steps);
              setDistance(result.steps * 0.0007);
              setCalories(0);
              const calculateCalories = () => {
                const estimatedCalories = result.steps * 0.04; // Example formula
                setCaloriesBurned(estimatedCalories);
              };
              calculateCalories(); // Call when steps update
            });


            return () => {
              console.log('Unsubscribing from step count updates.');
              subscription.remove();
            };
          } else {
            setError('Pedometer is not available on this device.');
          }
        } else {
          setError('Access to Pedometer denied.');
        }
      } catch (error) {
        console.error('Error during Pedometer setup:', error);
        if (error.message.includes('HealthKit')) {
          setError('Error accessing HealthKit: Please check your Health app settings.');
        } else {
          setError('Error tracking steps: ' + error);
        }
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
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Fitness Tracker</ThemedText>
          </ThemedView>

          <ThemedView style={styles.greetingContainer}>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
          </ThemedView>

          <ThemedView style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Steps</Text>
              <Text style={styles.statValue}>{steps}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Distance</Text>
              <Text style={styles.statValue}>{distance.toFixed(2)} km</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Calories Burned</Text>
              <Text style={styles.statValue}>{caloriesBurned.toFixed(2)}</Text>
            </View>
          </ThemedView>

          <Stopwatch />
        </SafeAreaView>
      </ParallaxScrollView>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greetingContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
