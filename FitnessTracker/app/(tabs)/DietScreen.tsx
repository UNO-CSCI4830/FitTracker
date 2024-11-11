import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const DietScreen = () => {
  const [foodItem, setFoodItem] = useState('');
  const [calories, setCalories] = useState('');
  const [dietLog, setDietLog] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());

  const handleLogDiet = () => {
    // Validate that both fields are filled and calories is a valid number
    if (!foodItem || !calories) {
      Alert.alert('Error', 'Please fill out both fields');
      return;
    }

    const numericCalories = parseInt(calories, 10);
    if (isNaN(numericCalories) || numericCalories < 0) {
      Alert.alert('Error', 'Please enter a valid number for calories');
      return;
    }

    const newEntry = { 
      id: Date.now().toString(), 
      foodItem, 
      calories: numericCalories, 
      date: selectedDate 
    };
    
    setDietLog((prevLog) => [...prevLog, newEntry]);

    Alert.alert('Diet Logged', `Food: ${foodItem}, Calories: ${numericCalories}, Date: ${selectedDate}`);
    setFoodItem('');
    setCalories('');
  };

  const today = new Date().toDateString();
  const todayLog = dietLog.filter(entry => entry.date === selectedDate);

  const totalCalories = todayLog.reduce((sum, entry) => sum + entry.calories, 0);

  // Generate a list of dates for the past week
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Log Diet</Text>
      <TextInput
        placeholder="Food Item"
        style={{ borderWidth: 1, padding: 10, margin: 10, width: '80%' }}
        value={foodItem}
        onChangeText={setFoodItem}
      />
      <TextInput
        placeholder="Calories"
        style={{ borderWidth: 1, padding: 10, margin: 10, width: '80%' }}
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
      />

      <Button title="Log Diet" onPress={handleLogDiet} />

      {/* Date Picker */}
      <Picker
        selectedValue={selectedDate}
        style={{ height: 50, width: '80%', margin: 10 }}
        onValueChange={(itemValue) => setSelectedDate(itemValue)}
      >
        {dateOptions.map((date) => (
          <Picker.Item key={date} label={date} value={date} />
        ))}
      </Picker>



      <Text style={{ fontSize: 20, marginTop: 20 }}>Today's Diet Log</Text>
      <FlatList
        data={todayLog}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, width: '80%', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Food: {item.foodItem}</Text>
            <Text>Calories: {item.calories}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No entries logged for today.</Text>}
      />
      
      <Text style={{ fontSize: 18, marginTop: 20 }}>Total Calories: {totalCalories}</Text>
    </View>
  );
};

export default DietScreen;
