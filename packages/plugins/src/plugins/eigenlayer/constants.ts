export const platformId = 'eigenlayer';
export const platform = {
  id: platformId,
  name: 'Eigenlayer',
};

export const chain = 'ethereum';

const eigenTokenAddress = '0xec53bf9167f50cdeb3ae105f56099aaab9061f83';

// Using this mapping to get the prices of the (backed, mapped, wrapped) eigenlayer tokens that are not supported on coingecko
export const customEigenlayerTokenMapping = {
  // Backing Eigen (bEIGEN)
  '0x83E9115d334D248Ce39a6f36144aEaB5b3456e75': eigenTokenAddress,
};
