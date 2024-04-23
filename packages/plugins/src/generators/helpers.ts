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

function trimAndUpper(text: string) {
  return text.replace(/-/, '').toUpperCase();
}
function spaceAndUpper(text: string) {
  return text.replace(/-/, ' ').toUpperCase();
}

export function lowerFirstLetter(string: string): string {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

export function idToPascalCase(id: string) {
  return id.replace(/(^\w|-\w)/g, trimAndUpper);
}

export function idToSpacedPascalCase(id: string) {
  return id.replace(/(^\w|-\w)/g, spaceAndUpper);
}
