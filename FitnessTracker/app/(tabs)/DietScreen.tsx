import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, FlatList, StyleSheet, TouchableOpacity, ColorScheme } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';

interface DietEntry {
  id: string;
  foodItem: string;
  calories: number;
  date: string;
}

const getActionButtonStyles = (colorScheme: ColorScheme) => ({
  paddingVertical: 10,
  paddingHorizontal: 30,
  borderRadius: 5,
  backgroundColor: colorScheme === 'dark' ? '#555' : '#333',
  marginTop: 20,
  alignSelf: 'center',
  borderWidth: 1,
  borderColor: colorScheme === 'dark' ? '#888' : '#ccc',
});

const getStyles = (colorScheme: ColorScheme) => StyleSheet.create({
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
    padding: 12, 
  },
  buttonText: {
    color: 'white', 
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
    color: colorScheme === 'dark' ? 'white' : 'black', 
  },
  logItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: colorScheme === 'dark' ? '#444' : '#f9f9f9', 
    borderWidth: 1,
    borderColor: colorScheme === 'dark' ? '#555' : '#ddd', 
    width: '100%', 
  },
  totalCalories: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20, 
    color: colorScheme === 'dark' ? 'white' : 'black', 
  },
  goalStatus: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
});

const DietScreen: React.FC = () => {
  const [foodItem, setFoodItem] = useState('');
  const [calories, setCalories] = useState('');
  const [dietLog, setDietLog] = useState<DietEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toDateString());
  const [goalCalories, setGoalCalories] = useState<string>('');
  const [goalStatus, setGoalStatus] = useState<string>('');
  const [goalStatusColor, setGoalStatusColor] = useState<string>('green');
  const [goalSet, setGoalSet] = useState(false); 

  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

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

    // Calculate total calories for the selected date
    const todayLog = updatedLog.filter(entry => entry.date === selectedDate);
    const totalCalories = todayLog.reduce((sum, entry) => sum + entry.calories, 0);

    if (goalCalories && totalCalories <= parseInt(goalCalories, 10)) {
      setGoalStatus('Goal met!');
      setGoalStatusColor('green');
    } else if (goalCalories) {
      setGoalStatus('Goal not met. Try again tomorrow!');
      setGoalStatusColor('red');
    }

    Alert.alert('Diet Logged', `Food: ${foodItem}, Calories: ${numericCalories}, Date: ${selectedDate}`);
    setFoodItem('');
    setCalories('');

    setGoalSet(true); // Set goalSet to true after logging the first entry
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
      {!goalSet && ( // Conditionally render the goal input 
      <TextInput
        placeholder="Set Your Goal (Calories)"
        style={styles.input}
        keyboardType="numeric"
        value={goalCalories}
        onChangeText={handleGoalChange}
      />
    )}
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

      <TouchableOpacity style={getActionButtonStyles(colorScheme)} onPress={handleLogDiet}> 
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
          <Text style={{ color: colorScheme === 'dark' ? 'white' : 'black' }}>Food: {item.foodItem}</Text>
          <Text style={{ color: colorScheme === 'dark' ? 'white' : 'black' }}>Calories: {item.calories}</Text>
          <Text style={{ color: colorScheme === 'dark' ? 'white' : 'black' }}>Date: {item.date}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={{ color: colorScheme === 'dark' ? 'white' : 'black' }}>No entries logged.</Text>}
    />
  </View>

  {goalSet && ( // Conditionally render the goal text
    <Text style={styles.totalCalories}>
      Today's Calorie Goal: {goalCalories} 
    </Text>
  )}

  <Text style={styles.totalCalories}> 
    Total Calories: {todayLog.reduce((sum, entry) => sum + entry.calories, 0)} 
  </Text>
      </View>
    </SafeAreaView>
  );
};

export default DietScreen;