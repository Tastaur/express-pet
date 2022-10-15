import { filterByStringBoolean } from "../filterByStringBoolean";


describe('filterByStringBoolean tests', () => {
  const item0 = { id: 1, hasTail: true };
  const item1 = { id: 2, hasTail: false };
  const queryTrue = 'true';
  const queryFalse = 'false';
  const queryRandom = 'random';
  const data = [item1, item0];
  it('should filter items with filed equal true', () => {
    expect(data.filter(item => filterByStringBoolean(item.hasTail, queryTrue))).toEqual([item0]);
  });
  it('should filter items with filed equal false', () => {
    expect(data.filter(item => filterByStringBoolean(item.hasTail, queryFalse))).toEqual([item1]);
  });
  it('should return array without changes', () => {
    expect(data.filter(item => filterByStringBoolean(item.hasTail, queryRandom))).toEqual(data);
    expect(data.filter(item => filterByStringBoolean(item.hasTail, undefined))).toEqual(data);
  });
});