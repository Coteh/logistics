import React from 'react';
import 'jest';
import { render } from '@testing-library/react';
import CalendarColumn from './CalendarColumn';

describe('CalendarColumn', () => {
  it('should render without crash', () => {
    render(<CalendarColumn cellWidth={60} cellHeight={30} />);
  });
  it('should render rows', () => {
    throw new Error('Not implemented');
  });
  it('should render row text', () => {
    throw new Error('Not implemented');
  });
});
