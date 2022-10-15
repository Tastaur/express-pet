export const filterByStringBoolean = (field: boolean, stringValue?: string): boolean => {
  if (stringValue && ['false', 'true'].includes(stringValue)) {
    if (field && 'true' === stringValue) {
      return true;
    }
    return !field && 'false' === stringValue;
  }
  return true;
};