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

  public getTaskIntervalByUserID(query: DriverTaskIntervalQuery): DriverTask[] {
    return Array.from(this.storage.values()).filter((task) => {
      return (
        task.userID === query.userID &&
        task.day >= query.startDay &&
        task.day <= query.endDay
      );
    });
  }
}
