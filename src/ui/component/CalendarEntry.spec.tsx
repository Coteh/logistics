import React from 'react';
import 'jest';
import { render, fireEvent } from '@testing-library/react';
import CalendarEntry from './CalendarEntry';

describe('CalendarEntry', () => {
  it('should render without crash', () => {
    render(<CalendarEntry label="" startY={0} height={0} />);
  });
  it('should display the label of entry', () => {
    const { getByText } = render(
      <CalendarEntry label="My Entry" startY={0} height={0} />,
    );

    getByText('My Entry');
  });
  it('should trigger onClick action when clicked', () => {
    const stub = jest.fn();
    const { getByText } = render(
      <CalendarEntry label="My Entry" startY={0} height={0} onClick={stub} />,
    );

    expect(stub).not.toHaveBeenCalled();

    fireEvent.click(getByText('My Entry'));

    expect(stub).toHaveBeenCalledTimes(1);
  });
});
