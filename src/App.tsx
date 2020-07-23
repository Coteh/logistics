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

const driverTaskService: DriverTaskService = new DriverTaskService(
  new DriverTaskFactory(new IdGenerator()),
  new DriverTaskRepository()
);

function getClampedWeek(week: number) {
  return ((((week - 1) % 52) + 52) % 52) + 1;
}

function App() {
  const [loggedInUser, setLoggedInUser] = useState(new User(1, UserType.DISPATCHER));
  const [selectedUserID, setSelectedUserID] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [tasks, setTasks] = useState(new Array());

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
    setTasks(driverTaskService.getWeeklyUserTasks(selectedUserID, selectedWeek, loggedInUser));
  }, [selectedUserID, selectedWeek, loggedInUser]);

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
    </div>
  );
}

export default App;
