import React from 'react';
import 'jest';
import { render } from '@testing-library/react';
import Calendar from './Calendar';

describe('Calendar', () => {
  it('should render without crash', () => {
    render(<Calendar tasks={[]} />);
  });
  it('should render a driver task', () => {
    throw new Error('Not implemented');
  });
  it('should allow user to update a task', () => {
    throw new Error('Not implemented');
  });
  it('should not allow user to update a task if validation failed', () => {
    throw new Error('Not implemented');
  });
  it('should allow user to delete a task', () => {
    throw new Error('Not implemented');
  });
});
