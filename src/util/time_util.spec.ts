import 'jest';
import { hoursToTimeString, createHoursArr } from './time_util';

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
});
