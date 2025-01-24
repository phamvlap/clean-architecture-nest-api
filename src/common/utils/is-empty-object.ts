export const isEmptyObject = (value: object): boolean => {
  for (const key in value) {
    if (Object.hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
};
