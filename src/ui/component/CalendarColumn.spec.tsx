import React from 'react';
import 'jest';
import { render, getByText } from '@testing-library/react';
import CalendarColumn from './CalendarColumn';

describe('CalendarColumn', () => {
  it('should render without crash', () => {
    render(<CalendarColumn cellWidth={60} cellHeight={30} />);
  });
  it('should render rows', () => {
    const { getAllByTestId } = render(
      <CalendarColumn
        rows={['row 1', 'row 2', 'row 3']}
        cellWidth={60}
        cellHeight={30}
      />,
    );

    expect(getAllByTestId('cell')).toHaveLength(3);
  });
  it('should render row text', () => {
    const { getAllByTestId } = render(
      <CalendarColumn
        rows={['row 1', 'row 2', 'row 3']}
        cellWidth={60}
        cellHeight={30}
      />,
    );

    let rows = getAllByTestId('cell');
    getByText(rows[0], 'row 1');
    getByText(rows[1], 'row 2');
    getByText(rows[2], 'row 3');
  });
});
