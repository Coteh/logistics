import React from 'react';
import 'jest';
import { render } from '@testing-library/react';
import Calendar from './Calendar';
import DriverTask from '../../domain/model/DriverTask';
import { DriverTaskType } from '../../domain/type/DriverTaskType';

describe('Calendar', () => {
  it('should render without crash', () => {
    render(<Calendar tasks={[]} />);
  });
  it('should render a driver task', () => {
    let task: DriverTask = {
      id: 1,
      type: DriverTaskType.DELIVER,
      start: 1,
      end: 2,
      day: 1,
      week: 1,
      userID: 3,
      location: 'Toronto',
    };

    const { getByText } = render(<Calendar tasks={[task]} />);

    getByText('Deliver Goods');
  });
});
