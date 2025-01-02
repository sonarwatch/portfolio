import BigNumber from 'bignumber.js';

/* export enum SelfMatchingPreventionStyle {
  // Cancel older (resting) order in full. Continue to execute the newer taking order.
  CANCEL_OLDEST = 0,
}

export interface Order {
  orderId: string;
  clientOrderId: string;
  price: string;
  originalQuantity: string;
  quantity: string;
  isBid: boolean;
  owner: Uint8Array;
  expireTimestamp: string;
  selfMatchingPrevention: SelfMatchingPreventionStyle;
} */

export interface UserPosition {
  availableBaseAmount: BigNumber;
  lockedBaseAmount: BigNumber;
  availableQuoteAmount: BigNumber;
  lockedQuoteAmount: BigNumber;
}
