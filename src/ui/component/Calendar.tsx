import React, { useContext, useEffect, useRef, useState } from 'react';
import { driverTaskString } from '../../domain/type/DriverTaskType';
import DriverTask from '../../domain/model/DriverTask';
import { createHoursArr, hoursToTimeString } from '../../util/time_util';
import CalendarColumn from './CalendarColumn';
import CalendarHeader from './CalendarHeader';
import { AppContext } from '../context/AppContext';
import CalendarEntry from './CalendarEntry';

interface IProps {
  cellWidth: number;
  cellHeight: number;
  tasks: DriverTask[];
  scrollTop?: number;
}

/**
 * Displays the calendar containing scheduled tasks
 * @param props width and height of cells, tasks to display on the calendar, and optional scroll value for calendar body
 */
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

  const padding = 8;

  const { cellWidth, cellHeight, tasks, scrollTop } = props;
  const [scrollLeft, setScrollLeft] = useState(0);
  const calendarRef = useRef(null);

  const app = useContext(AppContext);

  useEffect(() => {
    if (calendarRef.current) {
      (calendarRef.current! as HTMLElement).scrollTop = scrollTop || 0;
    }
  }, [scrollTop]);

  const onScroll = (e: React.UIEvent<HTMLElement>) => {
    e.stopPropagation();
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  return (
    <div>
      <div
        style={{
          padding: padding + 'px',
          display: 'flex',
          position: 'relative',
          zIndex: 10,
          backgroundColor: '#f2fdff',
          left: -scrollLeft + 'px',
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
          padding: padding + 'px',
          display: 'flex',
          height: '500px',
          overflowY: 'scroll',
        }}
        ref={calendarRef}
        onScroll={onScroll}
      >
        <CalendarColumn
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          rows={hoursArr.map((hour) => hoursToTimeString(hour))}
        />
        {daysArr.map((_, i) => (
          <div
            key={`col_day_${i}`}
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
                    <CalendarEntry
                      key={`task_${task.id}`}
                      label={driverTaskString(task.type)}
                      startY={(cellHeight + 1) * (task.start - 1)}
                      height={(task.end - task.start) * (cellHeight + 1)}
                      onClick={() => app.performTaskEdit(task)}
                    />
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
