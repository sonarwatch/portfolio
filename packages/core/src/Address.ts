export const AddressSystem = {
  solana: 'solana',
  bitcoin: 'bitcoin',
  evm: 'evm',
  move: 'move',
  sei: 'sei',
} as const;

export type AddressSystemType =
  (typeof AddressSystem)[keyof typeof AddressSystem];
