export default function upperCaseFirstLetter(word: string): string {
  if (word.length > 1) return word.slice(0, 1).toUpperCase() + word.slice(1);
  return word.toUpperCase();
}
