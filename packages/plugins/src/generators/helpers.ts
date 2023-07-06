const toKebabCaseRegexp =
  /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;

export function toKebabCase(str: string): string {
  if (!str) return '';
  return (
    str
      .match(toKebabCaseRegexp)
      ?.map((x) => x.toLowerCase())
      .join('-') || ''
  );
}
