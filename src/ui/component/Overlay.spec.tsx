import React from 'react';
import 'jest';
import { render } from '@testing-library/react';
import Overlay from './Overlay';

describe('Overlay', () => {
  it('renders without crash', () => {
    render(<Overlay container={<></>} />);
  });
  it('can render an inner component without crash', () => {
    let innerComponent = <div>Something</div>;
    render(<Overlay container={innerComponent} />);
  });
  it('can render context menu items', () => {
    let menuItems = [<div>Something</div>];
    render(<Overlay container={<></>} contextMenuItems={menuItems} />);
  });
});
