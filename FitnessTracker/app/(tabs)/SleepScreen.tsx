import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, FlatList, StyleSheet, TouchableOpacity, ColorScheme } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useUser } from './userContext';
import { db } from '../../firebaseConfig';
import { collection, addDoc, query, where, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';

const getActionButtonStyles = (colorScheme: ColorScheme) => ({
  paddingVertical: 10,
  paddingHorizontal: 30,
  borderRadius: 5,
  backgroundColor: colorScheme === 'dark' ? '#555' : '#333',
  marginTop: 5,
  alignSelf: 'center',
  borderWidth: 1,
  borderColor: colorScheme === 'dark' ? '#888' : '#ccc',
});

const getStyles = (colorScheme: ColorScheme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 30,
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: colorScheme === 'dark' ? '#555' : '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    width: '100%',
    color: colorScheme === 'dark' ? 'white' : 'black',
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  goalStatus: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  datePicker: {
    height: 50,
    width: '100%', // Changed width to 100%
    marginTop: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  logEntriesContainer: {
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
    flex: 1,
  },
  logsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  logItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: colorScheme === 'dark' ? '#444' : '#f9f9f9',
    borderWidth: 2,
    borderColor: colorScheme === 'dark' ? '#555' : '#ddd',
    width: '100%',
  },
  totalHoursContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: colorScheme === 'dark' ? '#555' : '#eaeaea',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  totalHoursText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? 'white' : 'black',
  },
});

type SleepEntry = {
  id: string;
  hoursSlept: number;
  date: string;
};

const SleepScreen: React.FC = () => {
  const { user } = useUser(); // Get user from context
  const sleepLogsCollection = collection(db, "sleepLog"); // Sleep logs collection
  const sleepGoalsCollection = collection(db, "sleepGoals"); // Sleep goals collection
  const [hoursSlept, setHoursSlept] = useState<string>('');
  const [sleepLog, setSleepLog] = useState<SleepEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toDateString());
  const [savedSleepGoal, setSavedSleepGoal] = useState<string>('');
  const [goalInput, setGoalInput] = useState<string>('');
  const [goalStatus, setGoalStatus] = useState<string>('');
  const [goalStatusColor, setGoalStatusColor] = useState<string>('green');
  const [totalHoursSlept, setTotalHoursSlept] = useState<number>(0); // State to track total hours slept
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  useEffect(() => {
    const fetchSleepLogs = async () => {
      if (user?.uid) {
        const sleepLogsQuery = query(sleepLogsCollection, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(sleepLogsQuery);
        const logs: SleepEntry[] = [];
        querySnapshot.forEach((doc) => {
          logs.push({
            id: doc.id,
            hoursSlept: doc.data().sleepHours,
            date: doc.data().date,
          });
        });
        setSleepLog(logs);
      }
    };

    const fetchSleepGoal = async () => {
      if (user?.uid) {
        const goalDoc = await getDoc(doc(sleepGoalsCollection, user.uid));
        if (goalDoc.exists()) {
          const goal = goalDoc.data()?.goal;
          setSavedSleepGoal(goal);
        }
      }
    };

    fetchSleepLogs();
    fetchSleepGoal();
  }, [user?.uid]);

  // useEffect to calculate total hours slept for the selected date
  useEffect(() => {
    const total = sleepLog
      .filter((entry) => entry.date === selectedDate)
      .reduce((sum, entry) => sum + entry.hoursSlept, 0);
    setTotalHoursSlept(total);

    // Check if sleep goal is met and update goal status
    if (savedSleepGoal && total >= parseInt(savedSleepGoal, 10)) {
      setGoalStatus(`Goal of ${savedSleepGoal} hours met!`);
      setGoalStatusColor('green');
    } else if (savedSleepGoal) {
      setGoalStatus(`Goal of ${savedSleepGoal} hours not met. Keep resting!`);
      setGoalStatusColor('red');
    }
  }, [selectedDate, sleepLog, totalHoursSlept, savedSleepGoal]);


  const handleLogSleep = async () => {
    if (!hoursSlept) {
      Alert.alert('Error', 'Please enter the hours slept');
      return;
    }

    const numericHours = parseInt(hoursSlept, 10);
    if (isNaN(numericHours) || numericHours < 0) {
      Alert.alert('Error', 'Please enter a valid number for hours slept');
      return;
    }

    try {
      if (user?.uid) {
        // Add a new sleep log entry to Firestore
        await addDoc(sleepLogsCollection, {
          uid: user.uid,
          sleepHours: numericHours,
          date: selectedDate,
        });

        // Update the local sleep log state
        setSleepLog((prevLogs) => [
          ...prevLogs,
          { id: Date.now().toString(), hoursSlept: numericHours, date: selectedDate },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save sleep log.');
    }

    setHoursSlept('');
  };

  const handleSaveGoal = async () => {
    if (!goalInput) {
      Alert.alert('Error', 'Please set a sleep goal.');
      return;
    }

    try {
      if (user?.uid) {
        const goalRef = doc(sleepGoalsCollection, user.uid);
        await setDoc(goalRef, {
          uid: user.uid,
          goal: goalInput,
        });

        setSavedSleepGoal(goalInput);
        Alert.alert('Goal Saved', `Your sleep goal has been set to ${goalInput} hours.`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save sleep goal.');
    }
  };

  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  });

  const filteredLogs = sleepLog.filter((log) => log.date === selectedDate);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5' }]}>
      <View>
        <Text style={styles.title}>Log Sleep</Text>

        <View style={styles.inputGroup}>
          {/* Input for setting the sleep goal */}
          <TextInput
            placeholder="Set Sleep Goal (Hours)"
            style={styles.input}
            keyboardType="numeric"
            value={goalInput}
            onChangeText={setGoalInput}
          />
          {/* Display the saved sleep goal and status */}
          {savedSleepGoal && (
            <Text style={[styles.goalStatus, { color: goalStatusColor }]}>{goalStatus}</Text>
          )}
          {/* Button to save the sleep goal */}
          <TouchableOpacity style={getActionButtonStyles(colorScheme)} onPress={handleSaveGoal}>
            <Text style={styles.buttonText}>Save Sleep Goal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          {/* Picker to select the date for logging sleep */}
          <Picker
            selectedValue={selectedDate}
            onValueChange={setSelectedDate}
            style={styles.datePicker}>
            {dateOptions.map((date) => (
              <Picker.Item key={date} label={date} value={date} />
            ))}
          </Picker>
        </View>

        <View style={styles.inputGroup}>
          {/* Input for entering the hours slept */}
          <TextInput
            placeholder="Enter Hours Slept"
            style={styles.input}
            keyboardType="numeric"
            value={hoursSlept}
            onChangeText={setHoursSlept}
          />
          {/* Button to log the sleep entry */}
          <TouchableOpacity style={getActionButtonStyles(colorScheme)} onPress={handleLogSleep}>
            <Text style={styles.buttonText}>Log Sleep</Text>
          </TouchableOpacity>
        </View>

        {/* Display the logged sleep entries */}
        <View style={styles.logEntriesContainer}>
          <Text style={styles.logsTitle}>Sleep Log Entries</Text>
          <FlatList
            data={filteredLogs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.logItem}>
                <Text>Date: {item.date}</Text>
                <Text>Hours Slept: {item.hoursSlept}</Text>
              </View>
            )}
          />
        </View>

        {/* Display the total hours slept */}
        <View style={styles.totalHoursContainer}>
          <Text style={styles.totalHoursText}>
            Total Hours: {totalHoursSlept} hrs
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SleepScreen;