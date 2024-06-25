export const arrayToMap = <T>(
  array: T[],
  keyField: keyof T
): Map<string, T> => {
  const map = new Map<string, T>();
  array.forEach((item) => {
    map.set(item[keyField] as string, item);
  });
  return map;
};
