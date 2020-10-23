import React from 'react';
import 'jest';
import {
  render,
  getByText,
  getAllByRole,
  fireEvent,
} from '@testing-library/react';
import EditDriverTask from './EditDriverTask';
import { hoursToTimeString } from '../../util/time_util';
import { DriverTaskInput } from '../../domain/input/DriverTaskInput';
import { DriverTaskType } from '../../domain/type/DriverTaskType';
import { AppContext } from '../context/AppContext';

describe('EditDriverTask', () => {
  it('should render without crash', () => {
    render(<EditDriverTask label="" userID={0} submitFunc={() => {}} />);
  });
  it('should display driver task type options in dropdown', () => {
    const { getByTestId } = render(
      <EditDriverTask label="" userID={0} submitFunc={() => {}} />,
    );

    const select = getByTestId('task-type');
    const options = getAllByRole(select, 'option');
    expect(options).toHaveLength(4);
    getByText(options[1], 'Pickup Goods');
    getByText(options[2], 'Deliver Goods');
    getByText(options[3], 'Other');
  });
  it('should display time options in start time dropdown', () => {
    const { getByTestId } = render(
      <EditDriverTask label="" userID={0} submitFunc={() => {}} />,
    );

    const select = getByTestId('start-time');
    const options = getAllByRole(select, 'option');
    expect(options).toHaveLength(25);
    for (let i = 0; i < 24; i++) {
      getByText(options[i + 1], hoursToTimeString(i + 1));
    }
  });
  it('should display time options in end time dropdown', () => {
    const { getByTestId } = render(
      <EditDriverTask label="" userID={0} submitFunc={() => {}} />,
    );

    const select = getByTestId('end-time');
    const options = getAllByRole(select, 'option');
    expect(options).toHaveLength(25);
    for (let i = 0; i < 24; i++) {
      getByText(options[i + 1], hoursToTimeString(i + 1));
    }
  });
  it('should display day options in day dropdown', () => {
    const { getByTestId } = render(
      <EditDriverTask label="" userID={0} submitFunc={() => {}} />,
    );

    const select = getByTestId('day');
    const options = getAllByRole(select, 'option');
    expect(options).toHaveLength(8);
    getByText(options[1], 'Sunday');
    getByText(options[2], 'Monday');
    getByText(options[3], 'Tuesday');
    getByText(options[4], 'Wednesday');
    getByText(options[5], 'Thursday');
    getByText(options[6], 'Friday');
    getByText(options[7], 'Saturday');
  });
  it('should display week options in week dropdown', () => {
    const { getByTestId } = render(
      <EditDriverTask label="" userID={0} submitFunc={() => {}} />,
    );

    const select = getByTestId('week');
    const options = getAllByRole(select, 'option');
    expect(options).toHaveLength(53);
    for (let i = 0; i < 52; i++) {
      getByText(options[i + 1], (i + 1).toString());
    }
  });
  it('should call submit function if all options valid', () => {
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
        <EditDriverTask label="" userID={0} submitFunc={submitStub} />,
      </AppContext.Provider>,
    );

    expect(submitStub).not.toHaveBeenCalled();

    fireEvent.change(getByTestId('task-type'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('start-time'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('end-time'), {
      target: {
        value: '3',
      },
    });
    fireEvent.change(getByTestId('day'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('week'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('location'), {
      target: {
        value: 'Toronto',
      },
    });

    fireEvent.click(getByText('Submit'));

    expect(notificationStub).not.toHaveBeenCalled();
    expect(submitStub).toHaveBeenCalledTimes(1);
  });
  it('should send options to submit function', () => {
    const submitStub = jest.fn();
    const { getByTestId, getByText } = render(
      <EditDriverTask label="" userID={0} submitFunc={submitStub} />,
    );

    expect(submitStub).not.toHaveBeenCalled();
    const newDescription = 'New description';

    fireEvent.change(getByTestId('task-type'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('start-time'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('end-time'), {
      target: {
        value: '3',
      },
    });
    fireEvent.change(getByTestId('day'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('week'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('location'), {
      target: {
        value: 'New York',
      },
    });
    fireEvent.change(getByTestId('description'), {
      target: {
        value: newDescription,
      },
    });

    fireEvent.click(getByText('Submit'));

    const expectedArgs: DriverTaskInput = {
      type: DriverTaskType.PICKUP,
      start: 1,
      end: 3,
      day: 1,
      week: 1,
      location: 'New York',
      userID: 0,
      description: newDescription,
    };

    expect(submitStub).toHaveBeenLastCalledWith(expectedArgs);
  });
  it('should not send to submit function if input validation failed', () => {
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
        <EditDriverTask label="" userID={0} submitFunc={submitStub} />,
      </AppContext.Provider>,
    );

    expect(notificationStub).not.toHaveBeenCalled();
    expect(submitStub).not.toHaveBeenCalled();

    fireEvent.change(getByTestId('task-type'), {
      target: {
        value: '',
      },
    });
    fireEvent.change(getByTestId('start-time'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('end-time'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('day'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('week'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('location'), {
      target: {
        value: 'Toronto',
      },
    });

    fireEvent.click(getByText('Submit'));

    expect(notificationStub).toHaveBeenCalled();
    expect(submitStub).toHaveBeenCalledTimes(0);
  });
  it('should prevent submission and notify user about invalid task type', () => {
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
        <EditDriverTask label="" userID={0} submitFunc={submitStub} />,
      </AppContext.Provider>,
    );

    expect(notificationStub).not.toHaveBeenCalled();

    fireEvent.change(getByTestId('task-type'), {
      target: {
        value: '',
      },
    });
    fireEvent.change(getByTestId('start-time'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('end-time'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('day'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('week'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('location'), {
      target: {
        value: 'Toronto',
      },
    });

    fireEvent.click(getByText('Submit'));

    expect(notificationStub).toHaveBeenCalledTimes(1);
    expect(notificationStub).toHaveBeenLastCalledWith(
      expect.stringContaining('type'),
    );
    expect(submitStub).not.toHaveBeenCalled();
  });
  it('should prevent submission and notify user about invalid start time', () => {
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
        <EditDriverTask label="" userID={0} submitFunc={submitStub} />,
      </AppContext.Provider>,
    );

    expect(notificationStub).not.toHaveBeenCalled();

    fireEvent.change(getByTestId('task-type'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('start-time'), {
      target: {
        value: '',
      },
    });
    fireEvent.change(getByTestId('end-time'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('day'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('week'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('location'), {
      target: {
        value: 'Toronto',
      },
    });

    fireEvent.click(getByText('Submit'));

    expect(notificationStub).toHaveBeenCalledTimes(1);
    expect(notificationStub).toHaveBeenLastCalledWith(
      expect.stringContaining('start time'),
    );
    expect(submitStub).not.toHaveBeenCalled();
  });
  it('should prevent submission and notify user about invalid end time', () => {
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
        <EditDriverTask label="" userID={0} submitFunc={submitStub} />,
      </AppContext.Provider>,
    );

    expect(notificationStub).not.toHaveBeenCalled();

    fireEvent.change(getByTestId('task-type'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('start-time'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('end-time'), {
      target: {
        value: '',
      },
    });
    fireEvent.change(getByTestId('day'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('week'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('location'), {
      target: {
        value: 'Toronto',
      },
    });

    fireEvent.click(getByText('Submit'));

    expect(notificationStub).toHaveBeenCalledTimes(1);
    expect(notificationStub).toHaveBeenLastCalledWith(
      expect.stringContaining('end time'),
    );
    expect(submitStub).not.toHaveBeenCalled();
  });
  it('should prevent submission and notify user about invalid day', () => {
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
        <EditDriverTask label="" userID={0} submitFunc={submitStub} />,
      </AppContext.Provider>,
    );

    expect(notificationStub).not.toHaveBeenCalled();

    fireEvent.change(getByTestId('task-type'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('start-time'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('end-time'), {
      target: {
        value: '3',
      },
    });
    fireEvent.change(getByTestId('day'), {
      target: {
        value: '',
      },
    });
    fireEvent.change(getByTestId('week'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('location'), {
      target: {
        value: 'Toronto',
      },
    });

    fireEvent.click(getByText('Submit'));

    expect(notificationStub).toHaveBeenCalledTimes(1);
    expect(notificationStub).toHaveBeenLastCalledWith(
      expect.stringContaining('day'),
    );
    expect(submitStub).not.toHaveBeenCalled();
  });
  it('should prevent submission and notify user about invalid week', () => {
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
        <EditDriverTask label="" userID={0} submitFunc={submitStub} />,
      </AppContext.Provider>,
    );

    expect(notificationStub).not.toHaveBeenCalled();

    fireEvent.change(getByTestId('task-type'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('start-time'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('end-time'), {
      target: {
        value: '3',
      },
    });
    fireEvent.change(getByTestId('day'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('week'), {
      target: {
        value: '',
      },
    });
    fireEvent.change(getByTestId('location'), {
      target: {
        value: 'Toronto',
      },
    });

    fireEvent.click(getByText('Submit'));

    expect(notificationStub).toHaveBeenCalledTimes(1);
    expect(notificationStub).toHaveBeenLastCalledWith(
      expect.stringContaining('week'),
    );
    expect(submitStub).not.toHaveBeenCalled();
  });
  it('should prevent submission and notify user about invalid location', () => {
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
        <EditDriverTask label="" userID={0} submitFunc={submitStub} />,
      </AppContext.Provider>,
    );

    expect(notificationStub).not.toHaveBeenCalled();

    fireEvent.change(getByTestId('task-type'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('start-time'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('end-time'), {
      target: {
        value: '3',
      },
    });
    fireEvent.change(getByTestId('day'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('week'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('location'), {
      target: {
        value: '',
      },
    });

    fireEvent.click(getByText('Submit'));

    expect(notificationStub).toHaveBeenCalledTimes(1);
    expect(notificationStub).toHaveBeenLastCalledWith(
      expect.stringContaining('location'),
    );
    expect(submitStub).not.toHaveBeenCalled();
  });
  it('should prevent submission and notify user about start time and end time being the same', () => {
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
        <EditDriverTask label="" userID={0} submitFunc={submitStub} />,
      </AppContext.Provider>,
    );

    expect(notificationStub).not.toHaveBeenCalled();

    fireEvent.change(getByTestId('task-type'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('start-time'), {
      target: {
        value: '5',
      },
    });
    fireEvent.change(getByTestId('end-time'), {
      target: {
        value: '5',
      },
    });
    fireEvent.change(getByTestId('day'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('week'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('location'), {
      target: {
        value: 'Toronto',
      },
    });

    fireEvent.click(getByText('Submit'));

    expect(notificationStub).toHaveBeenCalledTimes(1);
    expect(notificationStub).toHaveBeenLastCalledWith(
      expect.stringContaining('time'),
    );
    expect(submitStub).not.toHaveBeenCalled();
  });
  it('should prevent submission and notify user about start time occurring after end time', () => {
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
        <EditDriverTask label="" userID={0} submitFunc={submitStub} />,
      </AppContext.Provider>,
    );

    expect(notificationStub).not.toHaveBeenCalled();

    fireEvent.change(getByTestId('task-type'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('start-time'), {
      target: {
        value: '8',
      },
    });
    fireEvent.change(getByTestId('end-time'), {
      target: {
        value: '5',
      },
    });
    fireEvent.change(getByTestId('day'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('week'), {
      target: {
        value: '1',
      },
    });
    fireEvent.change(getByTestId('location'), {
      target: {
        value: 'Toronto',
      },
    });

    fireEvent.click(getByText('Submit'));

    expect(notificationStub).toHaveBeenCalledTimes(1);
    expect(notificationStub).toHaveBeenLastCalledWith(
      expect.stringContaining('time'),
    );
    expect(submitStub).not.toHaveBeenCalled();
  });
});
