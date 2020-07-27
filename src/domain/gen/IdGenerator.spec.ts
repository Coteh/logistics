import 'jest';
import IdGenerator from './IdGenerator';

describe('IdGenerator', () => {
  it('returns a value without crash', () => {
    new IdGenerator().genID();
  });
  it('returns incremented value', () => {
    let idGen: IdGenerator = new IdGenerator(0);
    expect(idGen.genID()).toEqual(1);
  });
  it('increments next value', () => {
    let idGen: IdGenerator = new IdGenerator(0);
    idGen.genID();
    expect(idGen.genID()).toEqual(2);
  });
});
