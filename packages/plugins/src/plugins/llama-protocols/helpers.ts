import { LlamaProtocol, LlamaProtocolFull } from './types';

export function shrinkLlamaProtocol(
  protocol: LlamaProtocolFull
): LlamaProtocol {
  return {
    chain: protocol.chain,
    id: protocol.id,
    logo: protocol.logo,
    name: protocol.name,
    slug: protocol.slug,
    tvl: protocol.tvl,
    url: protocol.url,
    deadUrl: protocol.deadUrl,
    openSource: protocol.openSource,
    rugged: protocol.rugged,
    twitter: `https://twitter.com/${protocol.twitter}`,
  };
}
