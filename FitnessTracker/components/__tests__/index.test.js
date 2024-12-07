import React from "react";
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import FitnessTrackerScreen from '../../app/(tabs)/index';
import { useEffect } from "react";
import { Pedometer } from 'expo-sensors';

  describe('FitnessTrackerScreen', () => {
    it('displays the correct greeting based on the time of day', () => {
      jest.spyOn(global, 'Date').mockImplementation(() => ({
        getHours: () => 9,
      }));
  
      const { getByText } = render(<FitnessTrackerScreen />);
      expect(getByText('Good Morning')).toBeTruthy();
  
      jest.restoreAllMocks();
    });
  });

  describe('FitnessTrackerScreen Default Stats', () => {
    it('renders "Steps" with a default value of 0', () => {
      const { getAllByText } = render(<FitnessTrackerScreen />);
      expect(getAllByText('Steps')).toBeTruthy();
      const allZeroValues = getAllByText('0');
      expect(allZeroValues[0]).toBeTruthy(); // Steps rendered
    });
  
    it('renders "Distance" with a default value of 0.00 km', () => {
      const { getByText } = render(<FitnessTrackerScreen />);
      expect(getByText('Distance')).toBeTruthy();
      expect(getByText('0.00 km')).toBeTruthy(); // Distance rendered
    });
  
    it('renders "Calories" with a default value of 0', () => {
      const { getAllByText } = render(<FitnessTrackerScreen />);
      expect(getAllByText('Calories')).toBeTruthy();
      const allZeroValues = getAllByText('0');
      expect(allZeroValues[1]).toBeTruthy(); // Calories rendered
    });
  });

  jest.mock('expo-sensors', () => ({
    Pedometer: {
      requestPermissionsAsync: jest.fn(),
      isAvailableAsync: jest.fn(),
      watchStepCount: jest.fn(),
    },
  }));
  
  describe('Activity button', () => {
    it('should trigger the activity tracking on button press', async () => {
      // Mocking the return values of the Pedometer methods
      Pedometer.requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
      Pedometer.isAvailableAsync.mockResolvedValue(true);
      Pedometer.watchStepCount.mockImplementation((callback) => {
        // Mock a step count update
        callback({ steps: 100 });
        return { remove: jest.fn() };
      });
      
      const { getByText } = render(<FitnessTrackerScreen />);

      const trackActivityButton = getByText('Track Activity');
      fireEvent.press(trackActivityButton);

      expect(Pedometer.requestPermissionsAsync).toHaveBeenCalled();
      expect(Pedometer.isAvailableAsync).toHaveBeenCalled();
      expect(Pedometer.watchStepCount).toHaveBeenCalled();
    });
  });