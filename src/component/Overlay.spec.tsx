import React from 'react';
import 'jest';
import { render } from '@testing-library/react';
import Overlay from './Overlay';

describe('Overlay', () => {
  it('renders without crash', () => {
    render(<Overlay container={<></>} />);
  });
  it('can render an inner component without crash', () => {
    throw new Error('Not implemented');
  });
  it('can render context menu items', () => {
    throw new Error('Not implemented');
  });
});
