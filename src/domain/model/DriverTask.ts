import { DriverTaskType } from '../type/DriverTaskType';
import Model from './Model';

/**
 * Model that represents a task scheduled for a driver
 */
export default class DriverTask extends Model {
  public id: number;
  public type: DriverTaskType;
  public start: number;
  public end: number;
  public day: number;
  public week: number;
  public userID: number;
  public location: string;

  /**
   * Constructs a Driver Task model
   * @param id id of task
   * @param type type of task (ie. Pickup, Deliver, Other)
   * @param start start time in discrete units (1-24)
   * @param end end time in discrete units (1-24)
   * @param day day in discrete units (1-7)
   * @param week week in discrete units (1-52)
   * @param userID id of user this task belongs to
   * @param location location of task
   */
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
