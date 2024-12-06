import React, { useState } from 'react';
import { View, Text, TextInput, Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
\
const ExerciseScreen = () => {
  const [workout, setWorkout] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [exerciseLog, setExerciseLog] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const colorScheme = useColorScheme();

  // New state for fitness goal
  const [goalReps, setGoalReps] = useState('');
  const [goalSets, setGoalSets] = useState('');

  const handleLogExercise = () => {
    if (!workout || !reps || !sets) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    const numericReps = parseInt(reps, 10);
    const numericSets = parseInt(sets, 10);

    if (isNaN(numericReps) || numericReps < 0 || isNaN(numericSets) || numericSets < 0) {
      Alert.alert('Error', 'Please enter valid numbers for reps and sets');
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      workout,
      reps: numericReps,
      sets: numericSets,
      date: selectedDate,
    };

    setExerciseLog((prevLog) => [...prevLog, newEntry]);

    Alert.alert('Exercise Logged', `Workout: ${workout}, Reps: ${numericReps}, Sets: ${numericSets}, Date: ${selectedDate}`);
    setWorkout('');
    setReps('');
    setSets('');
  };

  const today = new Date().toDateString();
  const todayLog = exerciseLog.filter((entry) => entry.date === selectedDate);

  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  });

  const handleNumericInputChange = (text: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (/^\d*$/.test(text)) {
      setter(text);
    }
  };

  // Default message if goal hasn't been set
  const goalMessage = goalReps && goalSets ? `Your Goal: ${goalReps} reps x ${goalSets} sets` : 'Goal hasn\'t been set yet. Make one!';

  return (
      <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5' }]}>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <Text style={[styles.title, { color: colorScheme === 'dark' ? 'white' : 'black' }]}>Log Your Exercise</Text>

      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          placeholder="Workout Name"
          value={workout}
          onChangeText={setWorkout}
        />
        <TextInput
          style={styles.input}
          placeholder="Reps"
          value={reps}
          keyboardType="numeric"
          onChangeText={(text) => handleNumericInputChange(text, setReps)}
        />
        <TextInput
          style={styles.input}
          placeholder="Sets"
          value={sets}
          keyboardType="numeric"
          onChangeText={(text) => handleNumericInputChange(text, setSets)}
        />
      </View>

      <Picker
        selectedValue={selectedDate}
        style={styles.datePicker}
        onValueChange={(itemValue) => setSelectedDate(itemValue)}
      >
        {dateOptions.map((date) => (
          <Picker.Item key={date} label={date} value={date} />
        ))}
      </Picker>

      <View style={styles.goalGroup}>
      <Text style={[styles.goalTitle, { color: colorScheme === 'dark' ? 'white' : 'black' }]}>Set Your Fitness Goal</Text>
        <TextInput
          style={styles.input}
          placeholder="Goal Reps"
          value={goalReps}
          keyboardType="numeric"
          onChangeText={(text) => handleNumericInputChange(text, setGoalReps)}
        />
        <TextInput
          style={styles.input}
          placeholder="Goal Sets"
          value={goalSets}
          keyboardType="numeric"
          onChangeText={(text) => handleNumericInputChange(text, setGoalSets)}
        />
      </View>


      <TouchableOpacity style={styles.actionButton} onPress={handleLogExercise}>
        <Text style={styles.buttonText}>Log Exercise</Text>
      </TouchableOpacity>

      <View style={styles.goalMessageContainer}>
        <Text style={styles.goalText}>{goalMessage}</Text>
      </View>

      <View style={styles.logEntriesContainer}>
      <Text style={[styles.logsTitle, { color: colorScheme === 'dark' ? 'white' : 'black' }]}>Today's Exercise Log</Text>

        <FlatList
          data={todayLog}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <Text>Workout: {item.workout}</Text>
              <Text>Reps: {item.reps}</Text>
              <Text>Sets: {item.sets}</Text>
              <Text>Date: {item.date}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ color: colorScheme === 'dark' ? 'white' : 'black' }}>No entries logged for today.</Text>}
        />
      </View>
    </View>
  </SafeAreaView>

  );
};

const styles = StyleSheet.create({
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
    width: '80%',
    marginBottom: 30,
  },
  goalGroup: {
    width: '80%',
    marginBottom: 30,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '100%', 
  },
  datePicker: {
    height: 50,
    width: '80%',

    marginBottom: 20,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: '#333',
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  goalMessageContainer: {

    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    alignSelf: 'center',
    width: '80%',

  },
  goalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  logEntriesContainer: {
    marginTop: 20,
    width: '80%',

  },
  logsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default ExerciseScreen;
