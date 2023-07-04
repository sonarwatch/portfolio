import getProtocolFromUrl from './getProtocolFromUrl';

export default function isIpfsUrl(url: string): boolean {
  return getProtocolFromUrl(url) === 'ipfs:';
}
