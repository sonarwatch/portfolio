import bs58 from 'bs58';

export const getDiscriminator = (data: string) => [
  ...bs58.decode(data).slice(0, 8),
];
