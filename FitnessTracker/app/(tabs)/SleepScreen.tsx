import React, { useState } from 'react';
import { View, Text, TextInput, Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Define types for the sleep log entry
interface SleepEntry {
  id: string;
  hoursSlept: number;
  date: string;
}

const SleepScreen: React.FC = () => {
  const [hoursSlept, setHoursSlept] = useState<string>(''); // Hours slept input as string
  const [sleepLog, setSleepLog] = useState<SleepEntry[]>([]); // Array of sleep entries
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toDateString()); // Default to today's date
  const [sleepGoal, setSleepGoal] = useState<string>(''); // User's sleep goal
  const [goalStatus, setGoalStatus] = useState<string>(''); // To track if the user met the goal
  const [goalStatusColor, setGoalStatusColor] = useState<string>('green'); // Default color for goal status

  const handleLogSleep = () => {
    if (!hoursSlept) {
      Alert.alert('Error', 'Please enter the hours slept');
      return;
    }

    const numericHours = parseInt(hoursSlept, 10);
    if (isNaN(numericHours) || numericHours < 0) {
      Alert.alert('Error', 'Please enter a valid number for hours slept');
      return;
    }

    const newEntry: SleepEntry = {
      id: Date.now().toString(),
      hoursSlept: numericHours,
      date: selectedDate,
    };

    setSleepLog((prevLog) => [...prevLog, newEntry]);

    // Check if the user met their goal
    if (sleepGoal && numericHours >= parseInt(sleepGoal, 10)) {
      setGoalStatus('Goal met!');
      setGoalStatusColor('green');
    } else if (sleepGoal) {
      setGoalStatus('Goal not met. Try to get more rest!');
      setGoalStatusColor('red');
    }

    Alert.alert('Sleep Logged', `Hours Slept: ${numericHours}, Date: ${selectedDate}`);
    setHoursSlept('');
  };

  const handleHoursChange = (text: string) => {
    if (/^\d*$/.test(text)) {
      setHoursSlept(text);
    }
  };

  const handleGoalChange = (text: string) => {
    if (/^\d*$/.test(text)) {
      setSleepGoal(text);
      setGoalStatus(''); // Reset goal status whenever the goal is changed
      setGoalStatusColor('green'); // Reset the color to green if the goal is changed
    }
  };

  const dateOptions: string[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Sleep</Text>
      
      {/* Sleep Goal Input */}
      <TextInput
        placeholder="Set Sleep Goal (Hours)"
        style={styles.input}
        keyboardType="numeric"
        value={sleepGoal}
        onChangeText={handleGoalChange}
      />
      {sleepGoal && (
        <Text style={[styles.goalStatus, { color: goalStatusColor }]}>
          {goalStatus}
        </Text>
      )}

      <TextInput
        placeholder="Hours Slept"
        style={styles.input}
        keyboardType="numeric"
        value={hoursSlept}
        onChangeText={handleHoursChange}
      />

      {/* Custom styled "Log Sleep" button */}
      <TouchableOpacity style={styles.actionButton} onPress={handleLogSleep}>
        <Text style={styles.buttonText}>Log Sleep</Text>
      </TouchableOpacity>

      {/* Date Picker */}
      <Picker
        selectedValue={selectedDate}
        style={styles.datePicker}
        onValueChange={(itemValue) => setSelectedDate(itemValue)}
      >
        {dateOptions.map((date) => (
          <Picker.Item key={date} label={date} value={date} />
        ))}
      </Picker>

      <Text style={styles.logsTitle}>Logged Sleep Entries</Text>
      <FlatList
        data={sleepLog}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <Text>Hours Slept: {item.hoursSlept}</Text>
            <Text>Date: {item.date}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No entries logged.</Text>}
      />
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
    width: '80%', // Set the width to make inputs consistent with the exercise page
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
  goalStatus: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  datePicker: {
    height: 50,
    width: '80%', // Adjust width to match the input fields
    marginBottom: 20,
  },
  logsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  logItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    width: '80%', // Consistent width with the inputs
  },
});

export default SleepScreen;
