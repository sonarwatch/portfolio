export const platformId = 'program-id';

export enum ProgramCacheCategory {
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  DENY = 'DENY',
}

export const CACHE_CONFIG: Record<ProgramCacheCategory, { ttlHours: number; maxAccounts: number }> = {
  [ProgramCacheCategory.MEDIUM]: {
    ttlHours: 3,
    maxAccounts: 5000,
  },
  [ProgramCacheCategory.LARGE]: {
    ttlHours: 1,
    maxAccounts: 80000,
  },
  [ProgramCacheCategory.DENY]: {
    ttlHours: 0,
    maxAccounts: 0,
  },
};

export const programs = [
  // 'Stake11111111111111111111111111111111111111', Cannot create a string longer than 0x1fffffe8
  'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD',
  // 'MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA', Cannot create a string longer than 0x1fffffe8 characters
  // 'So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo', Cannot create a string longer than 0x1fffffe8 characters
  'CBuCnLe26faBpcBP2fktp4rp8abpcAnTWft6ZrP5Q4T',
  // '9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z', bad 257k items
  // 'EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q', bad 380k items
  'FarmqiPv5eAj3j1GMdMCMUGXqPUvmquZtMy86QH6rzhG',
  // 'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo', Cannot create a string longer than 0x1fffffe8 characters 2x
  // 'vaU6kP7iNEGkbmPkLmZfGwiGxd4Mob24QQCie5R9kd2', too large payload
  // 'FEESngU3neckdwib9X3KWqdL7Mjmqk9XNp3uh5JbP4KP', bad 90k items
  'TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN',
  // '4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg', too large object
  'zF2vSz6V9g1YHGmfrzsY497NJzbRr84QUrPry4bLQ25',
  'LiMoM9rMhrdYrfzUCxQppvxCSG1FcrUK9G8uLq4A1GF',
  // 'PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu', bad 684k items
  'VALaaymxQh2mNy2trH9jUqHT1mTow76wpTcGmSWSwJe',
  // 'jupoNjAxXgZ4rjzxzPMP4oxduvQsQtZzyknqvzYNrNu', too large payload
  // 'j1o2qRpjcyUwEvwtcfhEQefh773ZgjxcVRry7LDqg5X', bad 230k items
  'DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M',
  'LocpQgucEQHbqNABEYvBvwoxCPsSbG91A1QaQhQQqjn',
  'GFXsSL5sSaDfNFQUYsHekbWBW1TsFdjDYzACh62tEHxn',
  'STKRWxT4irmTthSJydggspWmkc3ovYHx62DHLPVv1f1',
  'GAMMA7meSFWaBXF25oSUgmGRwaW6sCMFLmBNiMSdbHVT',
  // 'rDeFiHPjHZRLiz4iBzMw3zv6unZs4VwdU6qQcVd3NSK', too large payload
  'rNfTQD84kwMbcRpWpLR92BVmxbuwrZc3o5HTauAZiXs',
  'rain2M5b9GeFCk792swkwUu51ZihHJb3SUQ8uHxSRJf',
  'LLoc8JX5dLAMVzbzTNKG6EFpkyJ9XCsVAGkqwQKUJoa',
  // 'Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR', too large payload
  // 'strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m', bad 191k items
  // '3parcLrT7WnXAcyPfkCz49oofuuf2guUKkjuFkAhZW8Y', bad 306k items
  // '2gWf5xLAzZaKX9tQj9vuXsaxTWtzTZDFRn21J3zjNVgu', too large payload
  // 'pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ',  Cannot create a string longer than 0x1fffffe8 characters
  'vAuLTsyrvSfZRuRB3XgvkPwNGgYSs9YRYymVebLKoxR',
  '9Fcn3Fd4d5ocrb12xCUtEvezxcjFEAyHBPfrZDiPt9Qj',
  'EuSLjg23BrtwYAk1t4TFe5ArYSXCVXLBqrHRBfWQiTeJ',
  'BVddkVtFJLCihbVrtLo8e3iEd9NftuLunaznAxFFW8vf',
  'HYHnL9BB3tqSPxkVbdcAn9CAa4hyqNYUh1FwDc4he7aD',
  'EDnxACbdY1GeXnadh5gRuCJnivP7oQSAHGGAHCma4VzG',
  // 'STAKEkKzbdeKkqzKpLkNQD3SUuLgshDKCD7U8duxAbB', bad 122k items
  // '6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup', bad 390k items
  'DF8vgzUDH2CGywD7Gd9jd9Y5Kwmrx97h4Viumjo4rrr6',
  'AvqeyEDqW9jaBi7yrRA6AxJtLbMzRY9NX75HuPTMoS4i',
  'ATLocKpzDbTokxgvnLew3d7drZkEzLzDpzwgrgWKDbmc',
  'TLPv2tuSVvn3fSk8RgW3yPddkp5oFivzZV3rA9hQxtX',
  // 'PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY', bad 107k items
  'UXDSkps5NR8Lu1HB5uPLFfuB34hZ6DCk7RhYZZtGzbF',
  'MGoV9M6YUsdhJzjzH9JMCW2tRe1LLxF1CjwqKC7DR1B',
  // '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt', bad 213k items x4
  'BanxxEcFZPJLKhS59EkwTa8SZez8vDYTiJVN78mGHWDi',
  'Vau1t6sLNxnzB7ZDsef8TLbPLfyZMYXH8WTNqUdm9g8',
  'SANDsy8SBzwUE8Zio2mrYZYqL52Phr2WQb9DDKuXMVK',
  // '85iDfUvr3HJyLM2zcq5BXSiDvUWfw6cSE1FfNBo8Ap29', bad 94k x2
  'HYzrD877vEcBgd6ySKPpa3pcMbqYEmwEF1GFQmvuswcC',
  // 'stPdYNaJNsV3ytS9Xtx4GXXXRcVqVS6x66ZFa26K39S', bad 116k x3
  // 'JCFRaPv7852ESRwJJGRy2mysUMydXZgVVhrMLmExvmVp', bad 134k x2
  // 'SHARKobtfF1bHhxD2eqftjHBdVSCbKo9JtgK71FhELP', too large payloads
  'bon4Kh3x1uQK16w9b9DKgz3Aw4AP1pZxBJk55Q6Sosb',
  '8BYmYs3zsBhftNELJdiKsCN2WyCBbrTwXd6WG4AFPr6n',
  'FoXpJL1exLBJgHVvdSHNKyKu2xX2uatctH9qp6dLmfpP',
  's1aysqpEyZyijPybUV89oBGeooXrR22wMNLjnG2SWJA',
  'QMMD16kjauP5knBwxNUJRZ1Z5o3deBuFrqVjBVmmqto',
  // 'QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB', bad 165k
  'rev31KMq4qzt1y1iw926p694MHVVWT57caQrsHLFA4x',
  // '1oopBoJG58DgkUVKkEzKgyG9dvRmpgeEm1AVjoHkF78', too large payload
  '6UBsNdYq3MEao1m9NXQD1VEmXvptUXhfMwdHANGAo4bs',
  'B3FS1X2PZPBrtBZiyAN9oqABnu3o5YWwdY5ioqoVh64P',
  'SkFLfp7eSRsan13dEUZSVzMBj3vdyZnhaasFKQTzuiE',
  '6VwarrrqWVWAmZtNdgGafeyoXD3SsspKxuxkZVarZqTA',
  '9p5Sc5SvR8QpJCQV3U4q6zVUTupr4Tr9Jmf48sbcSjtX',
  'FRyGij76xTvAg1nPPTaXHfa3QxUfZuKARuAyAaMyoLPo',
  'A7PDwCJ3qcdVoZLqq7wHAwMq9yEKZU2vFx7Y9qbZ1dKJ',
  'V1enDN8GY531jkFp3DWEQiRxwYYsnir8SADjHmkt4RG',
  '2jmux3fWV5zHirkEZCoSMEgTgdYZqkE9Qx2oQnxoHRgA',
  'GTavkffQHnDKDH36YNFpk7uxwHNseTRo24tV4HGC8MNY',
  '8F2VM13kdMBaHtcXPHmArtLueg7rfsa3gnrgGjAy4oCu',
  'ensoQXKf4MvNuEC3M9xmcqUqgucFNd5UzAonDdUtgqn',
  'ensSuXMeaUhRC7Re3ukaxLcX2E4qmd2LZxbxsK9XcWz',
  'poo1sKMYsZtDDS7og73L68etJQYyn6KXhXTLz1hizJc',
  'KJ6b6PswEZeNSwEh1po51wxnbX1C3FPhQPhg8eD2Y6E',
  'dvyFwAPniptQNb1ey4eM12L8iLHrzdiDsPPDndd6xAR',
  'ExponentnaRg3CQbW6dqQNZKXp7gtZ9DGMp1cwC4HAS7',
  'tuna4uSQZncNeeiAMKbstuxA9CUkHH6HmC64wgmnogD',
  '3i8rGP3ex8cjs7YYWrQeE4nWizuaStsVNUXpRGtMbs3H',
  'g3yMgSB3Q7gNjMfSoCm1PiJihqHdNJeUuPHvRyf45qY',
  '5UFYdXHgXLMsDzHyv6pQW9zv3fNkRSNqHwhR7UPnkhzy',
  'HE6bCtjsrra8DRbJnexKoVPSr5dYs57s3cuGHfotiQbq',
  'q8gz8Sww7Xexpqk9DrEMjNXMHnFx6dB3EYe32PwHHd6',
  'TRDwq3BN4mP3m9KsuNUWSN6QDff93VKGSwE95Jbr9Ss',
  'TRDwq3BN4mP3m9KsuNUWSN6QDff93VKGSwE95Jbr9Ss',
  'ZPLt7XEyRvRxEZcGFGnRKGLBymFjQbwmgTZhMAMfGAU',
  'ARFxpgenuFNbyoysFdqEwTgEdxtLtHbTHwCWHJjqWHTb',
  'NirvHuZvrm2zSxjkBvSbaF2tHfP5j7cvMj9QmdoHVwb',
  'gp8fqiE5cwX3JRT8unpKeFutNdMihyisAe3nx6L3S1p',
  'vsRJM68m7i18PwzTFphgPYXTujCgxEi28knpUwSmg3q',
  'F1pkXm8W1WNbRvMoZTuKftHJ92ffuzddCCSRKKvCVL7n',
  '1avaAUcjccXCjSZzwUvB2gS3DzkkieV2Mw8CjdN65uu',
  'CRSeeBqjDnm3UPefJ9gxrtngTsnQRhEJiTA345Q83X3v',
  'HYDqq5GfUj4aBuPpSCs4fkmeS7jZHRhrrQ3q72KsJdD4',
  'C73nDAFn23RYwiFa6vtHshSbcg8x6BLYjw3bERJ3vHxf',
  'GLoWMgcn3VbyFKiC2FGMgfKxYSyTJS7uKFwKY2CSkq9X',
  'CNDL7Y1SYqvSF34aXayqHjm2JZrHB7BfhhVi3TUan3fe',
  'STAKEGztX7S1MUHxcQHieZhELCntb9Ys9BgUbeEtMu1',
  'STAKEvGqQTtzJZH6BWDcbpzXXn2BBerPAgQ3EGLN2GH',
  'NXFiKimQN3QSL3CDhCXddyVmLfrai8HK36bHKaAzK7g',
  '13gDzEXCdocbj8iAiqrScGo47NiSuYENGsRqi3SEAwet',
  '6M3fyRE18t6c7f9qes3eQMzR4QyPRMFZiyNQcApENCYf',
  // 'voTpe3tHQ7AjQHMapgSue2HJFAh2cGsdokqN3XqmVSj', bad 433k
  's1aysqpEyZyijPybUV89oBGeooXrR22wMNLjnG2SWJA',
];
