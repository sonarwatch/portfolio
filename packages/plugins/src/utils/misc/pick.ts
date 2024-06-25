export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const pickFromArray = <T extends object, K extends keyof T>(
  items: T[],
  keys: K[]
): Pick<T, K>[] => items.map((item) => pick(item, keys));
