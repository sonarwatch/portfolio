import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { logger } from '../logger/logger';
import nftService from '../services/nft';

const initNftRoutes = (app: FastifyInstance) => {
  app.get(
    '/api/v1/addresses/:address/nfts',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            address: { type: 'string' },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const { address } = req.params as any;
      logger.info(`NFTs requested. Address: ${address}`);
      const result = await nftService.getNfts(address);
      return reply.send(result);
    },
  );
};

export { initNftRoutes };
