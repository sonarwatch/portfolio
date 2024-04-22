export function extract(str: string, regex: RegExp): string | null {
  const matches = str.match(regex);
  if (matches && matches[1]) {
    return matches[1]
  }
  return null
}
