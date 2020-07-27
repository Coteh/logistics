import React from 'react';
import 'jest';
import { render } from '@testing-library/react';
import CalendarHeader from './CalendarHeader';

describe('CalendarColumn', () => {
  it('should render without crash', () => {
    render(<CalendarHeader cellWidth={60} cellHeight={30} />);
  });
  it('should render a header', () => {
    const { getByTestId } = render(
      <CalendarHeader header="Test Header" cellWidth={60} cellHeight={30} />,
    );

    getByTestId('cell');
  });
  it('should render header text', () => {
    const { getByText } = render(
      <CalendarHeader header="Test Header" cellWidth={60} cellHeight={30} />,
    );

    getByText('Test Header');
  });
});
