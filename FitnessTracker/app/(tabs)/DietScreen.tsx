import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const DietScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Log Diet</Text>
      <TextInput placeholder="Food Item" style={{ borderWidth: 1, padding: 10, margin: 10 }} />
      <TextInput placeholder="Calories" style={{ borderWidth: 1, padding: 10, margin: 10 }} keyboardType="numeric" />
      <Button title="Log Diet" />
    </View>
  );
};

export default DietScreen;