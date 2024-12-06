import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../firebaseConfig'; // Adjust the path to firebaseConfig.js if needed
import { useColorScheme } from 'react-native';

const auth = getAuth(app);

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null); // Store authenticated user
  const colorScheme = useColorScheme(); // Get the color scheme

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user when logged in
      } else {
        setUser(null); // Set user to null when logged out
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created!');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Logged in!');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      Alert.alert('Success', 'Signed out!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5' }]}> 
      {user ? (
        // If the user is signed in, show a welcome message and sign out button
        <>
          <Text style={[styles.welcomeText, { color: colorScheme === 'dark' ? 'white' : 'black' }]}>Welcome, {user.email}!</Text> 

          <Button title="Sign Out" onPress={handleSignOut} />
        </>
      ) : (
        // If the user is not signed in, show sign-in/sign-up form
        <>
          <TextInput
            style={[styles.input, { backgroundColor: colorScheme === 'dark' ? '#555' : '#fff', color: colorScheme === 'dark' ? '#fff' : '#000' }]} 

            placeholder="Email"
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            style={[styles.input, { backgroundColor: colorScheme === 'dark' ? '#555' : '#fff', color: colorScheme === 'dark' ? '#fff' : '#000' }]} 

            placeholder="Password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
          <View style={styles.buttonContainer}>
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button title="Sign In" onPress={handleSignIn} />
          </View>
        </>
      )}
      {error ? <Text style={[styles.errorText, { color: colorScheme === 'dark' ? 'orange' : 'red' }]}>{error}</Text> : null} 

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
