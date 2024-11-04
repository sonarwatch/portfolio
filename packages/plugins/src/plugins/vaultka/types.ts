import { BeetStruct } from '@metaplex-foundation/beet';
import {
  LstPositionInfo,
  LstStrategy,
  PositionInfo,
  Strategy,
} from './structs';

export type StrategyInfo = {
  pubkey: string;
  strategyStruct: BeetStruct<Strategy | LstStrategy>;
  positionInfoStruct: BeetStruct<PositionInfo | LstPositionInfo>;
};
