import Repository from './Repository';
import DriverTask from '../model/DriverTask';

interface DriverTaskWeekQuery {
  userID: number;
  startWeek: number;
  endWeek: number;
  ignoreIDs?: number[];
}

interface DriverTaskIntervalQuery {
  userID: number;
  startDay: number;
  endDay: number;
}

/**
 * Repository for driver tasks with additional methods to retrieve weekly and interval tasks.
 */
export class DriverTaskRepository extends Repository<DriverTask> {
  /**
   * Gets weekly driver tasks for a given user
   * @param query driver task week query
   * @returns array of driver tasks that belong to user for given week
   */
  public getWeeklyTasksByUserID(query: DriverTaskWeekQuery): DriverTask[] {
    return Array.from(this.storage.values()).filter((task) => {
      return (
        task.userID === query.userID &&
        task.week >= query.startWeek &&
        task.week <= query.endWeek &&
        (!query.ignoreIDs || !query.ignoreIDs.some((id) => id === task.id))
      );
    });
  }

  /**
   * Gets driver tasks from a given day range for a specified user
   * @param query driver task interval query
   * @returns array of driver tasks that belong to user between the given days
   */
  public getTaskIntervalByUserID(query: DriverTaskIntervalQuery): DriverTask[] {
    return Array.from(this.storage.values()).filter((task) => {
      let day: number = (task.week - 1) * 7 + task.day;
      return (
        task.userID === query.userID &&
        day >= query.startDay &&
        day <= query.endDay
      );
    });
  }
}
