import { createHash } from 'crypto';
import TTLCache from '@isaacs/ttlcache';
import { Commitment, Connection, FetchMiddleware } from '@solana/web3.js';
import { ClientType, NetworkId } from '@sonarwatch/portfolio-core';
import { getRpcEndpoint } from './constants';
import { getBasicAuthHeaders } from '../misc/getBasicAuthHeaders';
import { SolanaClient } from './types';

export type SolanaClientParams = {
  commitment?: Commitment;
  clientType?: ClientType;
};

export interface ConnectionManagerConfig {
  maxConnections?: number;
  ttlMs?: number;
  enableLogging?: boolean;
  logInterval?: number;
}

export class SolanaConnectionManager {
  private connectionPool: TTLCache<string, Connection>;
  private reqs: Record<string, Record<string, number>> = {
    all: { total: 0 },
  };
  private config: Required<ConnectionManagerConfig>;

  constructor(config: ConnectionManagerConfig = {}) {
    this.config = {
      maxConnections: config.maxConnections ?? 5,
      ttlMs: config.ttlMs ?? 1_800_000, // 30 minutes
      enableLogging: config.enableLogging ?? process.env['PORTFOLIO_RPC_LOGS'] === 'true',
      logInterval: config.logInterval ?? 5,
    };

    this.connectionPool = new TTLCache<string, Connection>({
      max: this.config.maxConnections,
      ttl: this.config.ttlMs,
      dispose: (key, conn) => {
        if (this.config.enableLogging) {
          console.log(`[SolanaConnectionManager] Evicted connection: ${key}`);
        }
      },
    });
  }

  private createConnectionKey(
    url: string,
    commitment: Commitment,
    hasAuth: boolean
  ): string {
    const urlHash = createHash('sha256').update(url).digest('hex').substring(0, 8);
    return `${urlHash}:${commitment}:${hasAuth}`;
  }

  private createFetchMiddleware(): FetchMiddleware | undefined {
    if (!this.config.enableLogging) return undefined;

    return (info, init, fetch) => {
      let method: string | undefined;
      try {
        const body = init?.body?.toString();
        if (body) {
          const parsed = JSON.parse(body);
          method = parsed?.method;
        }
      } catch (error) {
        if (this.config.enableLogging) {
          console.warn('[SolanaConnectionManager] Failed to parse request body:', error);
        }
      }

      if (typeof method !== 'string') {
        return fetch(info, init);
      }

      this.reqs['all'][method] = (this.reqs['all'][method] || 0) + 1;
      this.reqs['all']['total'] += 1;
      if (typeof info === 'string') {
        const hash = createHash('sha256').update(info).digest('hex').substring(0, 8);
        if (!this.reqs[hash]) {
          this.reqs[hash] = { total: 0 };
        }
        this.reqs[hash][method] = (this.reqs[hash][method] || 0) + 1;
        this.reqs[hash]['total'] += 1;
      }
      if (this.reqs['all']['total'] % this.config.logInterval === 1) {
        console.log(`[SolanaConnectionManager] RPC Stats:`, {
          totalRequests: this.reqs['all']['total'],
          poolSize: this.connectionPool.size,
          topMethods: this.getTopMethods(5),
        });
      }

      return fetch(info, init);
    };
  }

  private getTopMethods(limit: number): Array<{ method: string; count: number }> {
    return Object.entries(this.reqs['all'])
      .filter(([method]) => method !== 'total')
      .map(([method, count]) => ({ method, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  public getClientSolana(params?: SolanaClientParams): SolanaClient {
    const commitment = params?.commitment || 'confirmed';
    const rpcEndpoint = getRpcEndpoint(NetworkId.solana, params?.clientType);

    const httpHeaders = rpcEndpoint.basicAuth
      ? getBasicAuthHeaders(
        rpcEndpoint.basicAuth.username,
        rpcEndpoint.basicAuth.password
      )
      : undefined;

    const connectionKey = this.createConnectionKey(
      rpcEndpoint.url,
      commitment,
      !!rpcEndpoint.basicAuth
    );

    let connection = this.connectionPool.get(connectionKey);

    if (!connection) {
      try {
        connection = new Connection(rpcEndpoint.url, {
          commitment,
          httpHeaders,
          fetchMiddleware: this.createFetchMiddleware(),
        });

        this.connectionPool.set(connectionKey, connection);

        if (this.config.enableLogging) {
          console.log(`[SolanaConnectionManager] Created connection: ${connectionKey}`);
          console.log(`[SolanaConnectionManager] Pool size: ${this.connectionPool.size}/${this.config.maxConnections}`);
        }
      } catch (error) {
        console.error(`[SolanaConnectionManager] Failed to create connection for ${connectionKey}:`, error);
        throw error;
      }
    }

    return connection;
  }
}

export const solanaConnectionManager = new SolanaConnectionManager();
export const getClientSolana = solanaConnectionManager.getClientSolana.bind(solanaConnectionManager);
