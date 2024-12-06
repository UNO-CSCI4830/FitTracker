import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AuthScreen from '../../app/(tabs)/login';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('AuthScreen Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login screen correctly when user is not logged in', () => {
    const { getByPlaceholderText, getByText } = render(<AuthScreen />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  test('allows user to input email and password', () => {
    const { getByPlaceholderText } = render(<AuthScreen />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  test('signs up a new user successfully', async () => {
    createUserWithEmailAndPassword.mockResolvedValueOnce({});
    const { getByText, getByPlaceholderText } = render(<AuthScreen />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Account created!');
    });
  });

  test('shows error when sign-up fails', async () => {
    createUserWithEmailAndPassword.mockRejectedValueOnce(new Error('Sign-up failed'));
    const { getByText, getByPlaceholderText, getByTextContent } = render(<AuthScreen />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(getByText('Sign-up failed')).toBeTruthy();
    });
  });

  test('signs in a user successfully', async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({});
    const { getByText, getByPlaceholderText } = render(<AuthScreen />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Logged in!');
    });
  });

  test('displays welcome message when user is logged in', async () => {
    onAuthStateChanged.mockImplementation((_, callback) =>
      callback({ email: 'test@example.com' })
    );

    const { getByText } = render(<AuthScreen />);
    await waitFor(() => {
      expect(getByText('Welcome, test@example.com!')).toBeTruthy();
    });
  });
});
