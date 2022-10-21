export const checkStringIsBoolean = (dataString: string): boolean => {
  return ['false', 'true'].includes(dataString);
};