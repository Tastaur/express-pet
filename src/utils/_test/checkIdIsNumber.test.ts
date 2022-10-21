import { checkIdIsNumber } from "../checkIdIsNumber";


describe('checkIdIsNumber tests', () => {
  const testString = 'string';
  const testObjectString = '{}';
  const testArrayString = '[]';
  const testNumberString = '1';

  it('should return number', () => {
    expect(checkIdIsNumber(testNumberString)).toEqual(1);
  });
  it('should return null', () => {
    expect(checkIdIsNumber(testString)).toBeNull();
    expect(checkIdIsNumber(testObjectString)).toBeNull();
    expect(checkIdIsNumber(testArrayString)).toBeNull();
  });
});