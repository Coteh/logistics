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

/**
 * Describes a service error that occurred due to task scheduling conflict
 */
export class ConflictServiceError extends ServiceError {
  public conflictingTasks: DriverTask[];

  /**
   * Constructs a conflict service error
   * @param message message of error
   * @param type type of error
   * @param conflictingTasks tasks that conflicted
   * @see ServiceErrorType
   */
  constructor(
    message: string,
    type: ServiceErrorType,
    conflictingTasks: DriverTask[],
  ) {
    super(message, type);
    this.conflictingTasks = conflictingTasks;
  }
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
      throw new ServiceError(
        'User does not have permission to perform this action',
        ServiceErrorType.INSUFFICIENT_PERMISSIONS,
      );
    }
  }

  private async checkAccessPermissions(user: User, accessUserID: number) {
    if (user.type !== UserType.DISPATCHER && user.id !== accessUserID) {
      throw new ServiceError(
        'User does not have permission to view these tasks',
        ServiceErrorType.INSUFFICIENT_PERMISSIONS,
      );
    }
  }

  private async checkTaskValidity(
    args: DriverTaskInput,
    ignoreIDs?: number[],
  ): Promise<void> {
    let result: DriverTaskValidationResult = this.driverTaskValidator.validateTaskEntry(
      {
        start: args.start,
        end: args.end,
        day: args.day,
        week: args.week,
        userID: args.userID,
        ignoreIDs: ignoreIDs,
      },
    );
    if (result.invalid) {
      throw new ServiceError(
        'Task has invalid start and/or end time',
        ServiceErrorType.INVALID_TIME_UNIT,
      );
    }
    if (result.conflict) {
      throw new ConflictServiceError(
        'Task conflicts with one or more tasks',
        ServiceErrorType.TASK_CONFLICT,
        result.conflictingTasks ? result.conflictingTasks : [],
      );
    }
  }

  /**
   * Adds a new task
   * @param args input for new driver task
   * @param user user performing action
   */
  public async addTask(args: DriverTaskInput, user: User): Promise<DriverTask> {
    // Ensure user has role to update task
    await this.checkModifyPermissions(user);
    // Ensure updated task is valid (ie. does not conflict with any other task)
    await this.checkTaskValidity(args);
    // Perform add action
    let driverTask = this.driverTaskFactory.create(args);
    this.driverTaskRepo.add(driverTask.id, driverTask);
    // Return added task to client
    return driverTask;
  }

  /**
   * Updates a driver task
   * @param id id of driver task to update
   * @param args input for updated driver task
   * @param user user performing action
   */
  public async updateTask(
    id: number,
    args: DriverTaskInput,
    user: User,
  ): Promise<DriverTask> {
    // Ensure user has role to add task
    await this.checkModifyPermissions(user);
    // Ensure task is valid (ie. does not conflict with any other task)
    await this.checkTaskValidity(args, [id]);
    // Perform update action
    let driverTask: DriverTask;
    try {
      driverTask = this.driverTaskRepo.get(id);
    } catch (e) {
      throw new ServiceError(
        `Could not find entry of id '${id}'`,
        ServiceErrorType.ENTRY_NOT_FOUND,
      );
    }
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

  /**
   * Deletes a driver task
   * @param id id of driver task to delete
   * @param user user performing action
   */
  public async deleteTask(id: number, user: User): Promise<void> {
    // Ensure user has role to delete task
    await this.checkModifyPermissions(user);
    // Perform delete action
    try {
      this.driverTaskRepo.delete(id);
    } catch (e) {
      throw new ServiceError(
        `Could not find entry of id '${id}'`,
        ServiceErrorType.ENTRY_NOT_FOUND,
      );
    }
  }

  /**
   * Gets a given driver's tasks for a specified week
   * @param userID id of user to collect tasks for
   * @param week week to collect tasks for
   * @param user user performing action
   */
  public async getWeeklyUserTasks(
    userID: number,
    week: number,
    user: User,
  ): Promise<DriverTask[]> {
    // Ensure user has role to access selected tasks
    await this.checkAccessPermissions(user, userID);
    // Get weekly tasks
    return this.driverTaskRepo.getWeeklyTasksByUserID({
      userID,
      startWeek: week,
      endWeek: week,
    });
  }
}
