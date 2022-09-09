export const getArrayFromRecord = <T>(record: Record<string, T>): Array<T> =>{
  return Object.values(record);
};