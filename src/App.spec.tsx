import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render without crash', () => {
    render(<App />);
  });
  it('should allow user to create a task', () => {
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
