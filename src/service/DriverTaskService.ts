import DriverTask from "../model/DriverTask";
import User from "../model/User";
import { DriverTaskRepository } from "../repository/DriverTaskRepository";
import { DriverTaskInput } from "../input/DriverTaskInput";
import DriverTaskFactory from "../factory/DriverTaskFactory";
import { UserType } from "../type/UserType";
import DriverTaskValidator, { DriverTaskValidationResult } from "../validator/DriverTaskValidator";
import ServiceError, { ServiceErrorType } from "./ServiceError";

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
    constructor(driverTaskFactory: DriverTaskFactory, driverTaskRepo: DriverTaskRepository, driverTaskValidator: DriverTaskValidator) {
        this.driverTaskFactory = driverTaskFactory;
        this.driverTaskRepo = driverTaskRepo;
        this.driverTaskValidator = driverTaskValidator;
    }

    public addTask(args: DriverTaskInput, user: User): Promise<DriverTask> {
        return new Promise((resolve, reject) => {
            // Ensure user has role to add task
            if (user.type !== UserType.DISPATCHER) {
                reject({
                    message: "User does not have permission to add a task",
                    type: ServiceErrorType.INSUFFICIENT_PERMISSIONS,
                });
                return;
            }
            // Ensure task is valid (ie. does not conflict with any other task)
            let result: DriverTaskValidationResult = this.driverTaskValidator.validateTaskEntry({
                start: args.start,
                end: args.end,
                day: args.day,
                week: args.week,
            });
            if (result.invalid) {
                reject({
                    message: "New task has invalid start and/or end time",
                    type: ServiceErrorType.INVALID_TIME_SLOT,
                });
                return;
            }
            if (result.conflict) {
                reject({
                    message: "New task conflicts with one or more tasks",
                    type: ServiceErrorType.TASK_CONFLICT,
                    conflictingTasks: result.conflictingTasks,
                });
                return;
            }
            let driverTask = this.driverTaskFactory.create(args);
            this.driverTaskRepo.add(driverTask.id, driverTask);
            resolve(driverTask);
        });
    }

    public updateTask(id: number, args: DriverTaskInput, user: User): Promise<DriverTask> {
        return new Promise((resolve, reject) => {
            // TODO ensure user has role to update task
            // TODO ensure task is valid (ie. does not conflict with any other task)
    
            let driverTask = this.driverTaskRepo.get(id);
            driverTask.type = args.type;
            driverTask.start = args.start;
            driverTask.end = args.end;
            driverTask.userID = args.userID;
            driverTask.location = args.location;

            resolve(driverTask);
        });
    }

    public deleteTask(id: number, user: User): Promise<void> {
        return new Promise((resolve, reject) => {
            // TODO ensure user has role to delete task
            // TODO ensure task is valid (ie. does not conflict with any other task)
    
            this.driverTaskRepo.delete(id);

            resolve();
        });
    }

    public getWeeklyUserTasks(userID: number, week: number, user: User): Promise<DriverTask[]> {
        return new Promise((resolve, reject) => {
            // TODO ensure user has role to access selected tasks

            resolve(this.driverTaskRepo.getWeeklyTasksByUserID({
                userID,
                startWeek: week,
                endWeek: week,
            }));
        });
    }

    public getDayIntervalUserTasks(userID: number, dayInterval: number, user: User): Promise<DriverTask[]> {
        return new Promise((resolve, reject) => {
            // TODO ensure user has role to access selected tasks

            reject({
                message: 'Not implemented',
            });
        });
    }

}