export const platformId = 'eigenlayer';
export const platform = {
  id: platformId,
  name: 'Eigenlayer',
};

export const chain = 'ethereum';

const eigenTokenAddress = '0xec53bf9167f50cdeb3ae105f56099aaab9061f83';

// Deposit address : https://debank.com/protocols/pool/0x91e677b07f7af907ec9a428aafa9fc14a0d3a338/eth
export const eigenPodManagerAddress =
  '0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338';

export const eigenDelegationManagerAddress =
  '0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A';

// Using this mapping to get the prices of the (backed, mapped, wrapped) eigenlayer tokens that are not supported on coingecko
export const customEigenlayerTokenMapping = {
  // Backing Eigen (bEIGEN)
  '0x83E9115d334D248Ce39a6f36144aEaB5b3456e75': eigenTokenAddress,
};
