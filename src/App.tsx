import React, {
  useState,
  useEffect,
  useContext,
  Context,
  createContext,
} from 'react';
import logo from './logo.svg';
import './App.css';
import Calendar from './component/Calendar';
import { DriverTaskType } from './type/DriverTaskType';
import DriverTaskService from './service/DriverTaskService';
import DriverTaskFactory from './factory/DriverTaskFactory';
import IdGenerator from './gen/IdGenerator';
import { DriverTaskRepository } from './repository/DriverTaskRepository';
import User from './model/User';
import { UserType } from './type/UserType';
import Overlay from './component/Overlay';
import AddDriverTask from './section/AddDriverTask';
import { DriverTaskInput } from './input/DriverTaskInput';
import DriverTask from './model/DriverTask';
import ServiceError from './service/ServiceError';
import DriverTaskValidator from './validator/DriverTaskValidator';
import Notification from './component/Notification';

const driverTaskRepo: DriverTaskRepository = new DriverTaskRepository();
const driverTaskService: DriverTaskService = new DriverTaskService(
  new DriverTaskFactory(new IdGenerator()),
  driverTaskRepo,
  new DriverTaskValidator(driverTaskRepo),
);

function getClampedWeek(week: number) {
  return ((((week - 1) % 52) + 52) % 52) + 1;
}

type AppContextType = {
  displayNotification: Function;
};

export const AppContext: Context<AppContextType> = createContext(
  {} as AppContextType,
);

function App() {
  const [loggedInUser] = useState(new User(1, UserType.DISPATCHER));
  const [selectedUserID, setSelectedUserID] = useState(1);
  const [selectedDriverTaskID, setSelectedDriverTaskID] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [tasks, setTasks] = useState(new Array());
  const [notifications, setNotifications] = useState(new Array());
  const [currOverlay, setCurrOverlay] = useState<JSX.Element | null>(null);

  const addTask = <AddDriverTask addNewTaskFunc={addNewTask} />;

  // TODO remove
  useEffect(() => {
    driverTaskService
      .addTask(
        {
          start: 14,
          end: 16,
          type: DriverTaskType.DELIVER,
          day: 1,
          week: 1,
          userID: 1,
          location: 'Toronto',
        },
        loggedInUser,
      )
      .then((task) => {
        setTasks(tasks.concat(task));
      });
  }, []);

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
    setCurrOverlay(null);
  }

  function updateTask(args: DriverTaskInput) {
    driverTaskService
      .updateTask(selectedDriverTaskID, args, loggedInUser)
      .then((res) => {
        console.log('Updating successful');
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function deleteTask(driverTaskId: number) {
    driverTaskService
      .deleteTask(driverTaskId, loggedInUser)
      .then((res) => {
        console.log('Deleting successful');
      })
      .catch((err) => {
        console.log(err.message);
      });
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
        <button onClick={() => setCurrOverlay(addTask)}>Create</button>
        <button>Download</button>
      </div>
      <div
        style={{
          display: 'flex',
        }}
      >
        <div>
          <span>Driver</span>
          <select>
            <option value=""></option>
            <option value="user1">User 1</option>
            <option value="user2">User 2</option>
            <option value="user3">User 3</option>
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
      <Calendar tasks={tasks} />
      <div
        style={{
          position: 'absolute',
          margin: '0 auto',
        }}
      >
        <AppContext.Provider value={{ displayNotification }}>
          {(() => {
            if (currOverlay) {
              return <Overlay container={currOverlay} />;
            }
          })()}
          {notifications.map((notification, i) => (
            <Notification
              key={`notif_${i}`}
              notificationIndex={i}
              message={notification}
            />
          ))}
        </AppContext.Provider>
      </div>
    </div>
  );
}

export default App;
