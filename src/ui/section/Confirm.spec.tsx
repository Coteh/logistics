import React from 'react';
import 'jest';
import { render, fireEvent } from '@testing-library/react';
import Confirm from './Confirm';

describe('Confirm', () => {
  it('should render without crash', () => {
    render(<Confirm label="" yesFunc={() => {}} noFunc={() => {}} />);
  });
  it('should display label', () => {
    const { getByText } = render(
      <Confirm label="My Label" yesFunc={() => {}} noFunc={() => {}} />,
    );

    getByText('My Label');
  });
  it("should trigger 'yes' action when 'yes' button clicked", () => {
    let stub = jest.fn();

    const { getByText } = render(
      <Confirm label="My Label" yesFunc={stub} noFunc={() => {}} />,
    );

    fireEvent.click(getByText('Yes'));
    expect(stub).toHaveBeenCalledTimes(1);
  });
  it("should trigger 'no' action when 'no' button clicked", () => {
    let stub = jest.fn();

    const { getByText } = render(
      <Confirm label="My Label" yesFunc={() => {}} noFunc={stub} />,
    );

    fireEvent.click(getByText('No'));
    expect(stub).toHaveBeenCalledTimes(1);
  });
});
