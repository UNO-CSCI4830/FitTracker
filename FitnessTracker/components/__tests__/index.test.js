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
  
      jest.restoreAllMocks(); // Reset mock after test
    });
  });