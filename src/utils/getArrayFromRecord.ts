export const getArrayFromRecord = <K extends string | number, T>(record: Record<K, T>): Array<T> => {
  return Object.values(record);
};