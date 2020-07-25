import React from 'react';
import { driverTaskString } from '../type/DriverTaskType';
import DriverTask from '../model/DriverTask';
import { createHoursArr, hoursToTimeString } from '../util/time_util';
import CalendarColumn from './CalendarColumn';
import CalendarHeader from './CalendarHeader';

interface IProps {
  tasks: DriverTask[];
}

export default function Calendar(props: IProps) {
  const hoursArr: number[] = createHoursArr();
  const daysArr: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const cellWidth = 120;
  const cellHeight = 60;
  const padding = 8;

  const { tasks } = props;

  return (
    <>
      <div
        style={{
          maxWidth: '100vw',
          padding: padding + 'px',
          display: 'flex',
          border: '1px solid black',
        }}
      >
        <CalendarHeader cellWidth={cellWidth} cellHeight={cellHeight} />
        {daysArr.map((v, i) => (
          <div
            key={`header_${i}`}
            style={{
              position: 'relative',
            }}
          >
            <CalendarHeader
              cellWidth={cellWidth}
              cellHeight={cellHeight}
              header={v}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          maxWidth: '100vw',
          padding: padding + 'px',
          display: 'flex',
          height: '400px',
          overflowY: 'scroll',
          border: '1px solid black',
        }}
      >
        <CalendarColumn
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          rows={hoursArr.map((hour) => hoursToTimeString(hour))}
        />
        {daysArr.map((v, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
            }}
          >
            <CalendarColumn
              cellWidth={cellWidth}
              cellHeight={cellHeight}
              rows={new Array(24).fill('')}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }}
            >
              {tasks
                .filter((task) => task.day === i + 1)
                .map((task) => {
                  return (
                    <div
                      key={`task_${task.id}`}
                      style={{
                        position: 'absolute',
                        backgroundColor: '#3174ad',
                        borderRadius: '8px',
                        top: cellHeight * (task.start - 1) + 'px',
                        height: (task.end - task.start) * cellHeight + 'px',
                        width: '100%',
                      }}
                    >
                      <span
                        style={{
                          color: 'white',
                        }}
                      >
                        {driverTaskString(task.type)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
