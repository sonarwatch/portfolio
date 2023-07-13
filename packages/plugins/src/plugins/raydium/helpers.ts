import { MintAccount, TokenAccount } from '../../utils/solana';
import { OpenOrdersV2 } from './structs';

type TokenOrOrder = TokenAccount | OpenOrdersV2 | MintAccount;
export function isTokenAccount(
  toBeDetermined: TokenOrOrder
): toBeDetermined is TokenAccount {
  if ((toBeDetermined as TokenAccount).amount) {
    return true;
  }
  return false;
}

export function isOpenOrderAccount(
  toBeDetermined: TokenOrOrder
): toBeDetermined is OpenOrdersV2 {
  if ((toBeDetermined as OpenOrdersV2).market) {
    return true;
  }
  return false;
}

export function isMintAccount(
  toBeDetermined: TokenOrOrder
): toBeDetermined is MintAccount {
  if ((toBeDetermined as MintAccount).mintAuthority) {
    return true;
  }
  return false;
}
