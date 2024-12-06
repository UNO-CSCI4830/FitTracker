import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import AuthScreen from '../../app/(tabs)/login'; // Adjust the import as necessary
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateEmail, deleteUser, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../firebaseConfig'; // Adjust the path to firebaseConfig.js

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updateEmail: jest.fn(),
  deleteUser: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

test('handles sign in successfully', async () => {
    const mockSignIn = signInWithEmailAndPassword.mockResolvedValueOnce({ user: {} });
  
    render(<AuthScreen />);
  
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.press(screen.getByText('Sign In'));
  
    await waitFor(() => screen.getByText('Logged in successfully!'));
  
    expect(mockSignIn).toHaveBeenCalledWith(getAuth(app), 'test@example.com', 'password123');
    expect(screen.getByText('Logged in successfully!')).toBeTruthy();
  });
  
  test('handles sign in error', async () => {
    const mockSignIn = signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Error'));
  
    render(<AuthScreen />);
  
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.press(screen.getByText('Sign In'));
  
    await waitFor(() => screen.getByText('Could not login, email or password may be incorrect.'));
    expect(mockSignIn).toHaveBeenCalledWith(getAuth(app), 'test@example.com', 'password123');
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  