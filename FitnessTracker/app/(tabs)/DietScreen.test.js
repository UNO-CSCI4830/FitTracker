import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import DietScreen from './DietScreen';
import { Alert } from 'react-native';

describe('DietScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the screen title', () => {
    render(<DietScreen />);
    const titleElement = screen.getByText('Log Diet', {
      selector: (textElement) => 
        textElement.props.style.fontWeight === 'bold' && 
        textElement.props.style.fontSize === 24, 
    });
    expect(titleElement).toBeTruthy();
  });

  test('allows user to input food item and calories', () => {
    render(<DietScreen />);
    const foodInput = screen.getByPlaceholderText('Food Item');
    const caloriesInput = screen.getByPlaceholderText('Calories');

    fireEvent.changeText(foodInput, 'Apple');
    fireEvent.changeText(caloriesInput, '100');

    expect(foodInput.props.value).toBe('Apple');
    expect(caloriesInput.props.value).toBe('100');
  });

  test('logs a diet entry successfully', async () => {
    jest.spyOn(Alert, 'alert');
    render(<DietScreen />);
    const foodInput = screen.getByPlaceholderText('Food Item');
    const caloriesInput = screen.getByPlaceholderText('Calories');
    const logButton = screen.getByRole('button', { name: /Log Diet/i });

    fireEvent.changeText(foodInput, 'Banana');
    fireEvent.changeText(caloriesInput, '150');
    fireEvent.press(logButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Diet Logged',
        `Food: Banana, Calories: 150, Date: ${new Date().toDateString()}`
      );
    });
  });

  test('displays an error if fields are empty', () => {
    jest.spyOn(Alert, 'alert');
    render(<DietScreen />);
    const logButton = screen.getByRole('button', { name: /Log Diet/i });
    fireEvent.press(logButton);

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill out both fields');
  });

  test('displays the correct total calories', async () => {
    render(<DietScreen />);
    const foodInput = screen.getByPlaceholderText('Food Item');
    const caloriesInput = screen.getByPlaceholderText('Calories');
    const logButton = screen.getByRole('button', { name: /Log Diet/i });

    fireEvent.changeText(foodInput, 'Apple');
    fireEvent.changeText(caloriesInput, '100');
    fireEvent.press(logButton);

    fireEvent.changeText(foodInput, 'Orange');
    fireEvent.changeText(caloriesInput, '80');
    fireEvent.press(logButton);

    const totalCaloriesText = await waitFor(() => screen.getByText('Total Calories: 180'));
    expect(totalCaloriesText).toBeTruthy();
  });

  test('updates goal calories and displays goal status', () => {
    render(<DietScreen />);
    const goalInput = screen.getByPlaceholderText('Set Your Goal (Calories)');
    const foodInput = screen.getByPlaceholderText('Food Item');
    const caloriesInput = screen.getByPlaceholderText('Calories');
    const logButton = screen.getByRole('button', { name: /Log Diet/i });

    fireEvent.changeText(goalInput, '200');
    expect(goalInput.props.value).toBe('200');

    fireEvent.changeText(foodInput, 'Apple');
    fireEvent.changeText(caloriesInput, '100');
    fireEvent.press(logButton);

    expect(screen.getByText('Goal met!')).toBeTruthy();

    fireEvent.changeText(foodInput, 'Pizza');
    fireEvent.changeText(caloriesInput, '300');
    fireEvent.press(logButton);

    expect(screen.getByText('Goal not met. Try again tomorrow!')).toBeTruthy();
  });
});