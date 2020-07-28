import React, { useState } from 'react';
import DriverTask from '../../domain/model/DriverTask';
import { driverTaskString } from '../../domain/type/DriverTaskType';
import { hoursToTimeString } from '../../util/time_util';
import Button from '../component/Button';

interface IProps {
  conflictingTasks: DriverTask[];
  deleteTask: Function;
  retryTask: Function;
}

/**
 * Prompt that appears after adding/updating task that lists tasks that conflict with that task.
 * User can delete the conflicting tasks and retry.
 * @param props list of conflicting tasks, and functions for delete and retry
 */
export default function TaskConflict(props: IProps) {
  const { conflictingTasks, deleteTask, retryTask } = props;

  const [tasks, setTasks] = useState(conflictingTasks);

  return (
    <div
      style={{
        margin: '0 auto',
      }}
    >
      {(() => {
        if (tasks.length === 0) {
          return <span>No more conflicting tasks</span>;
        } else {
          return <span>This task conflicts with the following task(s):</span>;
        }
      })()}
      <br />
      {tasks.map((task, i) => {
        return (
          <div data-testid={`conflict_${i}`} key={`conflict_${i}`}>
            <h3>{driverTaskString(task.type)}</h3>
            <span>
              {hoursToTimeString(task.start)} - {hoursToTimeString(task.end)}
            </span>
            <Button
              label="Delete"
              onClick={() => {
                deleteTask(task.id, false);
                setTasks((tasks) => {
                  const index = tasks.indexOf(task);
                  return tasks.slice(0, index).concat(tasks.slice(index + 1));
                });
              }}
            />
          </div>
        );
      })}
      <Button onClick={() => retryTask()} label="Retry" />
    </div>
  );
}
