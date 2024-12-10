import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, FlatList, StyleSheet, TouchableOpacity, ColorScheme } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useUser } from './userContext'; // Import the useUser hook
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
  totalCaloriesContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: colorScheme === 'dark' ? '#444' : '#f0f0f0',
    borderWidth: 1,
    borderColor: colorScheme === 'dark' ? '#555' : '#ddd',
    width: '100%',
    alignItems: 'center',
  },
  totalCaloriesText: {
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

type DietEntry = {
  id: string;
  foodName: string;
  calories: number;
  date: string;
};

const DietScreen: React.FC = () => {
  const { user } = useUser(); // Get the current user from context
  const dietLogsCollection = collection(db, "dietLog");
  const dietGoalsCollection = collection(db, "dietGoals");
  const [foodName, setFoodName] = useState<string>('');
  const [calories, setCalories] = useState<string>('');
  const [dietLog, setDietLog] = useState<DietEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toDateString());
  const [savedDietGoal, setSavedDietGoal] = useState<string>(''); 
  const [goalInput, setGoalInput] = useState<string>(''); 
  const [goalStatus, setGoalStatus] = useState<string>('');
  const [goalStatusColor, setGoalStatusColor] = useState<string>('green');
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  useEffect(() => {
    const fetchDietLogs = async () => {
      if (user?.uid) {
        const dietLogsQuery = query(dietLogsCollection, where("uid", "==", user.uid)); // Filter by uid
        const querySnapshot = await getDocs(dietLogsQuery);
        const logs: DietEntry[] = [];
        querySnapshot.forEach((doc) => {
          logs.push({
            id: doc.id,
            foodName: doc.data().foodName,
            calories: doc.data().calories,
            date: doc.data().date,
          });
        });
        setDietLog(logs);
      }
    };

    const fetchDietGoal = async () => {
      if (user?.uid) {
        const goalDoc = await getDoc(doc(dietGoalsCollection, user.uid)); // Use uid for the goal document
        if (goalDoc.exists()) {
          const goal = goalDoc.data()?.goal;
          setSavedDietGoal(goal);
        }
      }
    };

    fetchDietLogs();
    fetchDietGoal();
  }, [user?.uid]);

  useEffect(() => {
    const total = dietLog
      .filter((entry) => entry.date === selectedDate)
      .reduce((sum, entry) => sum + entry.calories, 0);
    setTotalCalories(total);

    if (savedDietGoal && total >= parseInt(savedDietGoal, 10)) {
      setGoalStatus(`Goal of ${savedDietGoal} calories met!`);
      setGoalStatusColor('green');
    } else if (savedDietGoal) {
      setGoalStatus(`Goal of ${savedDietGoal} calories not met. Keep going!`);
      setGoalStatusColor('red');
    }
  }, [selectedDate, dietLog, totalCalories, savedDietGoal]);

  const handleLogDiet = async () => {
    if (!foodName || !calories) {
      Alert.alert('Error', 'Please enter both food name and calories');
      return;
    }

    const numericCalories = parseInt(calories, 10);
    if (isNaN(numericCalories) || numericCalories < 0) {
      Alert.alert('Error', 'Please enter a valid number for calories');
      return;
    }

    try {
      if (user?.uid) {
        await addDoc(dietLogsCollection, {
          uid: user.uid, // Associate diet log with current user
          foodName,
          calories: numericCalories,
          date: selectedDate,
        });

        setDietLog((prevLogs) => [
          ...prevLogs,
          { id: Date.now().toString(), foodName, calories: numericCalories, date: selectedDate },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save diet log.');
    }

    setFoodName('');
    setCalories('');
  };

  const handleSaveGoal = async () => {
    if (!goalInput) {
      Alert.alert('Error', 'Please set a diet goal.');
      return;
    }

    try {
      if (user?.uid) {
        const goalRef = doc(dietGoalsCollection, user.uid); // Set goal for current user
        await setDoc(goalRef, { goal: goalInput, uid: user.uid }); // Save the goal with uid

        setSavedDietGoal(goalInput);
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

  const filteredLogs = dietLog.filter((log) => log.date === selectedDate);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5' }]}>
      <View style={styles.container}>
        <Text style={styles.title}>Diet Tracker</Text>

        {/* Diet Goal Section */}
        <View style={styles.goalContainer}>
          <Text style={styles.goalText}>Your Diet Goal</Text>
          {savedDietGoal ? (
            <Text style={[styles.goalStatusText, { color: goalStatusColor }]}>
              {goalStatus}
            </Text>
          ) : (
            <Text style={styles.goalStatusText}>Set your diet goal!</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Set Diet Goal (calories)"
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
            placeholder="Food Name"
            style={styles.input}
            value={foodName}
            onChangeText={setFoodName}
          />
          <TextInput
            placeholder="Calories"
            style={styles.input}
            keyboardType="numeric"
            value={calories}
            onChangeText={setCalories}
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
          <TouchableOpacity
            style={getActionButtonStyles(colorScheme)}
            onPress={handleLogDiet}
          >
            <Text style={styles.buttonText}>Log Food</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredLogs}
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <Text>{item.foodName} - {item.calories} calories</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />

        {/* Total Calories Tracker */}
        <View style={styles.totalCaloriesContainer}>
          <Text style={styles.totalCaloriesText}>Total Calories: {totalCalories} calories</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DietScreen;
