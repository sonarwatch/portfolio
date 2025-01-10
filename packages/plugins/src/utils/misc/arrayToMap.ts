export const arrayToMap = <T, K = string>(
  array: T[],
  keyField: keyof T
): Map<K, T> => {
  const map = new Map<K, T>();
  array.forEach((item) => {
    if (!item) return;
    map.set(item[keyField] as K, item);
  });
  return map;
};
