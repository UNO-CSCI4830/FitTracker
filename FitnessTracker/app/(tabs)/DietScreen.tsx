import React, { useState } from 'react';
import { View, Text, TextInput, Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';

interface DietEntry {
  id: string;
  foodItem: string;
  calories: number;
  date: string;
}

const DietScreen: React.FC = () => {
  const [foodItem, setFoodItem] = useState('');
  const [calories, setCalories] = useState('');
  const [dietLog, setDietLog] = useState<DietEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toDateString());
  const [goalCalories, setGoalCalories] = useState<string>('');
  const [goalStatus, setGoalStatus] = useState<string>('');
  const [goalStatusColor, setGoalStatusColor] = useState<string>('green');
  const colorScheme = useColorScheme();

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

    const updatedLog = [...dietLog, newEntry];
    setDietLog(updatedLog);
    
    // Calculate total calories and check if goal is met
    const totalCalories = updatedLog.reduce((sum, entry) => sum + entry.calories, 0);
    if (goalCalories && numericCalories <= parseInt(goalCalories, 10)) {
      setGoalStatus('Goal met!');
      setGoalStatusColor('green');
    } else if (goalCalories) {
      setGoalStatus('Goal not met. Try again tomorrow!');
      setGoalStatusColor('red');
    }

    Alert.alert('Diet Logged', `Food: ${foodItem}, Calories: ${numericCalories}, Date: ${selectedDate}`);
    setFoodItem('');
    setCalories('');
  };

  const handleCaloriesChange = (text: string) => {
    if (/^\d*$/.test(text)) {
      setCalories(text);
    }
  };

  const handleGoalChange = (text: string) => {
    if (/^\d*$/.test(text)) {
      setGoalCalories(text);
      setGoalStatus('');
      setGoalStatusColor('green');
    }
  };

  const dateOptions: string[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  });

  const todayLog = dietLog.filter((entry) => entry.date === selectedDate);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5' }]}> 
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <Text style={[styles.title, { color: colorScheme === 'dark' ? 'white' : 'black' }]}>Log Diet</Text>

      <View style={styles.inputGroup}>
        <TextInput
          placeholder="Set Your Goal (Calories)"
          style={styles.input}
          keyboardType="numeric"
          value={goalCalories}
          onChangeText={handleGoalChange}
        />
        {goalCalories && (
          <Text style={[styles.goalStatus, { color: goalStatusColor }]}>
            {goalStatus}
          </Text>
        )}

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
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={handleLogDiet}>
        <Text style={styles.buttonText}>Log Diet</Text>
      </TouchableOpacity>

      <Picker
        selectedValue={selectedDate}
        style={styles.datePicker}
        onValueChange={(itemValue) => setSelectedDate(itemValue)}
      >
        {dateOptions.map((date) => (
          <Picker.Item key={date} label={date} value={date} />
        ))}
      </Picker>

      <View style={styles.logEntriesContainer}>
        <Text style={styles.logsTitle}>Diet Log</Text>
        <FlatList
          data={todayLog}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <Text>Food: {item.foodItem}</Text>
              <Text>Calories: {item.calories}</Text>
              <Text>Date: {item.date}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>No entries logged.</Text>}
        />
      </View>

      <Text style={styles.totalCalories}>
        Total Calories: {todayLog.reduce((sum, entry) => sum + entry.calories, 0)}
      </Text>
    </View>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputGroup: {
    width: '80%',
    marginBottom: 30,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    width: '100%', 
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
  logEntriesContainer: {
    marginTop: 20,
    width: '80%',
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
    width: '100%', 
  },
  totalCalories: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20, 
  },
  goalStatus: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default DietScreen;