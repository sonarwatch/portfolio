export const AddressSystem = {
  solana: 'solana',
  bitcoin: 'bitcoin',
  evm: 'evm',
  move: 'move',
} as const;

export type AddressSystemType = (typeof AddressSystem)[keyof typeof AddressSystem];
