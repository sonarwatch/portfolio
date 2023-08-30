import { platforms } from './index';

describe('platforms', () => {
  it('should have unique ids', async () => {
    const platformIds: Set<string> = new Set();
    platforms.forEach((p) => {
      platformIds.add(p.id);
    });
    expect(platformIds.size).toEqual(platforms.length);
  });
});
