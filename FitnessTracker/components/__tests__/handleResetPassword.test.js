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

test('handles password reset email successfully', async () => {
    const mockResetPassword = sendPasswordResetEmail.mockResolvedValueOnce();
  
    render(<AuthScreen />);
  
    fireEvent.changeText(screen.getByPlaceholderText('Enter your email for password reset'), 'test@example.com');
    fireEvent.press(screen.getByText('Submit Password Reset'));
  
    await waitFor(() => screen.getByText('Password reset email sent successfully!'));
  
    expect(mockResetPassword).toHaveBeenCalledWith(getAuth(app), 'test@example.com');
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  