import DriverTask from '../model/DriverTask';
import User from '../model/User';
import { DriverTaskRepository } from '../repository/DriverTaskRepository';
import { DriverTaskInput } from '../input/DriverTaskInput';
import DriverTaskFactory from '../factory/DriverTaskFactory';
import { UserType } from '../type/UserType';
import DriverTaskValidator, {
  DriverTaskValidationResult,
} from '../validator/DriverTaskValidator';
import ServiceError, { ServiceErrorType } from './ServiceError';

export interface ConflictServiceError extends ServiceError {
  conflictingTasks: DriverTask[];
}

/**
 * Service that performs actions pertaining to driver scheduling.
 */
export default class DriverTaskService {
  private driverTaskFactory: DriverTaskFactory;
  private driverTaskRepo: DriverTaskRepository;
  private driverTaskValidator: DriverTaskValidator;

  /**
   * Construct an instance of {@link DriverTaskService}
   *
   * @param driverTaskFactory factory that creates {@link DriverTask} instances
   * @param driverTaskRepo repository that stores {@link DriverTask} instances
   * @param driverTaskValidator validator that checks whether driver task conflicts with other tasks
   */
  constructor(
    driverTaskFactory: DriverTaskFactory,
    driverTaskRepo: DriverTaskRepository,
    driverTaskValidator: DriverTaskValidator,
  ) {
    this.driverTaskFactory = driverTaskFactory;
    this.driverTaskRepo = driverTaskRepo;
    this.driverTaskValidator = driverTaskValidator;
  }

  private async checkModifyPermissions(user: User): Promise<void> {
    if (user.type !== UserType.DISPATCHER) {
      throw {
        message: 'User does not have permission to perform this action',
        type: ServiceErrorType.INSUFFICIENT_PERMISSIONS,
      };
    }
  }

  private async checkTaskConflicts(args: DriverTaskInput): Promise<void> {
    let result: DriverTaskValidationResult = this.driverTaskValidator.validateTaskEntry(
      {
        start: args.start,
        end: args.end,
        day: args.day,
        week: args.week,
        userID: args.userID,
      },
    );
    if (result.invalid) {
      throw {
        message: 'New task has invalid start and/or end time',
        type: ServiceErrorType.INVALID_TIME_SLOT,
      };
    }
    if (result.conflict) {
      throw {
        message: 'New task conflicts with one or more tasks',
        type: ServiceErrorType.TASK_CONFLICT,
        conflictingTasks: result.conflictingTasks,
      };
    }
  }

  public async addTask(args: DriverTaskInput, user: User): Promise<DriverTask> {
    // Ensure user has role to update task
    await this.checkModifyPermissions(user);
    // Ensure updated task is valid (ie. does not conflict with any other task)
    await this.checkTaskConflicts(args);
    // Perform add action
    let driverTask = this.driverTaskFactory.create(args);
    this.driverTaskRepo.add(driverTask.id, driverTask);
    // Return added task to client
    return driverTask;
  }

  public async updateTask(
    id: number,
    args: DriverTaskInput,
    user: User,
  ): Promise<DriverTask> {
    // Ensure user has role to add task
    await this.checkModifyPermissions(user);
    // Ensure task is valid (ie. does not conflict with any other task)
    await this.checkTaskConflicts(args);
    // Perform update action
    let driverTask = this.driverTaskRepo.get(id);
    driverTask.type = args.type;
    driverTask.start = args.start;
    driverTask.end = args.end;
    driverTask.day = args.day;
    driverTask.week = args.week;
    driverTask.userID = args.userID;
    driverTask.location = args.location;
    // Return updated task to client
    return driverTask;
  }

  public async deleteTask(id: number, user: User): Promise<void> {
    // Ensure user has role to delete task
    await this.checkModifyPermissions(user);
    // Perform delete action
    this.driverTaskRepo.delete(id);
  }

  public getWeeklyUserTasks(
    userID: number,
    week: number,
    user: User,
  ): Promise<DriverTask[]> {
    return new Promise((resolve, reject) => {
      // TODO ensure user has role to access selected tasks

      resolve(
        this.driverTaskRepo.getWeeklyTasksByUserID({
          userID,
          startWeek: week,
          endWeek: week,
        }),
      );
    });
  }

  public getDayIntervalUserTasks(
    userID: number,
    dayInterval: number,
    user: User,
  ): Promise<DriverTask[]> {
    return new Promise((resolve, reject) => {
      // TODO ensure user has role to access selected tasks

      reject({
        message: 'Not implemented',
      });
    });
  }
}
