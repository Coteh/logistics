import React from 'react';
import { render, waitFor } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render without crash', async () => {
    render(<App />);
    await waitFor(() => {});
  });
});
