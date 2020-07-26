import React from 'react';
import 'jest';
import { render, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('should render without crash', () => {
    render(<Button />);
  });
  it('should display label within button', () => {
    const { getByText } = render(<Button label="Test Label" />);

    getByText('Test Label');
  });
  it('should trigger onClick event', () => {
    const stub = jest.fn();
    const { getByRole } = render(<Button onClick={stub} />);

    fireEvent.click(getByRole('button'));
    expect(stub).toHaveBeenCalledTimes(1);
  });
});
