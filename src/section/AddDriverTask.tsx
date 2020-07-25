import React, { useState, useContext } from 'react';
import { hoursToTimeString } from '../util/time_util';
import { DriverTaskInput } from '../input/DriverTaskInput';
import { DriverTaskType, driverTaskString } from '../type/DriverTaskType';
import { AppContext } from '../App';

interface IProps {
  defaultDay?: number;
  defaultWeek?: number;
  addNewTaskFunc: Function;
}

function populateDiscreteTimeOptions() {
  return (
    <>
      <option value="">Please select a time</option>
      {new Array(24).fill(0).map((_, i) => {
        return (
          <option key={`dtime_${i}`} value={i + 1}>
            {hoursToTimeString(i + 1)}
          </option>
        );
      })}
    </>
  );
}

function populateDiscreteWeekOptions() {
  return (
    <>
      <option value="">Please select a week</option>
      {new Array(52).fill(0).map((_, i) => {
        return (
          <option key={`dweek_${i}`} value={i + 1}>
            {i + 1}
          </option>
        );
      })}
    </>
  );
}

function populateDiscreteDayOptions() {
  const daysArr: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  return (
    <>
      <option value="">Please select a day</option>
      {new Array(7).fill(0).map((_, i) => {
        return (
          <option key={`dday_${i}`} value={i + 1}>
            {daysArr[i]}
          </option>
        );
      })}
    </>
  );
}

export default function AddDriverTask(props: IProps) {
  const { defaultDay, defaultWeek, addNewTaskFunc } = props;

  const [taskType, setTaskType] = useState(DriverTaskType.NONE);
  const [startTime, setStartTime] = useState(1);
  const [endTime, setEndTime] = useState(3);
  const [location, setLocation] = useState('Toronto');
  const [day, setDay] = useState(defaultDay || 1);
  const [week, setWeek] = useState(defaultWeek || 1);

  const app = useContext(AppContext);

  function onSubmit() {
    // TODO propagate error message back to App
    if (!taskType) {
      app.displayNotification('Please select a task type');
      return;
    }
    if (!startTime) {
      app.displayNotification('Please select a start time');
      return;
    }
    if (!endTime) {
      app.displayNotification('Please select a end time');
      return;
    }
    if (!location) {
      app.displayNotification('Please enter a location');
      return;
    }
    if (!day) {
      app.displayNotification('Please select a day');
      return;
    }
    if (!week) {
      app.displayNotification('Please select a week');
      return;
    }
    let args: DriverTaskInput = {
      type: taskType,
      start: startTime,
      end: endTime,
      day: day,
      week: week,
      userID: 1,
      location: 'Toronto',
    };
    addNewTaskFunc(args);
  }

  return (
    <div>
      <h2>Add New Task</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <table
          style={{
            textAlign: 'left',
          }}
        >
          <tbody>
            <tr>
              <td>
                <label>Task Type</label>
              </td>
              <td>
                <select
                  name="task-type"
                  value={taskType}
                  onChange={(e) => setTaskType(parseInt(e.target.value))}
                >
                  <option value="">Please select an option</option>
                  <option value={DriverTaskType.PICKUP}>
                    {driverTaskString(DriverTaskType.PICKUP)}
                  </option>
                  <option value={DriverTaskType.DELIVER}>
                    {driverTaskString(DriverTaskType.DELIVER)}
                  </option>
                  <option value={DriverTaskType.OTHER}>
                    {driverTaskString(DriverTaskType.OTHER)}
                  </option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label>Start Time</label>
              </td>
              <td>
                <select
                  name="start-time"
                  value={startTime}
                  onChange={(e) => setStartTime(parseInt(e.target.value))}
                >
                  {populateDiscreteTimeOptions()}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label>End Time</label>
              </td>
              <td>
                <select
                  name="end-time"
                  value={endTime}
                  onChange={(e) => setEndTime(parseInt(e.target.value))}
                >
                  {populateDiscreteTimeOptions()}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label>Week</label>
              </td>
              <td>
                <select
                  name="week"
                  value={week}
                  onChange={(e) => setWeek(parseInt(e.target.value))}
                >
                  {populateDiscreteWeekOptions()}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label>Day</label>
              </td>
              <td>
                <select
                  name="day"
                  value={day}
                  onChange={(e) => setDay(parseInt(e.target.value))}
                >
                  {populateDiscreteDayOptions()}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label>Location</label>
              </td>
              <td>
                <input
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                ></input>
                <br />
              </td>
            </tr>
          </tbody>
        </table>
        <button onClick={onSubmit}>Submit</button>
      </form>
    </div>
  );
}
