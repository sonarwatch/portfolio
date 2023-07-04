import getProtocolFromUrl from './getProtocolFromUrl';

export default function isHttpUrl(url: string): boolean {
  const protocol = getProtocolFromUrl(url);
  return protocol === 'http:' || protocol === 'https:';
}
