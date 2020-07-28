import React from 'react';
import 'jest';
import { render, getByText, fireEvent } from '@testing-library/react';
import TaskConflict from './TaskConflict';
import { DriverTaskType } from '../../domain/type/DriverTaskType';

describe('TaskConflict', () => {
  it('should render without crash', () => {
    render(
      <TaskConflict
        conflictingTasks={[]}
        deleteTask={() => {}}
        retryTask={() => {}}
      />,
    );
  });
  it('should display conflicting tasks', () => {
    const { getByTestId } = render(
      <TaskConflict
        conflictingTasks={[
          {
            id: 1,
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            day: 1,
            week: 1,
            location: 'Toronto',
            userID: 1,
          },
          {
            id: 2,
            type: DriverTaskType.PICKUP,
            start: 4,
            end: 6,
            day: 1,
            week: 1,
            location: 'Toronto',
            userID: 1,
          },
        ]}
        deleteTask={() => {}}
        retryTask={() => {}}
      />,
    );

    const task1 = getByTestId('conflict_0');
    getByText(task1, 'Deliver Goods');
    getByText(task1, '12:00 AM - 02:00 AM');
    const task2 = getByTestId('conflict_1');
    getByText(task2, 'Pickup Goods');
    getByText(task2, '03:00 AM - 05:00 AM');
  });
  it('should provide options to delete the conflicting tasks', () => {
    const { getByTestId } = render(
      <TaskConflict
        conflictingTasks={[
          {
            id: 1,
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            day: 1,
            week: 1,
            location: 'Toronto',
            userID: 1,
          },
          {
            id: 2,
            type: DriverTaskType.PICKUP,
            start: 4,
            end: 6,
            day: 1,
            week: 1,
            location: 'Toronto',
            userID: 1,
          },
        ]}
        deleteTask={() => {}}
        retryTask={() => {}}
      />,
    );

    const task1 = getByTestId('conflict_0');
    getByText(task1, 'Delete');
    const task2 = getByTestId('conflict_1');
    getByText(task2, 'Delete');
  });
  it('should call delete function when delete button is clicked for conflicting task', () => {
    const stub = jest.fn();

    const { getByTestId } = render(
      <TaskConflict
        conflictingTasks={[
          {
            id: 1,
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            day: 1,
            week: 1,
            location: 'Toronto',
            userID: 1,
          },
          {
            id: 2,
            type: DriverTaskType.PICKUP,
            start: 4,
            end: 6,
            day: 1,
            week: 1,
            location: 'Toronto',
            userID: 1,
          },
        ]}
        deleteTask={stub}
        retryTask={() => {}}
      />,
    );

    expect(stub).not.toBeCalled();

    const task1 = getByTestId('conflict_0');
    const del1 = getByText(task1, 'Delete');
    const task2 = getByTestId('conflict_1');
    const del2 = getByText(task2, 'Delete');

    fireEvent.click(del2);
    expect(stub).toHaveBeenLastCalledWith(2, false);

    fireEvent.click(del1);
    expect(stub).toHaveBeenLastCalledWith(1, false);
  });
  it('should call retry function when retry button is clicked', () => {
    const stub = jest.fn();

    const { getByText } = render(
      <TaskConflict
        conflictingTasks={[
          {
            id: 1,
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            day: 1,
            week: 1,
            location: 'Toronto',
            userID: 1,
          },
          {
            id: 2,
            type: DriverTaskType.PICKUP,
            start: 4,
            end: 6,
            day: 1,
            week: 1,
            location: 'Toronto',
            userID: 1,
          },
        ]}
        deleteTask={() => {}}
        retryTask={stub}
      />,
    );

    fireEvent.click(getByText('Retry'));
    expect(stub).toHaveBeenCalledTimes(1);
  });
  it('should say no more conflicting tasks if all tasks have been deleted', () => {
    const { getByText, queryByText } = render(
      <TaskConflict
        conflictingTasks={[
          {
            id: 1,
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            day: 1,
            week: 1,
            location: 'Toronto',
            userID: 1,
          },
        ]}
        deleteTask={() => {}}
        retryTask={() => {}}
      />,
    );

    expect(queryByText('No more conflicting tasks')).toBeNull();
    fireEvent.click(getByText('Delete'));
    getByText('No more conflicting tasks');
  });
});
