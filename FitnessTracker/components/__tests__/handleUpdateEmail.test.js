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

test('handles email update successfully', async () => {
    const mockUpdateEmail = updateEmail.mockResolvedValueOnce();
    const mockOnAuthStateChanged = onAuthStateChanged.mockImplementationOnce((callback) => callback({ email: 'test@example.com' }));
  
    render(<AuthScreen />);
  
    fireEvent.changeText(screen.getByPlaceholderText('Enter new email'), 'new-email@example.com');
    fireEvent.press(screen.getByText('Submit Email Update'));
  
    await waitFor(() => screen.getByText('Email updated successfully!'));
  
    expect(mockUpdateEmail).toHaveBeenCalledWith({ email: 'test@example.com' }, 'new-email@example.com');
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  