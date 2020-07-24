import 'jest';

describe('DriverTaskValidator', () => {
  it('validates a driver task that does not conflict with any other driver task', () => {
    throw new Error('Not implemented');
  });
  it('validates a driver task when there are no other driver tasks (ie. it is the first one)', () => {
    throw new Error('Not implemented');
  });
  it('validates a driver task when there are two tasks that overlap but have different drivers', () => {
    throw new Error('Not implemented');
  });
  it('invalidates a driver task when two tasks conflict', () => {
    throw new Error('Not implemented');
  });
  it('invalidates a driver task if start and end time are the same', () => {
    throw new Error('Not implemented');
  });
  it('invalidates a driver task if end time is before start time', () => {
    throw new Error('Not implemented');
  });
});
