import 'jest';
import { getNumberInputFromString } from './input_util';

describe('input_util', () => {
  it('should parse int from string', () => {
    expect(getNumberInputFromString('4')).toEqual(4);
  });
  it('should handle parsing of invalid string', () => {
    expect(getNumberInputFromString('')).toEqual(0);
  });
});
