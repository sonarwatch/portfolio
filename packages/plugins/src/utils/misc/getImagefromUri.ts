import { NetworkIdType } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import isHttpUrl from './isHttpUrl';
import isIpfsUrl from './isIpfsUrl';
import { Cache } from '../../Cache';

const nftImagesMaxLength = 2000;
const prefix = 'nftimage';
export const nftImagesUndefinedValue = 'undefined';

export async function getImagefromUri(
  uri: string | undefined,
  networkId: NetworkIdType,
  cache: Cache
): Promise<string | undefined> {
  if (!uri || uri.length > nftImagesMaxLength) return undefined;

  const cachedImage = await cache.getItem<string>(uri, {
    prefix,
    networkId,
  });
  if (cachedImage) {
    return cachedImage === nftImagesUndefinedValue ? undefined : cachedImage;
  }

  let image: string | undefined;
  if (isHttpUrl(uri)) image = await getImagefromHttpUrl(uri);
  if (isIpfsUrl(uri)) image = await getImagefromIpfsUrl(uri);

  if (image && image.length > nftImagesMaxLength) image = undefined;
  cache.setItem(uri, image || nftImagesUndefinedValue, {
    prefix,
    networkId,
  });
  return image;
}

export const imageExtensions = [
  '.png',
  '.jpg',
  '.jpeg',
  '.svg',
  '.gif',
  '.webp',
];
function stringEndsWithImageExtension(string: string) {
  const fString = string.toLowerCase();
  return imageExtensions.some((imageExtension) =>
    fString.endsWith(imageExtension)
  );
}

export async function getImagefromHttpUrl(
  url: string
): Promise<string | undefined> {
  const uriIsHttpUrl = isHttpUrl(url);
  if (!uriIsHttpUrl) return undefined;
  if (stringEndsWithImageExtension(url)) return url;

  const res = await axios.head(url, {
    timeout: 5000,
  });
  const contentType: string | undefined =
    res.headers['content-type'] || res.headers['Content-Type'] || undefined;

  const isContentTypeImage = contentType?.startsWith('image');
  if (isContentTypeImage) return url;

  const contentIsJson =
    contentType?.startsWith('application/json') ||
    contentType?.startsWith('text/plain');
  if (!contentIsJson) return undefined;

  const res2 = await axios.get(url, {
    timeout: 5000,
  });

  const uri = res2.data.image;
  let image: string | undefined;
  if (isHttpUrl(uri)) image = await getImagefromHttpUrl(uri);
  if (isIpfsUrl(uri)) image = await getImagefromIpfsUrl(uri);

  if (typeof uri === 'string') return image;
  return undefined;
}

const ipfsProtocolLenght = 'ipfs:'.length;
export async function getImagefromIpfsUrl(
  url: string
): Promise<string | undefined> {
  const uriIsIpfsUrl = isIpfsUrl(url);
  if (!uriIsIpfsUrl) return undefined;

  const httpUrl = `https://cf-ipfs.com/ipfs/${url.substring(
    ipfsProtocolLenght
  )}`;
  return getImagefromHttpUrl(httpUrl);
}
