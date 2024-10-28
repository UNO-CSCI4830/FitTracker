import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const SleepScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Log Sleep</Text>
      <TextInput placeholder="Hours Slept" style={{ borderWidth: 1, padding: 10, margin: 10 }} keyboardType="numeric" />
      <Button title="Log Sleep" />
    </View>
  );
};

export default SleepScreen;