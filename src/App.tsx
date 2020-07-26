import React, { useState, useEffect, Context, createContext } from 'react';
import logo from './logo.svg';
import './App.css';
import Calendar from './component/Calendar';
import DriverTaskService from './service/DriverTaskService';
import DriverTaskFactory from './factory/DriverTaskFactory';
import IdGenerator from './gen/IdGenerator';
import { DriverTaskRepository } from './repository/DriverTaskRepository';
import User from './model/User';
import { UserType } from './type/UserType';
import Overlay from './component/Overlay';
import EditDriverTask from './section/EditDriverTask';
import { DriverTaskInput } from './input/DriverTaskInput';
import DriverTask from './model/DriverTask';
import ServiceError from './service/ServiceError';
import DriverTaskValidator from './validator/DriverTaskValidator';
import Notification from './component/Notification';
import Button from './component/Button';
import Confirm from './section/Confirm';

const driverTaskRepo: DriverTaskRepository = new DriverTaskRepository();
const driverTaskService: DriverTaskService = new DriverTaskService(
  new DriverTaskFactory(new IdGenerator()),
  driverTaskRepo,
  new DriverTaskValidator(driverTaskRepo),
);

const driverUsers = [
  new User(2, UserType.DRIVER, 'John Smith'),
  new User(3, UserType.DRIVER, 'Fierce Bob'),
  new User(4, UserType.DRIVER, 'Jane Doe'),
];

function getClampedWeek(week: number) {
  return ((((week - 1) % 52) + 52) % 52) + 1;
}

type AppContextType = {
  displayNotification: Function;
  closeOverlay: Function;
  performTaskEdit: Function;
};

export const AppContext: Context<AppContextType> = createContext(
  {} as AppContextType,
);

function App() {
  const [loggedInUser] = useState(new User(1, UserType.DISPATCHER));
  const [selectedUserID, setSelectedUserID] = useState(
    driverUsers?.[0].id || 1,
  );
  const [selectedDriverTaskID, setSelectedDriverTaskID] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [tasks, setTasks] = useState<DriverTask[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [currOverlay, setCurrOverlay] = useState<JSX.Element | null>(null);
  const [currOverlayMenuItems, setCurrOverlayMenuItems] = useState<
    JSX.Element[]
  >([]);

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

  function closeOverlay() {
    setCurrOverlay(null);
    setCurrOverlayMenuItems([]);
  }

  function performTaskEdit(driverTask: DriverTask) {
    setSelectedDriverTaskID(driverTask.id);
    setCurrOverlay(
      <EditDriverTask
        userID={selectedUserID}
        defaultType={driverTask.type}
        defaultStart={driverTask.start}
        defaultEnd={driverTask.end}
        defaultLocation={driverTask.location}
        defaultDay={driverTask.day}
        defaultWeek={driverTask.week}
        label="Edit Task"
        submitFunc={updateTask}
      />,
    );
    setCurrOverlayMenuItems((menuItems) => [
      ...menuItems,
      <Button
        onClick={() => performTaskDeletion(driverTask)}
        label="Delete"
      ></Button>,
    ]);
  }

  function performTaskDeletion(driverTask: DriverTask) {
    closeOverlay();
    setCurrOverlay(
      <Confirm
        label="Are you sure you want to delete this task? It cannot be undone."
        yesFunc={() => deleteTask(selectedDriverTaskID)}
        noFunc={() => performTaskEdit(driverTask)}
      ></Confirm>,
    );
  }

  function addNewTask(args: DriverTaskInput) {
    driverTaskService
      .addTask(args, loggedInUser)
      .then((task) => {
        displayNotification('Adding successful');
        setTasks(tasks.concat(task));
      })
      .catch((err: ServiceError) => {
        displayNotification(err.message);
      });
    closeOverlay();
  }

  function updateTask(args: DriverTaskInput) {
    driverTaskService
      .updateTask(selectedDriverTaskID, args, loggedInUser)
      .then((res) => {
        displayNotification('Updating successful');
      })
      .catch((err) => {
        displayNotification(err.message);
      });
    closeOverlay();
  }

  function deleteTask(driverTaskId: number) {
    driverTaskService
      .deleteTask(driverTaskId, loggedInUser)
      .then((res) => {
        displayNotification('Deleting successful');
      })
      .catch((err) => {
        displayNotification(err.message);
      });
    closeOverlay();
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
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div
        style={{
          display: 'flex',
        }}
      >
        <Button
          onClick={() => setCurrOverlay(addTaskElem)}
          label="Create"
        ></Button>
        <Button label="Download"></Button>
      </div>
      <div
        style={{
          display: 'flex',
        }}
      >
        <div>
          <span>Driver</span>
          <select onChange={(e) => setSelectedUserID(parseInt(e.target.value))}>
            {populateDriverOptions()}
          </select>
        </div>
        <div>
          <button
            onClick={() => setSelectedWeek(getClampedWeek(selectedWeek - 1))}
          >
            {'<-'}
          </button>
          <span>{` Week ${selectedWeek} `}</span>
          <button
            onClick={() => setSelectedWeek(getClampedWeek(selectedWeek + 1))}
          >
            {'->'}
          </button>
        </div>
      </div>
      <AppContext.Provider
        value={{ displayNotification, closeOverlay, performTaskEdit }}
      >
        <Calendar tasks={tasks} />
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
    </div>
  );
}

export default App;
