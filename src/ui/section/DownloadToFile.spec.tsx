import React from 'react';
import 'jest';
import DownloadToFile from './DownloadToFile';
import {
  render,
  fireEvent,
  getAllByRole,
  getByText,
} from '@testing-library/react';
import { AppContext } from '../context/AppContext';

describe('DownloadToFile', () => {
  it('should render without crash', () => {
    render(<DownloadToFile userID={0} submitFunc={() => {}} />);
  });
  it('should trigger download action when download button clicked', () => {
    const stub = jest.fn();
    const { getByTestId, getByText } = render(
      <DownloadToFile userID={0} submitFunc={stub} />,
    );

    expect(stub).not.toHaveBeenCalled();

    fireEvent.change(getByTestId('interval'), {
      target: {
        value: '2',
      },
    });

    fireEvent.click(getByText('Submit'));

    expect(stub).toHaveBeenCalledTimes(1);
  });
  it('should display day interval options in dropdown', () => {
    const { getByTestId } = render(
      <DownloadToFile userID={0} submitFunc={() => {}} />,
    );

    const select = getByTestId('interval');
    const options = getAllByRole(select, 'option');
    expect(options).toHaveLength(5);
    getByText(options[0], '2 days');
    getByText(options[1], '4 days');
    getByText(options[2], '7 days');
    getByText(options[3], '14 days');
    getByText(options[4], '28 days');
  });
  it('should pass day interval options to download action when download button clicked', () => {
    const stub = jest.fn();
    const { getByTestId, getByText } = render(
      <DownloadToFile userID={0} submitFunc={stub} />,
    );

    expect(stub).not.toHaveBeenCalled();

    fireEvent.change(getByTestId('interval'), {
      target: {
        value: '28',
      },
    });

    fireEvent.click(getByText('Submit'));

    expect(stub).toHaveBeenLastCalledWith(0, 28);
  });
  it('should prevent user from downloading with invalid day interval option', () => {
    const submitStub = jest.fn();
    const notificationStub = jest.fn();
    const { getByTestId, getByText } = render(
      <AppContext.Provider
        value={{
          displayNotification: notificationStub,
          openOverlay: () => {},
          closeOverlay: () => {},
          performTaskEdit: () => {},
        }}
      >
        <DownloadToFile userID={0} submitFunc={submitStub} />
      </AppContext.Provider>,
    );

    expect(notificationStub).not.toHaveBeenCalled();
    expect(submitStub).not.toHaveBeenCalled();

    fireEvent.change(getByTestId('interval'), {
      target: {
        value: '25',
      },
    });

    fireEvent.click(getByText('Submit'));

    expect(submitStub).not.toHaveBeenCalled();
    expect(notificationStub).toHaveBeenCalled();
  });
});
