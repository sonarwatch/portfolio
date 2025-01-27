export const rateFactor = (e: number) => {
  if (e > 1) {
    return 4;
  }
  return e > 0.9
    ? ((e - 0.9) * 3) / 0.09999999999999998 + 1
    : 1 - ((0.9 - e) * 0.75) / 0.9;
};
