import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, updateEmail } from 'firebase/auth';
import { app } from '../../firebaseConfig';
import { useColorScheme } from 'react-native';
import { useUser } from './userContext';

const auth = getAuth(app);

export default function AuthScreen() {
  const { setGlobalUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setGlobalUser(currentUser);
      } else {
        setUser(null);
        setGlobalUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created!');
      setEmail('');
      setPassword('');
      setError('');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Error creating account');
      }
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Logged in!');
      setEmail('');
      setPassword('');
      setError('');
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid username/password');
      } else {
        setError('Invalid email/password');
      }
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

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent!');
      setEmail('');
      setIsForgotPassword(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailChange = async () => {
    if (newEmail && user) {
      try {
        await updateEmail(user, newEmail);
        Alert.alert('Success', 'Email changed successfully!');
        setNewEmail('');
        setIsChangingEmail(false);
      } catch (err) {
        setError('Error changing email: ' + err.message);
      }
    } else {
      setError('Please enter a new email address.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5' }]}>
      {user ? (
        <>
          <Text style={[styles.welcomeText, { color: colorScheme === 'dark' ? 'white' : 'black' }]}>Welcome, {user.email}!</Text>
          <Button title="Sign Out" onPress={handleSignOut} />

          <TouchableOpacity onPress={() => setIsChangingEmail(true)}>
            <Text style={[styles.forgotPasswordText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>Change Email</Text>
          </TouchableOpacity>

          {isChangingEmail && (
            <View style={styles.forgotPasswordContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: colorScheme === 'dark' ? '#555' : '#fff', color: colorScheme === 'dark' ? '#fff' : '#000' }]}
                placeholder="Enter new email"
                onChangeText={setNewEmail}
                value={newEmail}
              />
              <View style={styles.buttonContainer}>
                <Button title="Confirm Change" onPress={handleEmailChange} />
                <Button title="Cancel" onPress={() => setIsChangingEmail(false)} />
              </View>
            </View>
          )}
        </>
      ) : (
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

          <TouchableOpacity onPress={() => setIsForgotPassword(true)}>
            <Text style={[styles.forgotPasswordText, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>Forgot Password?</Text>
          </TouchableOpacity>

          {isForgotPassword && (
            <View style={styles.forgotPasswordContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: colorScheme === 'dark' ? '#555' : '#fff', color: colorScheme === 'dark' ? '#fff' : '#000' }]}
                placeholder="Enter your email"
                onChangeText={setEmail}
                value={email}
              />
              <View style={styles.buttonContainer}>
                <Button title="Send Reset Email" onPress={handleForgotPassword} />
                <Button title="Back to Sign In" onPress={() => setIsForgotPassword(false)} />
              </View>
            </View>
          )}
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
  forgotPasswordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
  },
  forgotPasswordText: {
    marginTop: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
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