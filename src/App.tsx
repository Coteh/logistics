import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Calendar from "./component/Calendar";
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

const driverTaskRepo: DriverTaskRepository = new DriverTaskRepository();
const driverTaskService: DriverTaskService = new DriverTaskService(
  new DriverTaskFactory(new IdGenerator()),
  driverTaskRepo,
  new DriverTaskValidator(driverTaskRepo)
);

function getClampedWeek(week: number) {
  return ((((week - 1) % 52) + 52) % 52) + 1;
}

function App() {
  const [loggedInUser, setLoggedInUser] = useState(new User(1, UserType.DISPATCHER));
  const [selectedUserID, setSelectedUserID] = useState(1);
  const [selectedDriverTaskID, setSelectedDriverTaskID] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [tasks, setTasks] = useState(new Array());

  // TODO remove
  useEffect(() => {
    driverTaskService.addTask({
      start: 14,
      end: 16,
      type: DriverTaskType.DELIVER,
      day: 1,
      week: 1,
      userID: 1,
      location: "Toronto",
    }, loggedInUser);
  }, []);

  useEffect(() => {
    driverTaskService.getWeeklyUserTasks(selectedUserID, selectedWeek, loggedInUser)
      .then((res: DriverTask[]) => {
        setTasks(res);
      })
      .catch((err: ServiceError) => {
        console.log(err.message);
      });
  }, [selectedUserID, selectedWeek, loggedInUser]);

  function addNewTask(args: DriverTaskInput) {
    driverTaskService.addTask(args, loggedInUser)
      .then((task) => {
        console.log("Adding successful");
        // setTasks(tasks.concat(task));
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function updateTask(args: DriverTaskInput) {
    driverTaskService.updateTask(selectedDriverTaskID, args, loggedInUser)
      .then((res) => {
        console.log("Updating successful");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function deleteTask(driverTaskId: number) {
    driverTaskService.deleteTask(driverTaskId, loggedInUser)
      .then((res) => {
        console.log("Deleting successful");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div style={{
        display: "flex",
      }}>
        <button>
          Create
        </button>
        <button>
          Download
        </button>
      </div>
      <div style={{
          display: "flex",
        }}>
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
          <button onClick={() => setSelectedWeek(getClampedWeek(selectedWeek - 1))}>{"<-"}</button>
          <span>{` Week ${selectedWeek} `}</span>
          <button onClick={() => setSelectedWeek(getClampedWeek(selectedWeek + 1))}>{"->"}</button>
        </div>
      </div>
      <Calendar tasks={tasks}/>
      <div style={{
        position: "absolute",
        margin: "0 auto",
      }}>
        <Overlay container={<AddDriverTask addNewTaskFunc={addNewTask}/>}/>
      </div>
    </div>
  );
}

export default App;
