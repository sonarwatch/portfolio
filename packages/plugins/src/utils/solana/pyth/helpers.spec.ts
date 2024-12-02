import { PublicKey } from '@solana/web3.js';
import { getClientSolana } from '../../clients';
import { getPythPrice } from './helpers';

describe('getPythPrice', () => {
  it('should get pyth price', async () => {
    const connection = getClientSolana();
    const price = await getPythPrice(
      connection,
      new PublicKey('7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE')
    );
    // console.log('price:', price);
    expect(price).not.toBeNull();
  });
});
