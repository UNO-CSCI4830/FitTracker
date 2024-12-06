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

test('handles delete account successfully', async () => {
    const mockDeleteUser = deleteUser.mockResolvedValueOnce();
    const mockOnAuthStateChanged = onAuthStateChanged.mockImplementationOnce((callback) => callback({ email: 'test@example.com' }));
  
    render(<AuthScreen />);
  
    fireEvent.press(screen.getByText('Delete Account'));
  
    await waitFor(() => screen.getByText('Account deleted successfully!'));
  
    expect(mockDeleteUser).toHaveBeenCalled();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  