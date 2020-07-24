import DriverTask from '../model/DriverTask';
import { DriverTaskRepository } from '../repository/DriverTaskRepository';

interface DriverTaskArgs {
  start: number;
  end: number;
  day: number;
  week: number;
}

export interface DriverTaskValidationResult {
  conflict: boolean;
  invalid: boolean;
  conflictingTasks?: DriverTask[];
}

export default class DriverTaskValidator {
  private driverTaskRepo: DriverTaskRepository;

  constructor(driverTaskRepo: DriverTaskRepository) {
    this.driverTaskRepo = driverTaskRepo;
  }

  public validateTaskEntry(args: DriverTaskArgs): DriverTaskValidationResult {
    // throw new Error("Not implemented");
    return {
      conflict: false,
      invalid: false,
    };
  }
}
