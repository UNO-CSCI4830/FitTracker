import React, { useState } from 'react';
import { View, Text, TextInput, Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const ExerciseScreen = () => {
  const [workout, setWorkout] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [exerciseLog, setExerciseLog] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());

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
    <View style={styles.container}>
      <Text style={styles.title}>Log Your Exercise</Text>

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

      <Picker
        selectedValue={selectedDate}
        style={styles.datePicker}
        onValueChange={(itemValue) => setSelectedDate(itemValue)}
      >
        {dateOptions.map((date) => (
          <Picker.Item key={date} label={date} value={date} />
        ))}
      </Picker>

      {/* Goal Inputs */}
      <Text style={styles.goalTitle}>Set Your Fitness Goal</Text>
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

      {/* Custom styled "Log Exercise" button */}
      <TouchableOpacity style={styles.actionButton} onPress={handleLogExercise}>
        <Text style={styles.buttonText}>Log Exercise</Text>
      </TouchableOpacity>

      {/* Display the Goal or Default Message */}
      <View style={styles.goalContainer}>
        <Text style={styles.goalText}>{goalMessage}</Text>
      </View>

      <View style={styles.logsContainer}>
        <Text style={styles.logsTitle}>Today's Exercise Log</Text>
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
          ListEmptyComponent={<Text>No entries logged for today.</Text>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center', // Center all elements horizontally
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    width: '80%', // Set the width to make inputs consistent
  },
  datePicker: {
    height: 50,
    width: '80%', // Adjust the width for consistency
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
  goalContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  goalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  logsContainer: {
    marginTop: 20,
    width: '80%', // Match the width of the log section with the inputs
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
