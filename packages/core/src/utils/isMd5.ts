const regexExp = /^[a-f0-9]{32}$/gi;
export function isMd5(str: string) {
  return regexExp.test(str);
}
