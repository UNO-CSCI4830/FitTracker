import React from "react";
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import FitnessTrackerScreen from '../../app/(tabs)/index';

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