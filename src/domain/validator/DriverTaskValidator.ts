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
