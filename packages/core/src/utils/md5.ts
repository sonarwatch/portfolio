import crypto from 'node:crypto';

export function md5(str: string) {
  return crypto.createHash('md5').update(str).digest('hex');
}

const regexExp = /^[a-f0-9]{32}$/gi;
export function isMd5(str: string) {
  return regexExp.test(str);
}
