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
  datePicker: {
    height: 50,
    width: '80%',
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
  totalMinutesContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: colorScheme === 'dark' ? '#444' : '#f0f0f0',
    borderWidth: 1,
    borderColor: colorScheme === 'dark' ? '#555' : '#ddd',
    width: '100%',
    alignItems: 'center',
  },
  totalMinutesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? 'white' : 'black',
  },
  goalContainer: {
    padding: 15,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: colorScheme === 'dark' ? '#444' : '#f5f5f5',
    width: '100%',
    alignItems: 'center',
  },
  goalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? 'white' : 'black',
  },
  goalStatusText: {
    fontSize: 16,
    marginTop: 5,
    color: colorScheme === 'dark' ? 'lightgreen' : 'darkgreen',
  }
});

type ExerciseEntry = {
  id: string;
  exerciseName: string;
  minutes: number;
  date: string;
};

const ExerciseScreen: React.FC = () => {
  const { user } = useUser();
  const exerciseLogsCollection = collection(db, "exerciseLog");
  const exerciseGoalsCollection = collection(db, "exerciseGoals");
  const [exerciseName, setExerciseName] = useState<string>('');
  const [minutes, setMinutes] = useState<string>('');
  const [exerciseLog, setExerciseLog] = useState<ExerciseEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toDateString());
  const [savedExerciseGoal, setSavedExerciseGoal] = useState<string>('');
  const [goalInput, setGoalInput] = useState<string>('');
  const [goalStatus, setGoalStatus] = useState<string>('');
  const [goalStatusColor, setGoalStatusColor] = useState<string>('green');
  const [totalMinutes, setTotalMinutes] = useState<number>(0);
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  useEffect(() => {
    const fetchExerciseLogs = async () => {
      if (user?.uid) {
        const exerciseLogsQuery = query(exerciseLogsCollection, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(exerciseLogsQuery);
        const logs: ExerciseEntry[] = [];
        querySnapshot.forEach((doc) => {
          logs.push({
            id: doc.id,
            exerciseName: doc.data().exerciseName,
            minutes: doc.data().minutes,
            date: doc.data().date,
          });
        });
        setExerciseLog(logs);
      }
    };

    const fetchExerciseGoal = async () => {
      if (user?.uid) {
        const goalDoc = await getDoc(doc(exerciseGoalsCollection, user.uid));
        if (goalDoc.exists()) {
          const goal = goalDoc.data()?.goal;
          setSavedExerciseGoal(goal);
        }
      }
    };

    fetchExerciseLogs();
    fetchExerciseGoal();
  }, [user?.uid]);

  useEffect(() => {
    const total = exerciseLog
      .filter((entry) => entry.date === selectedDate)
      .reduce((sum, entry) => sum + entry.minutes, 0);
    setTotalMinutes(total);

    if (savedExerciseGoal && total >= parseInt(savedExerciseGoal, 10)) {
      setGoalStatus(`Goal of ${savedExerciseGoal} minutes met!`);
      setGoalStatusColor('green');
    } else if (savedExerciseGoal) {
      setGoalStatus(`Goal of ${savedExerciseGoal} minutes not met. Keep going!`);
      setGoalStatusColor('red');
    }
  }, [selectedDate, exerciseLog, totalMinutes, savedExerciseGoal]);

  const handleLogExercise = async () => {
    if (!exerciseName || !minutes) {
      Alert.alert('Error', 'Please enter both exercise name and minutes');
      return;
    }

    const numericMinutes = parseInt(minutes, 10);
    if (isNaN(numericMinutes) || numericMinutes < 0) {
      Alert.alert('Error', 'Please enter a valid number for minutes');
      return;
    }

    try {
      if (user?.uid) {
        await addDoc(exerciseLogsCollection, {
          uid: user.uid,
          exerciseName,
          minutes: numericMinutes,
          date: selectedDate,
        });

        setExerciseLog((prevLogs) => [
          ...prevLogs,
          { id: Date.now().toString(), exerciseName, minutes: numericMinutes, date: selectedDate },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save exercise log.');
    }

    setExerciseName('');
    setMinutes('');
  };

  const handleSaveGoal = async () => {
    if (!goalInput) {
      Alert.alert('Error', 'Please set an exercise goal.');
      return;
    }

    try {
      if (user?.uid) {
        const goalRef = doc(exerciseGoalsCollection, user.uid);
        await setDoc(goalRef, { goal: goalInput, uid: user.uid });

        setSavedExerciseGoal(goalInput);
        setGoalInput('');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save goal.');
    }
  };


  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  });

  const filteredLogs = exerciseLog.filter((log) => log.date === selectedDate);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5' }]}>
      <View style={styles.container}>
        <Text style={styles.title}>Exercise Tracker</Text>

        {/* Exercise Goal Section */}
        <View style={styles.goalContainer}>
          <Text style={styles.goalText}>Your Exercise Goal</Text>
          {savedExerciseGoal ? (
            <Text style={[styles.goalStatusText, { color: goalStatusColor }]}>
              {goalStatus}
            </Text>
          ) : (
            <Text style={styles.goalStatusText}>Set your exercise goal!</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Set Exercise Goal (minutes)"
            style={styles.input}
            keyboardType="numeric"
            value={goalInput}
            onChangeText={setGoalInput}
          />
          <TouchableOpacity
            style={getActionButtonStyles(colorScheme)}
            onPress={handleSaveGoal}
          >
            <Text style={styles.buttonText}>Save Goal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Exercise Name"
            style={styles.input}
            value={exerciseName}
            onChangeText={setExerciseName}
          />
          <TextInput
            placeholder="Minutes"
            style={styles.input}
            keyboardType="numeric"
            value={minutes}
            onChangeText={setMinutes}
          />
          <Picker
            selectedValue={selectedDate}
            style={styles.datePicker}
            onValueChange={(itemValue) => setSelectedDate(itemValue)}
          >
            {dateOptions.map((date, index) => (
              <Picker.Item key={index} label={date} value={date} />
            ))}
          </Picker>
          <TouchableOpacity style={getActionButtonStyles(colorScheme)} onPress={handleLogExercise}>
            <Text style={styles.buttonText}>Log Exercise</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredLogs}
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <Text>{item.exerciseName} - {item.minutes} minutes</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />

        {/* Total Minutes Tracker */}
        <View style={styles.totalMinutesContainer}>
          <Text style={styles.totalMinutesText}>Total Minutes: {totalMinutes} minutes</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ExerciseScreen;