import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import '@testing-library/jest-native';
import DietScreen from './DietScreen.tsx';
import { Alert } from 'react-native';

describe('DietScreen', () => {
  test('renders the screen title', () => {
    render(<DietScreen />);
    const titleElement = screen.getByText('Log Diet');
    expect(titleElement).toBeTruthy();
  });

  test('updates food item input field', () => {
    render(<DietScreen />);
    const foodInput = screen.getByPlaceholderText('Food Item');
    fireEvent.changeText(foodInput, 'Apple');
    expect(foodInput.props.value).toBe('Apple');
  });

  test('updates calories input field', () => {
    render(<DietScreen />);
    const caloriesInput = screen.getByPlaceholderText('Calories');
    fireEvent.changeText(caloriesInput, '100');
    expect(caloriesInput.props.value).toBe('100'); 
  });

  test('logs a diet entry', async () => {
    render(<DietScreen />);
    const foodInput = screen.getByPlaceholderText('Food Item');
    const caloriesInput = screen.getByPlaceholderText('Calories');
    const logButton = screen.getByText('Log Diet');

    fireEvent.changeText(foodInput, 'Banana');
    fireEvent.changeText(caloriesInput, '150');
    fireEvent.press(logButton);

    const logEntry = screen.getByTestId('diet-entry-1');
    expect(logEntry).toBeTruthy();
    expect(logEntry).toHaveTextContent('Food: Banana');
    expect(logEntry).toHaveTextContent('Calories: 150');
    });
  });

  test('displays an error if fields are empty', () => {
    jest.spyOn(Alert, 'alert'); // Spy on Alert.alert
    render(<DietScreen />);
    const logButton = screen.getByText('Log Diet');
    fireEvent.press(logButton);

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill out both fields');
  });

  test('displays the correct total calories', async () => {
    render(<DietScreen />);
    const foodInput = screen.getByPlaceholderText('Food Item');
    const caloriesInput = screen.getByPlaceholderText('Calories');
    const logButton = screen.getByText('Log Diet');

    // Log first entry
    fireEvent.changeText(foodInput, 'Apple');
    fireEvent.changeText(caloriesInput, '100');
    fireEvent.press(logButton);

    // Log second entry
    fireEvent.changeText(foodInput, 'Orange');
    fireEvent.changeText(caloriesInput, '80');
    fireEvent.press(logButton);

    await waitFor(() => {
      const totalCaloriesText = screen.getByText('Total Calories: 180'); 
      expect(totalCaloriesText).toBeTruthy();
    
  });
});