import { DriverTaskType } from '../type/DriverTaskType';
import Model from './Model';

export default class DriverTask extends Model {
  public id: number;
  public type: DriverTaskType;
  public start: number;
  public end: number;
  public day: number;
  public week: number;
  public userID: number;
  public location: string;

  constructor(
    id: number,
    type: DriverTaskType,
    start: number,
    end: number,
    day: number,
    week: number,
    userID: number,
    location: string,
  ) {
    super();
    this.id = id;
    this.type = type;
    this.start = start;
    this.end = end;
    this.day = day;
    this.week = week;
    this.userID = userID;
    this.location = location;
  }
}
