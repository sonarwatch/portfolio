import { SuiClient as MystenSuiClient } from '@mysten/sui.js/client';
import { PublicClient } from 'viem';

export type EvmClient = PublicClient;
export type SuiClient = MystenSuiClient;
