/**
 * @deprecated
 * This function has been deprecated. Use the parseTypeString instead.
 */
export function getNestedType(type: string) {
  const index = type.indexOf('<');
  return type.slice(index + 1, -1);
}
