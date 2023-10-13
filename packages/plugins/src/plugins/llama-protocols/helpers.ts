import { LlamaProtocol, LlamaProtocolFull } from '@sonarwatch/portfolio-core';

export function shrinkLlamaProtocol(
  protocol: LlamaProtocolFull
): LlamaProtocol {
  return {
    id: protocol.id,
    logo: protocol.logo,
    name: protocol.name,
    slug: protocol.slug,
    tvl: protocol.tvl,
    url: protocol.url,
    deadUrl: protocol.deadUrl,
    openSource: protocol.openSource,
    rugged: protocol.rugged,
    twitter: protocol.twitter
      ? `https://twitter.com/${protocol.twitter}`
      : undefined,
  };
}
