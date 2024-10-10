import { Aptos } from '@aptos-labs/ts-sdk';
import { SuiClient as MystenSuiClient } from '@mysten/sui/client';
import { Connection } from '@solana/web3.js';
import { PublicClient } from 'viem';

export type EvmClient = PublicClient;
export type SuiClient = MystenSuiClient;
export type SolanaClient = Connection;
export type AptosClient = Aptos;
