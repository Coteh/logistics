import DriverTask from '../model/DriverTask';
import { DriverTaskRepository } from '../repository/DriverTaskRepository';

interface DriverTaskArgs {
  start: number;
  end: number;
  day: number;
  week: number;
  userID: number;
  ignoreIDs?: number[];
}

/**
 * Represents the result of validation (ie. whether there's any errors with validation or if any conflicts occurred)
 */
export interface DriverTaskValidationResult {
  conflict: boolean;
  invalid: boolean;
  conflictingTasks?: DriverTask[];
}

/**
 * Validates driver tasks for valid input and no conflicts
 */
export default class DriverTaskValidator {
  private driverTaskRepo: DriverTaskRepository;

  /**
   * Constructs a driver task validator
   * @param driverTaskRepo driver task repository
   */
  constructor(driverTaskRepo: DriverTaskRepository) {
    this.driverTaskRepo = driverTaskRepo;
  }

  /**
   * Validate a driver task
   * @param args driver task information to be used for validation
   * @remarks a future improvement to this validator would be to split this method into two, one for validation one for conflicts
   * @returns result of driver task validation (ie. whether there's any validation errors or conflicts)
   */
  public validateTaskEntry(args: DriverTaskArgs): DriverTaskValidationResult {
    let userTasks: DriverTask[] = this.driverTaskRepo.getWeeklyTasksByUserID({
      userID: args.userID,
      startWeek: args.week,
      endWeek: args.week,
      ignoreIDs: args.ignoreIDs,
    });
    let conflictingTasks: DriverTask[] = userTasks.filter((task) => {
      return (
        args.day === task.day && args.start < task.end && task.start < args.end
      );
    });

    return {
      conflict: conflictingTasks.length > 0,
      invalid: args.start >= args.end,
      conflictingTasks:
        conflictingTasks.length > 0 ? conflictingTasks : undefined,
    };
  }
}
