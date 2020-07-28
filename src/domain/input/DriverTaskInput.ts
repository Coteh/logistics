import { DriverTaskType } from '../type/DriverTaskType';

/**
 * Input to service methods to add/update a driver task
 * @see DriverTask
 */
export interface DriverTaskInput {
  type: DriverTaskType;
  start: number;
  end: number;
  day: number;
  week: number;
  userID: number;
  location: string;
}
