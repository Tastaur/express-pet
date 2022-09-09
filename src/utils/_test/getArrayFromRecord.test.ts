import { getArrayFromRecord } from "../getArrayFromRecord";


describe('getArrayFromRecord tests', ()=>{
  it('should return array users', () => {
    interface Test { id: string, name: string}
    const data: Record<string, Test> = { 1: { id: '1', name: 'name' } };
    expect(getArrayFromRecord(data)).toEqual([{ id: '1', name: 'name' }]);
  });
});