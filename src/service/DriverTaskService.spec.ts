import "jest"
import DriverTaskService, { ConflictServiceError } from "./DriverTaskService";
import DriverTaskFactory from "../factory/DriverTaskFactory";
import { DriverTaskInput } from "../input/DriverTaskInput";
import * as sinon from "sinon";
import { SinonStubbedInstance } from "sinon";
import { DriverTaskRepository } from "../repository/DriverTaskRepository";
import { createSinonStubInstance, StubbedClass } from "../../test/test_helper";
import DriverTask from "../model/DriverTask";
import { DriverTaskType } from "../type/DriverTaskType";
import User from "../model/User";
import { UserType } from "../type/UserType";
import DriverTaskValidator from "../validator/DriverTaskValidator";
import ServiceError, { ServiceErrorType } from "./ServiceError";

describe('DriverTaskService', () => {
    let mockFactory: StubbedClass<DriverTaskFactory>;
    let mockRepo: StubbedClass<DriverTaskRepository>;
    let mockValidator: StubbedClass<DriverTaskValidator>;
    let service: DriverTaskService;
    
    beforeEach(() => {
        mockFactory = createSinonStubInstance(DriverTaskFactory);
        mockRepo = createSinonStubInstance(DriverTaskRepository);
        mockValidator = createSinonStubInstance(DriverTaskValidator);
        service = new DriverTaskService(mockFactory, mockRepo, mockValidator);
    });
    
    describe('addTask', () => {
        // TODO add fake repo rather than mock repo to ensure entries are added
        it('successfully adds a task', () => {
            mockFactory.create.returns({
                id: 1,
                type: DriverTaskType.DELIVER,
                start: 1,
                end: 3,
                week: 1,
                day: 1,
                location: "Toronto",
                userID: 1,
            });
            mockValidator.validateTaskEntry.returns({
                conflict: false,
                invalid: false,
            });
            
            return service.addTask({
                type: DriverTaskType.DELIVER,
                start: 1,
                end: 3,
                week: 1,
                day: 1,
                location: "Toronto",
                userID: 1,
            }, new User(1, UserType.DISPATCHER))
                .then(() => {
                    expect(mockFactory.create.calledOnce).toBeTruthy();
                    expect(mockRepo.add.calledOnce).toBeTruthy();
                });
        });
        it('will not add a driver task if it conflicts with another task', () => {
            mockValidator.validateTaskEntry.returns({
                conflict: true,
                invalid: false,
                conflictingTasks: [{
                    id: 1,
                    type: DriverTaskType.DELIVER,
                    start: 1,
                    end: 3,
                    week: 1,
                    day: 1,
                    location: "Toronto",
                    userID: 1,
                }],
            });
            
            return service.addTask({
                type: DriverTaskType.DELIVER,
                start: 1,
                end: 3,
                week: 1,
                day: 1,
                location: "Toronto",
                userID: 1,
            }, new User(1, UserType.DISPATCHER))
                .then(() => {
                    fail("User added a conflicting task");
                })
                .catch((err: ConflictServiceError) => {
                    expect(err.type).toEqual(ServiceErrorType.TASK_CONFLICT);
                });
        });
        it('will return a list of the conflicting tasks if add operation fails due to conflict', () => {
            mockValidator.validateTaskEntry.returns({
                conflict: true,
                invalid: false,
                conflictingTasks: [{
                    id: 1,
                    type: DriverTaskType.DELIVER,
                    start: 1,
                    end: 3,
                    week: 1,
                    day: 1,
                    location: "Toronto",
                    userID: 1,
                }],
            });
            
            return service.addTask({
                type: DriverTaskType.DELIVER,
                start: 1,
                end: 3,
                week: 1,
                day: 1,
                location: "Toronto",
                userID: 1,
            }, new User(1, UserType.DISPATCHER))
                .then(() => {
                    fail("User added a conflicting task");
                })
                .catch((err: ConflictServiceError) => {
                    expect(err.conflictingTasks).toHaveLength(1);
                    expect(err.conflictingTasks).toContainEqual({
                        id: 1,
                        type: DriverTaskType.DELIVER,
                        start: 1,
                        end: 3,
                        week: 1,
                        day: 1,
                        location: "Toronto",
                        userID: 1,
                    });
                });
        });
        it('will not add a driver task if start and/or end time is invalid', () => {
            mockValidator.validateTaskEntry.returns({
                conflict: false,
                invalid: true,
            });
            
            return service.addTask({
                type: DriverTaskType.DELIVER,
                start: 1,
                end: 3,
                week: 1,
                day: 1,
                location: "Toronto",
                userID: 1,
            }, new User(1, UserType.DISPATCHER))
                .then(() => {
                    fail("User added a conflicting task");
                })
                .catch((err: ServiceError) => {
                    expect(err.type).toEqual(ServiceErrorType.INVALID_TIME_SLOT);
                });
        });
        it('will refuse to add a driver task if user does not have dispatcher permissions', () => {
            return service.addTask({
                type: DriverTaskType.DELIVER,
                start: 1,
                end: 3,
                week: 1,
                day: 1,
                location: "Toronto",
                userID: 1,
            }, new User(1, UserType.DRIVER))
                .then(() => {
                    fail("User without dispatcher permissions added a task");
                })
                .catch((err) => {
                    expect(err.type).toEqual(ServiceErrorType.INSUFFICIENT_PERMISSIONS);
                });
        });
        it('will return the newly added task if task was added successfully', () => {
            mockFactory.create.returns({
                id: 1,
                type: DriverTaskType.DELIVER,
                start: 1,
                end: 3,
                week: 1,
                day: 1,
                location: "Toronto",
                userID: 1,
            });
            mockValidator.validateTaskEntry.returns({
                conflict: false,
                invalid: false,
            });
            
            return service.addTask({
                type: DriverTaskType.DELIVER,
                start: 1,
                end: 3,
                week: 1,
                day: 1,
                location: "Toronto",
                userID: 1,
            }, new User(1, UserType.DISPATCHER))
                .then((task) => {
                    expect(task).toEqual({
                        id: 1,
                        type: DriverTaskType.DELIVER,
                        start: 1,
                        end: 3,
                        week: 1,
                        day: 1,
                        location: "Toronto",
                        userID: 1,
                    });
                });
        });
    });
    describe('updateTask', () => {
        // TODO add fake repo rather than mock repo to ensure entries are updated
        it('updates a driver task successfully', () => {
            mockRepo.get.returns({
                id: 1,
                type: DriverTaskType.DELIVER,
                start: 1,
                end: 3,
                week: 1,
                day: 1,
                location: "Toronto",
                userID: 1,
            });
            mockValidator.validateTaskEntry.returns({
                conflict: false,
                invalid: false,
            });

            return service.updateTask(1, {
                type: DriverTaskType.OTHER,
                start: 5,
                end: 6,
                week: 2,
                day: 2,
                location: "Guelph",
                userID: 2,
            }, new User(1, UserType.DISPATCHER))
                .then((task) => {
                    expect(mockRepo.get.calledOnce).toBeTruthy();
                    expect(task.type).toEqual(DriverTaskType.OTHER);
                    expect(task.start).toEqual(5);
                    expect(task.end).toEqual(6);
                    expect(task.week).toEqual(2);
                    expect(task.day).toEqual(2);
                    expect(task.location).toEqual("Guelph");
                    expect(task.userID).toEqual(2);
                });
        });
        it('will not update a driver task if its new schedule conflicts with another task', () => {
            mockValidator.validateTaskEntry.returns({
                conflict: true,
                invalid: false,
                conflictingTasks: [{
                    id: 1,
                    type: DriverTaskType.DELIVER,
                    start: 1,
                    end: 3,
                    week: 1,
                    day: 1,
                    location: "Toronto",
                    userID: 1,
                }]
            });

            return service.updateTask(1, {
                type: DriverTaskType.DELIVER,
                start: 1,
                end: 3,
                week: 1,
                day: 1,
                location: "Toronto",
                userID: 1,
            }, new User(1, UserType.DISPATCHER))
                .then(() => {
                    fail("User updated a conflicting task");
                })
                .catch((err: ConflictServiceError) => {
                    expect(err.type).toEqual(ServiceErrorType.TASK_CONFLICT);
                });
        });
        it('will return a list of the conflicting tasks if update operation fails due to conflict', () => {
            mockValidator.validateTaskEntry.returns({
                conflict: true,
                invalid: false,
                conflictingTasks: [{
                    id: 1,
                    type: DriverTaskType.DELIVER,
                    start: 1,
                    end: 3,
                    week: 1,
                    day: 1,
                    location: "Toronto",
                    userID: 1,
                }]
            });

            return service.updateTask(1, {
                type: DriverTaskType.DELIVER,
                start: 1,
                end: 3,
                week: 1,
                day: 1,
                location: "Toronto",
                userID: 1,
            }, new User(1, UserType.DISPATCHER))
                .then(() => {
                    fail("User updated a conflicting task");
                })
                .catch((err: ConflictServiceError) => {
                    expect(err.conflictingTasks).toHaveLength(1);
                    expect(err.conflictingTasks).toContainEqual({
                        id: 1,
                        type: DriverTaskType.DELIVER,
                        start: 1,
                        end: 3,
                        week: 1,
                        day: 1,
                        location: "Toronto",
                        userID: 1,
                    });
                });
        });
        it('will not update a driver task if start and/or end time is invalid', () => {
            mockValidator.validateTaskEntry.returns({
                conflict: false,
                invalid: true,
            });

            return service.updateTask(1, {
                type: DriverTaskType.DELIVER,
                start: 1,
                end: 3,
                week: 1,
                day: 1,
                location: "Toronto",
                userID: 1,
            }, new User(1, UserType.DISPATCHER))
                .then(() => {
                    fail("User updated a task with invalid time");
                })
                .catch((err: ConflictServiceError) => {
                    expect(err.type).toEqual(ServiceErrorType.INVALID_TIME_SLOT);
                });
        });
        it('will refuse to update a driver task if user does not have dispatcher permissions', () => {
            return service.updateTask(1, {
                type: DriverTaskType.OTHER,
                start: 5,
                end: 6,
                week: 2,
                day: 2,
                location: "Guelph",
                userID: 2,
            }, new User(1, UserType.DRIVER))
                .then(() => {
                    fail("User without dispatcher permissions updated a task");
                })
                .catch((err) => {
                    expect(err.type).toEqual(ServiceErrorType.INSUFFICIENT_PERMISSIONS);
                });
        });
    });
    describe('deleteTask', () => {
        // TODO add fake repo rather than mock repo to ensure entries are deleted
        it('deletes a driver task successfully', () => {
            throw new Error("Not implemented");
        });
        it('will refuse to delete a driver task if user does not have dispatcher permissions', () => {
            throw new Error("Not implemented");
        });
        it('will return an error if task of specified id does not exist', () => {
            throw new Error("Not implemented");
        });
    });
    describe('getWeeklyUserTasks', () => {
        it('will get a given user\'s tasks at specified week', () => {
            throw new Error('Not implemented');
        });
    });
    describe('getDayIntervalUserTasks', () => {
        it('will get a given user\'s tasks from the start of the day interval to the end', () => {
            throw new Error('Not implemented');
        });
    });
});
