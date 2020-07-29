import React, { useState, useEffect } from 'react';
import './App.css';
import Calendar from './ui/component/Calendar';
import DriverTaskService, {
  ConflictServiceError,
} from './domain/service/DriverTaskService';
import DriverTaskFactory from './domain/factory/DriverTaskFactory';
import IdGenerator from './domain/gen/IdGenerator';
import { DriverTaskRepository } from './domain/repository/DriverTaskRepository';
import User from './domain/model/User';
import { UserType } from './domain/type/UserType';
import Overlay from './ui/component/Overlay';
import EditDriverTask from './ui/section/EditDriverTask';
import { DriverTaskInput } from './domain/input/DriverTaskInput';
import DriverTask from './domain/model/DriverTask';
import ServiceError, { ServiceErrorType } from './domain/service/ServiceError';
import DriverTaskValidator from './domain/validator/DriverTaskValidator';
import Notification from './ui/component/Notification';
import Button from './ui/component/Button';
import Confirm from './ui/section/Confirm';
import { getNumberInputFromString } from './util/input_util';
import TaskConflict from './ui/section/TaskConflict';
import { getClampedWeek } from './util/time_util';
import { AppContext } from './ui/context/AppContext';
import CSVExportService from './domain/service/CSVExportService';
import { CSVCreator } from './domain/csv/CSVCreator';
import DownloadToFile from './ui/section/DownloadToFile';
import logo from './img/truck.svg';

const driverTaskRepo: DriverTaskRepository = new DriverTaskRepository();
const driverTaskService: DriverTaskService = new DriverTaskService(
  new DriverTaskFactory(new IdGenerator()),
  driverTaskRepo,
  new DriverTaskValidator(driverTaskRepo),
);
const csvCreator = new CSVCreator();
const csvExportService: CSVExportService = new CSVExportService(
  csvCreator,
  driverTaskRepo,
);

const driverUsers = [
  new User(2, UserType.DRIVER, 'John Smith'),
  new User(3, UserType.DRIVER, 'Fierce Bob'),
  new User(4, UserType.DRIVER, 'Jane Doe'),
];

/**
 * Main App component for React application
 */
function App() {
  const [loggedInUser] = useState(new User(1, UserType.DISPATCHER));
  const [selectedUserID, setSelectedUserID] = useState(
    driverUsers?.[0].id || 1,
  );
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [tasks, setTasks] = useState<DriverTask[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [calendarScroll, setCalendarScroll] = useState(0);
  const [currOverlay, setCurrOverlay] = useState<JSX.Element | null>(null);
  const [currOverlayMenuItems, setCurrOverlayMenuItems] = useState<
    JSX.Element[]
  >([]);

  const cellWidth = 120;
  const cellHeight = 60;

  const addTaskElem = (
    <EditDriverTask
      userID={selectedUserID}
      label="Add New Task"
      submitFunc={addNewTask}
      defaultWeek={selectedWeek}
    />
  );

  useEffect(() => {
    driverTaskService
      .getWeeklyUserTasks(selectedUserID, selectedWeek, loggedInUser)
      .then((res: DriverTask[]) => {
        setTasks(res);
      })
      .catch((err: ServiceError) => {
        console.log(err.message);
      });
  }, [selectedUserID, selectedWeek, loggedInUser]);

  function scrollToTask(task: DriverTask) {
    setCalendarScroll((cellHeight + 1) * (task.start - 1) - 40);
    setSelectedWeek(task.week);
  }

  function reloadTasks() {
    driverTaskService
      .getWeeklyUserTasks(selectedUserID, selectedWeek, loggedInUser)
      .then((res: DriverTask[]) => {
        setTasks(res);
      })
      .catch((err: ServiceError) => {
        console.log(err.message);
      });
  }

  function displayNotification(message: string) {
    setNotifications((notifications) => [...notifications, message]);
    const timeout = setTimeout(() => {
      setNotifications((notifications) => {
        let offset = notifications.indexOf(message);
        return notifications
          .slice(0, offset)
          .concat(notifications.slice(offset + 1));
      });
      clearTimeout(timeout);
    }, 2000);
  }

  function openOverlay(
    overlayElem: JSX.Element,
    contextMenuItems: JSX.Element[] = [],
  ) {
    setCurrOverlay(overlayElem);
    setCurrOverlayMenuItems(contextMenuItems);
  }

  function closeOverlay() {
    setCurrOverlay(null);
    setCurrOverlayMenuItems([]);
  }

  function performTaskEdit(driverTask: DriverTask) {
    openOverlay(
      <EditDriverTask
        userID={selectedUserID}
        defaultType={driverTask.type}
        defaultStart={driverTask.start}
        defaultEnd={driverTask.end}
        defaultLocation={driverTask.location}
        defaultDay={driverTask.day}
        defaultWeek={driverTask.week}
        label="Edit Task"
        submitFunc={(args: DriverTaskInput) => updateTask(driverTask.id, args)}
      />,
      [
        <Button
          onClick={() => {
            openOverlay(
              <Confirm
                label="Are you sure you want to delete this task? It cannot be undone."
                yesFunc={() => deleteTask(driverTask.id)}
                noFunc={() => performTaskEdit(driverTask)}
              ></Confirm>,
            );
          }}
          label="Delete"
        ></Button>,
      ],
    );
  }

  function performDownload(userID: number) {
    openOverlay(
      <DownloadToFile
        userID={userID}
        defaultInterval={2}
        submitFunc={(userID: number, interval: number) =>
          downloadReport(userID, interval)
        }
      />,
    );
  }

  function addNewTask(args: DriverTaskInput) {
    driverTaskService
      .addTask(args, loggedInUser)
      .then((task) => {
        displayNotification('Adding successful');
        scrollToTask(task);
        reloadTasks();
      })
      .catch((err: ServiceError) => {
        displayNotification(err.message);
        if (err.type === ServiceErrorType.TASK_CONFLICT) {
          openOverlay(
            <TaskConflict
              retryTask={() => addNewTask(args)}
              deleteTask={deleteTask}
              conflictingTasks={(err as ConflictServiceError).conflictingTasks}
            />,
          );
        }
      });
    closeOverlay();
  }

  function updateTask(driverTaskID: number, args: DriverTaskInput) {
    driverTaskService
      .updateTask(driverTaskID, args, loggedInUser)
      .then((task) => {
        displayNotification('Updating successful');
        scrollToTask(task);
        reloadTasks();
      })
      .catch((err) => {
        displayNotification(err.message);
        if (err.type === ServiceErrorType.TASK_CONFLICT) {
          openOverlay(
            <TaskConflict
              retryTask={() => updateTask(driverTaskID, args)}
              deleteTask={deleteTask}
              conflictingTasks={(err as ConflictServiceError).conflictingTasks}
            />,
          );
        }
      });
    closeOverlay();
  }

  function deleteTask(
    driverTaskId: number,
    shouldOverlayClose: boolean = true,
  ) {
    driverTaskService
      .deleteTask(driverTaskId, loggedInUser)
      .then(() => {
        displayNotification('Deleting successful');
        reloadTasks();
      })
      .catch((err) => {
        displayNotification(err.message);
      });
    if (shouldOverlayClose) closeOverlay();
  }

  function downloadReport(userID: number, dayInterval: number) {
    csvExportService
      .exportToCSV(userID, dayInterval, loggedInUser)
      .then((blob) => {
        let url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        displayNotification(err.message);
      });
  }

  function populateDriverOptions() {
    return (
      <>
        {driverUsers.map((user, i) => (
          <option key={`driver_option_${i}`} value={user.id}>
            {user.name}
          </option>
        ))}
      </>
    );
  }

  return (
    <div className="App">
      {(() => {
        if (currOverlay) {
          return (
            <div
              style={{
                position: 'fixed',
                width: '100vw',
                height: '100vh',
                backgroundColor: 'black',
                opacity: '0.4',
                zIndex: 499,
              }}
            ></div>
          );
        }
      })()}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logistics"></img>
        <h2
          style={{
            color: 'lightgrey',
          }}
        >
          logistics
        </h2>
      </header>
      <div
        style={{
          display: 'flex',
        }}
      >
        <Button
          onClick={() => openOverlay(addTaskElem)}
          label="Create"
        ></Button>
        <Button
          onClick={() => performDownload(selectedUserID)}
          label="Download"
        ></Button>
      </div>
      <div
        style={{
          display: 'flex',
          padding: '8px',
        }}
      >
        <div
          style={{
            padding: '0 8px',
          }}
        >
          <span
            style={{
              padding: '0 8px',
            }}
          >
            Driver
          </span>
          <select
            onChange={(e) =>
              setSelectedUserID(getNumberInputFromString(e.target.value))
            }
          >
            {populateDriverOptions()}
          </select>
        </div>
        <div
          style={{
            padding: '0 8px',
            flex: 2,
          }}
        >
          <Button
            onClick={() => setSelectedWeek(getClampedWeek(selectedWeek - 1))}
            label="←"
          />
          <span>{` Week ${selectedWeek} `}</span>
          <Button
            onClick={() => setSelectedWeek(getClampedWeek(selectedWeek + 1))}
            label="→"
          />
        </div>
      </div>
      <AppContext.Provider
        value={{
          displayNotification,
          openOverlay,
          closeOverlay,
          performTaskEdit,
        }}
      >
        <Calendar
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          tasks={tasks}
          scrollTo={calendarScroll}
        />
        <div
          style={{
            position: 'absolute',
            margin: '0 auto',
          }}
        >
          {(() => {
            if (currOverlay) {
              return (
                <Overlay
                  contextMenuItems={currOverlayMenuItems}
                  container={currOverlay}
                />
              );
            }
          })()}
          {notifications.map((notification, i) => (
            <Notification
              key={`notif_${i}`}
              notificationIndex={i}
              message={notification}
            />
          ))}
        </div>
      </AppContext.Provider>
      <footer
        style={{
          fontSize: '12px',
          padding: '10px',
        }}
      >
        <span>&copy; 2020 James Cote</span>
      </footer>
    </div>
  );
}

export default App;
