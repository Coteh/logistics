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
                expect(err.conflictingTasks.length).toEqual(1);
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
    // it('updates a driver task successfully', () => {
    //     throw new Error("Not implemented");
    // });
    // it('will not update a driver task if its new schedule conflicts with another task', () => {
    //     throw new Error("Not implemented");
    // });
    // it('will return a list of the conflicting tasks if update operations fails due to conflict', () => {
    //     throw new Error("Not implemented");
    // });
    // it('will not update a driver task if start and end time are the same', () => {
    //     throw new Error("Not implemented");
    // });
    // it('will not update a driver task if end time is before start time', () => {
    //     throw new Error("Not implemented");
    // });
    // it('will refuse to update a driver task if user does not have dispatcher permissions', () => {
    //     throw new Error("Not implemented");
    // });
    // it('deletes a driver task successfully', () => {
    //     throw new Error("Not implemented");
    // });
    // it('will refuse to delete a driver task if user does not have dispatcher permissions', () => {
    //     throw new Error("Not implemented");
    // });
});
