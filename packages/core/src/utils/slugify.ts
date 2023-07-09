export default function slugify(str: string) {
  return str
    .trim()
    .replace(',', '-')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-');
}
