import React from 'react';
import { render, fireEvent, screen, waitFor} from '@testing-library/react-native';
//import { Alert } from 'react-native';
import SleepScreen from '../../app/(tabs)/SleepScreen';

//jest.spyOn(Alert, 'alert'); // Mock the alert function to track calls

describe('SleepScreen Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders SleepScreen UI components correctly', () => {
    const { getByPlaceholderText, getByText } = render(<SleepScreen />);
    expect(getByPlaceholderText('Set Sleep Goal (Hours)')).toBeTruthy();
    expect(getByPlaceholderText('Hours Slept')).toBeTruthy();
    expect(getByText('Logged Sleep Entries')).toBeTruthy();
  });

  test('allows user to input sleep goal and hours slept', () => {
    const { getByPlaceholderText } = render(<SleepScreen />);
    const goalInput = getByPlaceholderText('Set Sleep Goal (Hours)');
    const hoursInput = getByPlaceholderText('Hours Slept');

    fireEvent.changeText(goalInput, '8');
    fireEvent.changeText(hoursInput, '7');

    expect(goalInput.props.value).toBe('8');
    expect(hoursInput.props.value).toBe('7');
  });

  test('logs sleep entry and displays success alert when input is valid', async () => {
    const { getByPlaceholderText, getByText } = render(<SleepScreen />);
    const goalInput = getByPlaceholderText('Set Sleep Goal (Hours)');
    const hoursInput = getByPlaceholderText('Hours Slept');
    const logButton = getByText('Log Sleep');

    fireEvent.changeText(goalInput, '8');
    fireEvent.changeText(hoursInput, '9');
    fireEvent.press(logButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Sleep Logged',
        expect.stringContaining('Hours Slept: 9')
      );
    });
  });

  test('shows error alert for invalid or missing hours slept input', async () => {
    const { getByText } = render(<SleepScreen />);
    const logButton = getByText('Log Sleep');

    fireEvent.press(logButton); //Nothing entered
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter the hours slept');
    });

    // Invalid input
    fireEvent.changeText(getByPlaceholderText('Hours Slept'), '-5');
    fireEvent.press(logButton);
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter a valid number for hours slept');
    });
  });

  test('updates goal status when logging sleep', async () => {
    const { getByPlaceholderText, getByText } = render(<SleepScreen />);
    const goalInput = getByPlaceholderText('Set Sleep Goal (Hours)');
    const hoursInput = getByPlaceholderText('Hours Slept');
    const logButton = getByText('Log Sleep');

    fireEvent.changeText(goalInput, '8');
    fireEvent.changeText(hoursInput, '7');
    fireEvent.press(logButton);

    await waitFor(() => {
      expect(getByText('Goal not met. Try to get more rest!')).toBeTruthy();
    });

    fireEvent.changeText(hoursInput, '8');
    fireEvent.press(logButton);

    await waitFor(() => {
      expect(getByText('Goal met!')).toBeTruthy();
    });
  });

  test('renders logged sleep entries correctly', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<SleepScreen />);
    const hoursInput = getByPlaceholderText('Hours Slept');
    const logButton = getByText('Log Sleep');

    // Ensure no entries at the start
    expect(queryByText('No entries logged.')).toBeTruthy();

    // Log a sleep entry
    fireEvent.changeText(hoursInput, '7');
    fireEvent.press(logButton);

    await waitFor(() => {
      expect(queryByText('No entries logged.')).toBeNull();
      expect(getByText('Hours Slept: 7')).toBeTruthy();
    });
  });
});

