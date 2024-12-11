import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import ExerciseScreen from './ExerciseScreen';

describe('ExerciseScreen', () => {
  test('renders exercise log form correctly', () => {
    render(<ExerciseScreen />);
    expect(screen.getByPlaceholderText('Workout Name')).toBeTruthy();
    expect(screen.getByPlaceholderText('Reps')).toBeTruthy();
    expect(screen.getByPlaceholderText('Sets')).toBeTruthy();
    expect(screen.getByText('Log Exercise')).toBeTruthy();
  });

  test('handleLogExercise should do nothing when fields are empty', async () => {
    render(<ExerciseScreen />);
    fireEvent.press(screen.getByText('Log Exercise'));

    // Debugging: log the screen content to check what is rendered
    screen.debug();

    // Ensure no error message appears (no message with "Please fill out all fields")
    const errorMessage = screen.queryByText('Please fill out all fields');
    expect(errorMessage).toBeNull();

    // Also, ensure that no new log entries are shown if fields are empty
    const logEntry = screen.queryByText('Workout:');
    expect(logEntry).toBeNull();
  });

  test('handleLogExercise should log exercise when fields are valid', async () => {
    render(<ExerciseScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Workout Name'), 'Push-up');
    fireEvent.changeText(screen.getByPlaceholderText('Reps'), '10');
    fireEvent.changeText(screen.getByPlaceholderText('Sets'), '3');
    fireEvent.press(screen.getByText('Log Exercise'));

    // Check individual log text elements
    await waitFor(() => {
      expect(screen.getByText('Workout: Push-up')).toBeTruthy();
      expect(screen.getByText('Reps: 10')).toBeTruthy();
      expect(screen.getByText('Sets: 3')).toBeTruthy();
    });
  });

  test('handleNumericInputChange should allow only numeric input for reps and sets', () => {
    render(<ExerciseScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Reps'), 'abc');
    expect(screen.getByPlaceholderText('Reps').props.value).toBe('');

    fireEvent.changeText(screen.getByPlaceholderText('Sets'), '25');
    expect(screen.getByPlaceholderText('Sets').props.value).toBe('25');
  });

  test('goalMessage should display default message when no goal is set', () => {
    render(<ExerciseScreen />);
    const goalMessage = screen.getByText("Goal hasn't been set yet. Make one!");
    expect(goalMessage).toBeTruthy();
  });

  test('goalMessage should display custom message when goal is set', async () => {
    render(<ExerciseScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Goal Reps'), '15');
    fireEvent.changeText(screen.getByPlaceholderText('Goal Sets'), '4');
    await waitFor(() => {
      expect(screen.getByText('Your Goal: 15 reps x 4 sets')).toBeTruthy();
    });
  });
});
