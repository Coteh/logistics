import 'jest';
import { DriverTaskRepository } from '../repository/DriverTaskRepository';
import {
  StubbedClass,
  createSinonStubInstance,
} from '../../../test/util/stub_class';
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

    expect(result.invalid).toBeFalsy();
  });
  it('does not report a conflict for two driver tasks that occur at different times of the day', () => {
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
  });
  it('does not return any conflicting tasks if there is no conflict', () => {
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

    expect(result.conflictingTasks).toBeUndefined();
  });
  it('does not report a conflict for a driver task when there are no other driver tasks (ie. it is the first one)', () => {
    let result: DriverTaskValidationResult = validator.validateTaskEntry({
      start: 1,
      end: 3,
      week: 1,
      day: 1,
      userID: 1,
    });

    expect(result.conflict).toBeFalsy();
  });
  it('does not report a conflict for a driver task when there are two tasks that overlap but have different drivers', () => {
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
  });
  it('does not report a conflict for a driver task that occurs within the same interval as another, but on a different day', () => {
    repo.add(1, {
      id: 1,
      type: DriverTaskType.DELIVER,
      start: 1,
      end: 2,
      week: 1,
      day: 2,
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
  });
  it('does not report a conflict for a driver task that occurs within the same interval as another, but on a different week', () => {
    repo.add(1, {
      id: 1,
      type: DriverTaskType.DELIVER,
      start: 1,
      end: 2,
      week: 2,
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
  });
  it('does not report a conflict with itself', () => {
    repo.add(1, {
      id: 1,
      type: DriverTaskType.DELIVER,
      start: 1,
      end: 2,
      week: 1,
      day: 2,
      location: 'Toronto',
      userID: 1,
    });

    let result: DriverTaskValidationResult = validator.validateTaskEntry({
      start: 1,
      end: 2,
      week: 1,
      day: 2,
      userID: 1,
      ignoreIDs: [1],
    });

    expect(result.conflict).toBeFalsy();
  });
  it('reports a conflict when two driver tasks overlap', () => {
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
      end: 2,
      week: 1,
      day: 1,
      userID: 1,
    });

    expect(result.conflict).toBeTruthy();
  });
  it('reports a conflict when task overlaps start of existing task', () => {
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

    let result: DriverTaskValidationResult = validator.validateTaskEntry({
      start: 2,
      end: 4,
      week: 1,
      day: 1,
      userID: 1,
    });

    expect(result.conflict).toBeTruthy();
  });
  it('reports a conflict when task overlaps the end of existing task', () => {
    repo.add(1, {
      id: 1,
      type: DriverTaskType.DELIVER,
      start: 2,
      end: 4,
      week: 1,
      day: 1,
      location: 'Toronto',
      userID: 1,
    });

    let result: DriverTaskValidationResult = validator.validateTaskEntry({
      start: 2,
      end: 4,
      week: 1,
      day: 1,
      userID: 1,
    });

    expect(result.conflict).toBeTruthy();
  });
  it('reports a conflict when task overlaps existing task with extra time on both sides', () => {
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
      start: 7,
      end: 10,
      week: 1,
      day: 1,
      userID: 1,
    });

    expect(result.conflict).toBeTruthy();
  });
  it('does not report a conflict when task is in between two other tasks', () => {
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
    repo.add(1, {
      id: 1,
      type: DriverTaskType.DELIVER,
      start: 5,
      end: 8,
      week: 1,
      day: 1,
      location: 'Toronto',
      userID: 1,
    });

    let result: DriverTaskValidationResult = validator.validateTaskEntry({
      start: 3,
      end: 5,
      week: 1,
      day: 1,
      userID: 1,
    });

    expect(result.conflict).toBeFalsy();
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
