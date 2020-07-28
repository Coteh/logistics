import 'jest';
import DriverTaskService, { ConflictServiceError } from './DriverTaskService';
import DriverTaskFactory from '../factory/DriverTaskFactory';
import { DriverTaskRepository } from '../repository/DriverTaskRepository';
import {
  createSinonStubInstance,
  StubbedClass,
} from '../../../test/util/stub_class';
import DriverTask from '../model/DriverTask';
import { DriverTaskType } from '../type/DriverTaskType';
import User from '../model/User';
import { UserType } from '../type/UserType';
import DriverTaskValidator from '../validator/DriverTaskValidator';
import ServiceError, { ServiceErrorType } from './ServiceError';

describe('DriverTaskService', () => {
  let mockFactory: StubbedClass<DriverTaskFactory>;
  let repo: DriverTaskRepository;
  let mockValidator: StubbedClass<DriverTaskValidator>;
  let service: DriverTaskService;

  beforeEach(() => {
    mockFactory = createSinonStubInstance(DriverTaskFactory);
    repo = new DriverTaskRepository();
    mockValidator = createSinonStubInstance(DriverTaskValidator);
    service = new DriverTaskService(mockFactory, repo, mockValidator);
  });

  describe('addTask', () => {
    it('successfully adds a task', () => {
      mockFactory.create.returns({
        id: 1,
        type: DriverTaskType.DELIVER,
        start: 1,
        end: 3,
        week: 1,
        day: 1,
        location: 'Toronto',
        userID: 1,
      });
      mockValidator.validateTaskEntry.returns({
        conflict: false,
        invalid: false,
      });

      // Precondition: Assert that no task of ID 1 exists yet
      expect(() => {
        repo.get(1);
      }).toThrow();

      return service
        .addTask(
          {
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            week: 1,
            day: 1,
            location: 'Toronto',
            userID: 1,
          },
          new User(1, UserType.DISPATCHER),
        )
        .then(() => {
          expect(mockFactory.create.calledOnce).toBeTruthy();
          expect(repo.get(1)).toBeTruthy();
        });
    });
    it('will not add a driver task if it conflicts with another task', () => {
      mockValidator.validateTaskEntry.returns({
        conflict: true,
        invalid: false,
        conflictingTasks: [
          {
            id: 1,
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            week: 1,
            day: 1,
            location: 'Toronto',
            userID: 1,
          },
        ],
      });

      return service
        .addTask(
          {
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            week: 1,
            day: 1,
            location: 'Toronto',
            userID: 1,
          },
          new User(1, UserType.DISPATCHER),
        )
        .then(() => {
          fail('User added a conflicting task');
        })
        .catch((err: ConflictServiceError) => {
          expect(err.type).toEqual(ServiceErrorType.TASK_CONFLICT);
        });
    });
    it('will return a list of the conflicting tasks if add operation fails due to conflict', () => {
      mockValidator.validateTaskEntry.returns({
        conflict: true,
        invalid: false,
        conflictingTasks: [
          {
            id: 1,
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            week: 1,
            day: 1,
            location: 'Toronto',
            userID: 1,
          },
        ],
      });

      return service
        .addTask(
          {
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            week: 1,
            day: 1,
            location: 'Toronto',
            userID: 1,
          },
          new User(1, UserType.DISPATCHER),
        )
        .then(() => {
          fail('User added a conflicting task');
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
            location: 'Toronto',
            userID: 1,
          });
        });
    });
    it('will not add a driver task if start and/or end time is invalid', () => {
      mockValidator.validateTaskEntry.returns({
        conflict: false,
        invalid: true,
      });

      return service
        .addTask(
          {
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            week: 1,
            day: 1,
            location: 'Toronto',
            userID: 1,
          },
          new User(1, UserType.DISPATCHER),
        )
        .then(() => {
          fail('User added a conflicting task');
        })
        .catch((err: ServiceError) => {
          expect(err.type).toEqual(ServiceErrorType.INVALID_TIME_UNIT);
        });
    });
    it('will refuse to add a driver task if user does not have dispatcher permissions', () => {
      return service
        .addTask(
          {
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            week: 1,
            day: 1,
            location: 'Toronto',
            userID: 1,
          },
          new User(1, UserType.DRIVER),
        )
        .then(() => {
          fail('User without dispatcher permissions added a task');
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
        location: 'Toronto',
        userID: 1,
      });
      mockValidator.validateTaskEntry.returns({
        conflict: false,
        invalid: false,
      });

      return service
        .addTask(
          {
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            week: 1,
            day: 1,
            location: 'Toronto',
            userID: 1,
          },
          new User(1, UserType.DISPATCHER),
        )
        .then((task) => {
          expect(task).toEqual({
            id: 1,
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            week: 1,
            day: 1,
            location: 'Toronto',
            userID: 1,
          });
        });
    });
  });
  describe('updateTask', () => {
    it('updates a driver task successfully', () => {
      repo.add(1, {
        id: 1,
        type: DriverTaskType.DELIVER,
        start: 1,
        end: 3,
        week: 1,
        day: 1,
        location: 'Toronto',
        userID: 1,
      });
      mockValidator.validateTaskEntry.returns({
        conflict: false,
        invalid: false,
      });

      // Precondition: Item has not been modified yet
      let task: DriverTask = repo.get(1);
      expect(task.type).toEqual(DriverTaskType.DELIVER);
      expect(task.start).toEqual(1);
      expect(task.end).toEqual(3);
      expect(task.week).toEqual(1);
      expect(task.day).toEqual(1);
      expect(task.location).toEqual('Toronto');
      expect(task.userID).toEqual(1);

      return service
        .updateTask(
          1,
          {
            type: DriverTaskType.OTHER,
            start: 5,
            end: 6,
            week: 2,
            day: 2,
            location: 'Guelph',
            userID: 2,
          },
          new User(1, UserType.DISPATCHER),
        )
        .then((task) => {
          expect(task.type).toEqual(DriverTaskType.OTHER);
          expect(task.start).toEqual(5);
          expect(task.end).toEqual(6);
          expect(task.week).toEqual(2);
          expect(task.day).toEqual(2);
          expect(task.location).toEqual('Guelph');
          expect(task.userID).toEqual(2);
          // As another confidence check: The record returned should match the record retrieved directly from repo
          let repoTask: DriverTask = repo.get(1);
          expect(repoTask).toEqual(task);
        });
    });
    it('will not update a driver task if its new schedule conflicts with another task', () => {
      mockValidator.validateTaskEntry.returns({
        conflict: true,
        invalid: false,
        conflictingTasks: [
          {
            id: 1,
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            week: 1,
            day: 1,
            location: 'Toronto',
            userID: 1,
          },
        ],
      });

      return service
        .updateTask(
          1,
          {
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            week: 1,
            day: 1,
            location: 'Toronto',
            userID: 1,
          },
          new User(1, UserType.DISPATCHER),
        )
        .then(() => {
          fail('User updated a conflicting task');
        })
        .catch((err: ConflictServiceError) => {
          expect(err.type).toEqual(ServiceErrorType.TASK_CONFLICT);
        });
    });
    it('will return a list of the conflicting tasks if update operation fails due to conflict', () => {
      mockValidator.validateTaskEntry.returns({
        conflict: true,
        invalid: false,
        conflictingTasks: [
          {
            id: 1,
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            week: 1,
            day: 1,
            location: 'Toronto',
            userID: 1,
          },
        ],
      });

      return service
        .updateTask(
          1,
          {
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            week: 1,
            day: 1,
            location: 'Toronto',
            userID: 1,
          },
          new User(1, UserType.DISPATCHER),
        )
        .then(() => {
          fail('User updated a conflicting task');
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
            location: 'Toronto',
            userID: 1,
          });
        });
    });
    it('will not update a driver task if start and/or end time is invalid', () => {
      mockValidator.validateTaskEntry.returns({
        conflict: false,
        invalid: true,
      });

      return service
        .updateTask(
          1,
          {
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            week: 1,
            day: 1,
            location: 'Toronto',
            userID: 1,
          },
          new User(1, UserType.DISPATCHER),
        )
        .then(() => {
          fail('User updated a task with invalid time');
        })
        .catch((err: ConflictServiceError) => {
          expect(err.type).toEqual(ServiceErrorType.INVALID_TIME_UNIT);
        });
    });
    it('will refuse to update a driver task if user does not have dispatcher permissions', () => {
      return service
        .updateTask(
          1,
          {
            type: DriverTaskType.OTHER,
            start: 5,
            end: 6,
            week: 2,
            day: 2,
            location: 'Guelph',
            userID: 2,
          },
          new User(1, UserType.DRIVER),
        )
        .then(() => {
          fail('User without dispatcher permissions updated a task');
        })
        .catch((err) => {
          expect(err.type).toEqual(ServiceErrorType.INSUFFICIENT_PERMISSIONS);
        });
    });
    it('will throw a service error if updating a driver task that does not exist', async () => {
      mockValidator.validateTaskEntry.returns({
        conflict: false,
        invalid: false,
      });

      await expect(
        service.updateTask(
          1,
          {
            type: DriverTaskType.OTHER,
            start: 5,
            end: 6,
            week: 2,
            day: 2,
            location: 'Guelph',
            userID: 2,
          },
          new User(1, UserType.DISPATCHER),
        ),
      ).rejects.toThrow(ServiceError);
    });
    it('will report entry not found error if updating a driver task that does not exist', () => {
      mockValidator.validateTaskEntry.returns({
        conflict: false,
        invalid: false,
      });

      return service
        .updateTask(
          1,
          {
            type: DriverTaskType.OTHER,
            start: 5,
            end: 6,
            week: 2,
            day: 2,
            location: 'Guelph',
            userID: 2,
          },
          new User(1, UserType.DISPATCHER),
        )
        .then(() => {
          fail('Updated a nonexistent task');
        })
        .catch((err: ServiceError) => {
          expect(err.type).toEqual(ServiceErrorType.ENTRY_NOT_FOUND);
        });
    });
  });
  describe('deleteTask', () => {
    it('deletes a driver task successfully', () => {
      repo.add(1, {
        id: 1,
        type: DriverTaskType.DELIVER,
        start: 1,
        end: 3,
        week: 1,
        day: 1,
        location: 'Toronto',
        userID: 1,
      });

      return service.deleteTask(1, new User(1, UserType.DISPATCHER));
    });
    it('will refuse to delete a driver task if user does not have dispatcher permissions', () => {
      repo.add(1, {
        id: 1,
        type: DriverTaskType.DELIVER,
        start: 1,
        end: 3,
        week: 1,
        day: 1,
        location: 'Toronto',
        userID: 1,
      });

      return service
        .deleteTask(1, new User(1, UserType.DRIVER))
        .then(() => {
          fail('User deleted task with insufficient permissions');
        })
        .catch((err: ServiceError) => {
          expect(err.type).toEqual(ServiceErrorType.INSUFFICIENT_PERMISSIONS);
        });
    });
    it('will throw a service error if task of specified id does not exist', async () => {
      await expect(
        service.deleteTask(1, new User(1, UserType.DISPATCHER)),
      ).rejects.toThrow(ServiceError);
    });
    it('will report entry not found error if task of specified id does not exist', () => {
      return service
        .deleteTask(1, new User(1, UserType.DISPATCHER))
        .then(() => {
          fail('User deleted nonexistent task');
        })
        .catch((err: ServiceError) => {
          expect(err.type).toEqual(ServiceErrorType.ENTRY_NOT_FOUND);
        });
    });
  });
  describe('getWeeklyUserTasks', () => {
    it("will get a given user's tasks at specified week", () => {
      repo.add(1, {
        id: 1,
        type: DriverTaskType.DELIVER,
        start: 1,
        end: 3,
        week: 1,
        day: 1,
        location: 'Toronto',
        userID: 1,
      });
      repo.add(2, {
        id: 2,
        type: DriverTaskType.DELIVER,
        start: 1,
        end: 3,
        week: 2,
        day: 1,
        location: 'Toronto',
        userID: 1,
      });

      return service
        .getWeeklyUserTasks(1, 1, new User(1, UserType.DISPATCHER))
        .then((tasks) => {
          expect(tasks).toHaveLength(1);
          expect(tasks).toContainEqual({
            id: 1,
            type: DriverTaskType.DELIVER,
            start: 1,
            end: 3,
            week: 1,
            day: 1,
            location: 'Toronto',
            userID: 1,
          });
        });
    });
    it("will throw an error if driver attempts to access another driver's weekly tasks", () => {
      service
        .getWeeklyUserTasks(1, 1, new User(2, UserType.DRIVER))
        .then(() => {
          fail("Driver was able to access tasks they don't have access to");
        })
        .catch((err: ServiceError) => {
          expect(err.type).toEqual(ServiceErrorType.INSUFFICIENT_PERMISSIONS);
        });
    });
  });
});
