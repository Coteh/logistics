import 'jest';
import { hoursToTimeString, createHoursArr } from './time_util';

describe('time_util', () => {
  describe('hoursToTimeString', () => {
    it('should convert a given discrete morning hour to AM time string', () => {
      expect(hoursToTimeString(3)).toEqual('03:00 AM');
    });
    it('should convert 0 to 12 AM', () => {
      expect(hoursToTimeString(0)).toEqual('12:00 AM');
    });
    it('should convert 12 to 12 PM', () => {
      expect(hoursToTimeString(12)).toEqual('12:00 PM');
    });
    it('should convert a given discrete afternoon hour to PM time string', () => {
      expect(hoursToTimeString(16)).toEqual('04:00 PM');
    });
  });
  describe('createHoursArr', () => {
    // TODO should I change from 0-23 to 1-24? Because requirements said specifically interval should be 1-24...
    it('should create an array from 0-23', () => {
      expect(createHoursArr()).toEqual(new Array(24).fill(0).map((_, i) => i));
    });
  });
});
