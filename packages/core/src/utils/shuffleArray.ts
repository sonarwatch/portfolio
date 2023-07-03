export default function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    const temp2 = array[j];
    if (!temp || !temp2) throw new Error('');
    array.splice(i, 1, temp2);
    // eslint-disable-next-line no-param-reassign
    array[j] = temp;
  }
}
