import { getClientAptos } from '../clients';
import { getView } from './getView';

describe('getView', () => {
  it('should getView', async () => {
    const client = getClientAptos();

    const view = await getView(client, {
      function:
        '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::stability_pool::account_deposit',
      typeArguments: [
        '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::stability_pool::Crypto',
      ],
      functionArguments: [
        '0x83699e64ad139e3be9996da314dc5679229e320e292476f33ce00c6681650b8e',
      ],
    });
    expect(view).not.toEqual(null);
  });
});
