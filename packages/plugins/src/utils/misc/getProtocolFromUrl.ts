export default function getProtocolFromUrl(url: string): string | null {
  try {
    return new URL(url).protocol;
  } catch (error) {
    return null;
  }
}
