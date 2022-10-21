import { checkStringIsBoolean } from "../checkStringIsBoolean";


describe('checkStringIsBoolean tests', () => {
  it('should return true', () => {
    expect(checkStringIsBoolean('false')).toBeTruthy();
    expect(checkStringIsBoolean('true')).toBeTruthy();
  });
  it('should return false', () => {
    expect(checkStringIsBoolean('another string')).toBeFalsy();
  });
});