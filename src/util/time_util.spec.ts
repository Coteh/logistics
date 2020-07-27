import 'jest';
import { hoursToTimeString, createHoursArr, getClampedWeek } from './time_util';

describe('time_util', () => {
  describe('hoursToTimeString', () => {
    it('should convert a given discrete morning hour to AM time string', () => {
      expect(hoursToTimeString(3)).toEqual('02:00 AM');
    });
    it('should convert 1 to 12 AM', () => {
      expect(hoursToTimeString(1)).toEqual('12:00 AM');
    });
    it('should convert 13 to 12 PM', () => {
      expect(hoursToTimeString(13)).toEqual('12:00 PM');
    });
    it('should convert a given discrete afternoon hour to PM time string', () => {
      expect(hoursToTimeString(16)).toEqual('03:00 PM');
    });
  });
  describe('createHoursArr', () => {
    it('should create an array from 1-24', () => {
      expect(createHoursArr()).toEqual(
        new Array(24).fill(0).map((_, i) => i + 1),
      );
    });
  });
  describe('getClampedWeek', () => {
    it('should return any week between 1 and 52', () => {
      expect(getClampedWeek(4)).toEqual(4);
    });
    it('should return week 1', () => {
      expect(getClampedWeek(1)).toEqual(1);
    });
    it('should return week 52', () => {
      expect(getClampedWeek(52)).toEqual(52);
    });
    it('should return week 52 if input is 0', () => {
      expect(getClampedWeek(0)).toEqual(52);
    });
    it('should return week 1 if input is 53', () => {
      expect(getClampedWeek(53)).toEqual(1);
    });
    it('should clamp to higher weeks if input is less than 1', () => {
      expect(getClampedWeek(-4)).toEqual(48);
    });
    it('should clamp to lower weeks if input is greater than 52', () => {
      expect(getClampedWeek(57)).toEqual(5);
    });
  });
});
