import 'jest';
import { DriverTaskRepository } from '../repository/DriverTaskRepository';
import { StubbedClass, createSinonStubInstance } from '../../test/test_helper';
import DriverTaskValidator, {
  DriverTaskValidationResult,
} from './DriverTaskValidator';
import { DriverTaskType } from '../type/DriverTaskType';

describe('DriverTaskValidator', () => {
  let repo: DriverTaskRepository;
  let validator: DriverTaskValidator;

  beforeEach(() => {
    repo = new DriverTaskRepository();
    validator = new DriverTaskValidator(repo);
  });

  it('validates a driver task that does not conflict with any other driver task', () => {
    repo.add(1, {
      id: 1,
      type: DriverTaskType.DELIVER,
      start: 8,
      end: 9,
      week: 1,
      day: 1,
      location: 'Toronto',
      userID: 1,
    });

    let result: DriverTaskValidationResult = validator.validateTaskEntry({
      start: 1,
      end: 3,
      week: 1,
      day: 1,
      userID: 1,
    });

    expect(result.conflict).toBeFalsy();
    expect(result.invalid).toBeFalsy();
    expect(result.conflictingTasks).toBeUndefined();
  });
  it('validates a driver task when there are no other driver tasks (ie. it is the first one)', () => {
    let result: DriverTaskValidationResult = validator.validateTaskEntry({
      start: 1,
      end: 3,
      week: 1,
      day: 1,
      userID: 1,
    });

    expect(result.conflict).toBeFalsy();
    expect(result.invalid).toBeFalsy();
    expect(result.conflictingTasks).toBeUndefined();
  });
  it('validates a driver task when there are two tasks that overlap but have different drivers', () => {
    repo.add(1, {
      id: 1,
      type: DriverTaskType.DELIVER,
      start: 1,
      end: 2,
      week: 1,
      day: 1,
      location: 'Toronto',
      userID: 1,
    });

    let result: DriverTaskValidationResult = validator.validateTaskEntry({
      start: 1,
      end: 3,
      week: 1,
      day: 1,
      userID: 2,
    });

    expect(result.conflict).toBeFalsy();
    expect(result.invalid).toBeFalsy();
    expect(result.conflictingTasks).toBeUndefined();
  });
  it('invalidates a driver task when two tasks conflict', () => {
    repo.add(1, {
      id: 1,
      type: DriverTaskType.DELIVER,
      start: 1,
      end: 2,
      week: 1,
      day: 1,
      location: 'Toronto',
      userID: 1,
    });

    let result: DriverTaskValidationResult = validator.validateTaskEntry({
      start: 1,
      end: 3,
      week: 1,
      day: 1,
      userID: 1,
    });

    expect(result.conflict).toBeTruthy();
  });
  it('returns the conflicting driver task(s) when two tasks conflict', () => {
    repo.add(1, {
      id: 1,
      type: DriverTaskType.DELIVER,
      start: 1,
      end: 2,
      week: 1,
      day: 1,
      location: 'Toronto',
      userID: 1,
    });

    let result: DriverTaskValidationResult = validator.validateTaskEntry({
      start: 1,
      end: 3,
      week: 1,
      day: 1,
      userID: 1,
    });

    expect(result.conflictingTasks).toHaveLength(1);
  });
  it('invalidates a driver task if start and end time are the same', () => {
    let result: DriverTaskValidationResult = validator.validateTaskEntry({
      start: 1,
      end: 1,
      week: 1,
      day: 1,
      userID: 1,
    });

    expect(result.invalid).toBeTruthy();
  });
  it('invalidates a driver task if end time is before start time', () => {
    let result: DriverTaskValidationResult = validator.validateTaskEntry({
      start: 3,
      end: 1,
      week: 1,
      day: 1,
      userID: 1,
    });

    expect(result.invalid).toBeTruthy();
  });
});
