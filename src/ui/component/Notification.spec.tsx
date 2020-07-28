import React from 'react';
import 'jest';
import { render } from '@testing-library/react';
import Notification from './Notification';

describe('Notification', () => {
  it('displays without crash', () => {
    render(<Notification message="" />);
  });
  it('displays a message', () => {
    const { getByText } = render(<Notification message="Test Message" />);

    getByText('Test Message');
  });
});
