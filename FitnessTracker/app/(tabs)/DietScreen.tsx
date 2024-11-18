import React, { useState } from 'react';
import { View, Text, TextInput, Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface DietEntry {
  id: string;
  foodItem: string;
  calories: number;
  date: string;
}

const DietScreen: React.FC = () => {
  const [foodItem, setFoodItem] = useState('');
  const [calories, setCalories] = useState('');
  const [dietLog, setDietLog] = useState<DietEntry[]>([]); // Array of diet entries
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toDateString()); // Default to today's date

  const handleLogDiet = () => {
    if (!foodItem || !calories) {
      Alert.alert('Error', 'Please fill out both fields');
      return;
    }

    const numericCalories = parseInt(calories, 10);
    if (isNaN(numericCalories) || numericCalories < 0) {
      Alert.alert('Error', 'Please enter a valid number for calories');
      return;
    }

    const newEntry: DietEntry = {
      id: Date.now().toString(),
      foodItem,
      calories: numericCalories,
      date: selectedDate,
    };

    setDietLog((prevLog) => [...prevLog, newEntry]);

    Alert.alert('Diet Logged', `Food: ${foodItem}, Calories: ${numericCalories}, Date: ${selectedDate}`);
    setFoodItem('');
    setCalories('');
  };

  const today = new Date().toDateString();
  const todayLog = dietLog.filter((entry) => entry.date === selectedDate);

  const totalCalories = todayLog.reduce((sum, entry) => sum + entry.calories, 0);

  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  });

  const handleCaloriesChange = (text: string) => {
    if (/^\d*$/.test(text)) {
      setCalories(text);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Diet</Text>
      <TextInput
        placeholder="Food Item"
        style={styles.input}
        value={foodItem}
        onChangeText={setFoodItem}
      />
      <TextInput
        placeholder="Calories"
        style={styles.input}
        keyboardType="numeric"
        value={calories}
        onChangeText={handleCaloriesChange}
      />

      {/* Custom styled "Log Diet" button */}
      <TouchableOpacity style={styles.actionButton} onPress={handleLogDiet}>
        <Text style={styles.buttonText}>Log Diet</Text>
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

      <Text style={styles.logsTitle}>Today's Diet Log</Text>
      <FlatList
        data={todayLog}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <Text>Food: {item.foodItem}</Text>
            <Text>Calories: {item.calories}</Text>
            <Text>Date: {item.date}</Text> {/* Add the date to the log entry */}
          </View>
        )}
        ListEmptyComponent={<Text>No entries logged for today.</Text>}
      />
      
      <Text style={styles.totalCalories}>Total Calories: {totalCalories}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    width: '80%',
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
  datePicker: {
    height: 50,
    width: '80%',
    marginBottom: 20,
  },
  logsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  logItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    width: '80%',
  },
  totalCalories: {
    fontSize: 18,
    marginTop: 20,
  },
});

export default DietScreen;
