import DriverTask from "../model/DriverTask";
import User from "../model/User";
import { DriverTaskRepository } from "../repository/DriverTaskRepository";
import { DriverTaskInput } from "../input/DriverTaskInput";
import DriverTaskFactory from "../factory/DriverTaskFactory";

/**
 * Service that performs actions pertaining to driver scheduling.
 */
export default class DriverTaskService {
    private driverTaskFactory: DriverTaskFactory;
    private driverTaskRepo: DriverTaskRepository;

    /**
     * Construct an instance of {@link DriverTaskService}
     * 
     * @param driverTaskFactory factory that creates {@link DriverTask} instances
     * @param driverTaskRepo repository that stores {@link DriverTask} instances
     */
    constructor(driverTaskFactory: DriverTaskFactory, driverTaskRepo: DriverTaskRepository) {
        this.driverTaskFactory = driverTaskFactory;
        this.driverTaskRepo = driverTaskRepo;
    }

    public addTask(args: DriverTaskInput, user: User): Promise<DriverTask> {
        return new Promise((resolve, reject) => {
            // TODO ensure user has role to add task
            // TODO ensure task is valid (ie. does not conflict with any other task)
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