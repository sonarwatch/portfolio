import { Platform } from '@sonarwatch/portfolio-core';

export const platformId = 'bucket';
export const platform: Platform = {
  id: platformId,
  name: 'Bucket',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/bucket.webp',
  defiLlamaId: 'bucket-protocol',
  website: 'https://bucketprotocol.io/',
};

export const buckId =
  '0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK';
export const sbuckId =
  '0x1798f84ee72176114ddbf5525a6d964c5f8ea1b3738d08d50d0d3de4cf584884::sbuck::SBUCK';

export const sBuckFlask =
  '0xc6ecc9731e15d182bc0a46ebe1754a779a4bfb165c201102ad51a36838a1a7b8';
export const stakeProofParentId =
  '0xbb4c253eec08636e0416cb8e820b4386c1042747fbdc5a5df6c025c9c6a06fef';

export const bucketProtocolId =
  '0x9e3dab13212b27f5434416939db5dec6a319d15b89a84fd074d03ece6350d3df';

export const bucketsCacheKey = 'buckets';

export const bottleTableException: { [key: string]: string } = {
  '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI':
    '0x95d0d20ab42f78f75a7d63513ed60415b9dcb41c58ef493a7a69b531b212e713',
  '0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI':
    '0x3674f3183780166553d42174d02229c679e431b9a5911d02a28271a8fd9abd88',
  '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT':
    '0x502760cac10dd4fae78672c1e27bc0e5cdbae449aa2b15dbfb72434af33cb8f6',
};
