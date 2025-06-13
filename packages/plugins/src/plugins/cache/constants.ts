export const platformId = 'program-id';

export enum ProgramCacheCategory {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  DENY = 'DENY',
}

export const CACHE_CONFIG: Record<ProgramCacheCategory, { ttlHours: number; maxAccounts: number }> = {
  [ProgramCacheCategory.SMALL]: {
    ttlHours: 3,
    maxAccounts: 5000,
  },
  [ProgramCacheCategory.MEDIUM]: {
    ttlHours: 1,
    maxAccounts: 80000,
  },
  [ProgramCacheCategory.LARGE]: {
    ttlHours: 1,
    maxAccounts: 120000,
  },
  [ProgramCacheCategory.DENY]: {
    ttlHours: 0,
    maxAccounts: 0,
  },
};

export const smallPrograms = [
  'zF2vSz6V9g1YHGmfrzsY497NJzbRr84QUrPry4bLQ25',
  'STKRWxT4irmTthSJydggspWmkc3ovYHx62DHLPVv1f1',
  'GAMMA7meSFWaBXF25oSUgmGRwaW6sCMFLmBNiMSdbHVT',
  '9Fcn3Fd4d5ocrb12xCUtEvezxcjFEAyHBPfrZDiPt9Qj',
  'EuSLjg23BrtwYAk1t4TFe5ArYSXCVXLBqrHRBfWQiTeJ',
  'BVddkVtFJLCihbVrtLo8e3iEd9NftuLunaznAxFFW8vf',
  'HYHnL9BB3tqSPxkVbdcAn9CAa4hyqNYUh1FwDc4he7aD',
  'EDnxACbdY1GeXnadh5gRuCJnivP7oQSAHGGAHCma4VzG',
  'DF8vgzUDH2CGywD7Gd9jd9Y5Kwmrx97h4Viumjo4rrr6',
  'TLPv2tuSVvn3fSk8RgW3yPddkp5oFivzZV3rA9hQxtX',
  'UXDSkps5NR8Lu1HB5uPLFfuB34hZ6DCk7RhYZZtGzbF',
  'BanxxEcFZPJLKhS59EkwTa8SZez8vDYTiJVN78mGHWDi',
  'bon4Kh3x1uQK16w9b9DKgz3Aw4AP1pZxBJk55Q6Sosb',
  '6UBsNdYq3MEao1m9NXQD1VEmXvptUXhfMwdHANGAo4bs',
  'B3FS1X2PZPBrtBZiyAN9oqABnu3o5YWwdY5ioqoVh64P',
  'SkFLfp7eSRsan13dEUZSVzMBj3vdyZnhaasFKQTzuiE',
  '6VwarrrqWVWAmZtNdgGafeyoXD3SsspKxuxkZVarZqTA',
  '9p5Sc5SvR8QpJCQV3U4q6zVUTupr4Tr9Jmf48sbcSjtX',
  'FRyGij76xTvAg1nPPTaXHfa3QxUfZuKARuAyAaMyoLPo',
  'A7PDwCJ3qcdVoZLqq7wHAwMq9yEKZU2vFx7Y9qbZ1dKJ',
  'V1enDN8GY531jkFp3DWEQiRxwYYsnir8SADjHmkt4RG',
  '8F2VM13kdMBaHtcXPHmArtLueg7rfsa3gnrgGjAy4oCu',
  'ensSuXMeaUhRC7Re3ukaxLcX2E4qmd2LZxbxsK9XcWz',
  '5UFYdXHgXLMsDzHyv6pQW9zv3fNkRSNqHwhR7UPnkhzy',
  'q8gz8Sww7Xexpqk9DrEMjNXMHnFx6dB3EYe32PwHHd6',
  'C73nDAFn23RYwiFa6vtHshSbcg8x6BLYjw3bERJ3vHxf',
  'GLoWMgcn3VbyFKiC2FGMgfKxYSyTJS7uKFwKY2CSkq9X',
  'CNDL7Y1SYqvSF34aXayqHjm2JZrHB7BfhhVi3TUan3fe',
  's1aysqpEyZyijPybUV89oBGeooXrR22wMNLjnG2SWJA',

  'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD',
  'VALaaymxQh2mNy2trH9jUqHT1mTow76wpTcGmSWSwJe',
  'LLoc8JX5dLAMVzbzTNKG6EFpkyJ9XCsVAGkqwQKUJoa',
  'AvqeyEDqW9jaBi7yrRA6AxJtLbMzRY9NX75HuPTMoS4i',
  'Vau1t6sLNxnzB7ZDsef8TLbPLfyZMYXH8WTNqUdm9g8',
  'SANDsy8SBzwUE8Zio2mrYZYqL52Phr2WQb9DDKuXMVK',
  'HYzrD877vEcBgd6ySKPpa3pcMbqYEmwEF1GFQmvuswcC',
  'rev31KMq4qzt1y1iw926p694MHVVWT57caQrsHLFA4x',
  '2jmux3fWV5zHirkEZCoSMEgTgdYZqkE9Qx2oQnxoHRgA',
  'ensoQXKf4MvNuEC3M9xmcqUqgucFNd5UzAonDdUtgqn',
  '3i8rGP3ex8cjs7YYWrQeE4nWizuaStsVNUXpRGtMbs3H',
  'ZPLt7XEyRvRxEZcGFGnRKGLBymFjQbwmgTZhMAMfGAU',
  'ARFxpgenuFNbyoysFdqEwTgEdxtLtHbTHwCWHJjqWHTb',
  'NirvHuZvrm2zSxjkBvSbaF2tHfP5j7cvMj9QmdoHVwb',
  'gp8fqiE5cwX3JRT8unpKeFutNdMihyisAe3nx6L3S1p',
  'F1pkXm8W1WNbRvMoZTuKftHJ92ffuzddCCSRKKvCVL7n',
  'HYDqq5GfUj4aBuPpSCs4fkmeS7jZHRhrrQ3q72KsJdD4',
  '13gDzEXCdocbj8iAiqrScGo47NiSuYENGsRqi3SEAwet',
  '6M3fyRE18t6c7f9qes3eQMzR4QyPRMFZiyNQcApENCYf',
]

export const mediumPrograms = [
  'CBuCnLe26faBpcBP2fktp4rp8abpcAnTWft6ZrP5Q4T',
  'TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN',
  'LiMoM9rMhrdYrfzUCxQppvxCSG1FcrUK9G8uLq4A1GF',
  'GFXsSL5sSaDfNFQUYsHekbWBW1TsFdjDYzACh62tEHxn',
  'rain2M5b9GeFCk792swkwUu51ZihHJb3SUQ8uHxSRJf',
  'ATLocKpzDbTokxgvnLew3d7drZkEzLzDpzwgrgWKDbmc',
  'MGoV9M6YUsdhJzjzH9JMCW2tRe1LLxF1CjwqKC7DR1B',
  '8BYmYs3zsBhftNELJdiKsCN2WyCBbrTwXd6WG4AFPr6n',
  'FoXpJL1exLBJgHVvdSHNKyKu2xX2uatctH9qp6dLmfpP',
  'QMMD16kjauP5knBwxNUJRZ1Z5o3deBuFrqVjBVmmqto',
  'GTavkffQHnDKDH36YNFpk7uxwHNseTRo24tV4HGC8MNY',
  'poo1sKMYsZtDDS7og73L68etJQYyn6KXhXTLz1hizJc',
  'KJ6b6PswEZeNSwEh1po51wxnbX1C3FPhQPhg8eD2Y6E',
  'dvyFwAPniptQNb1ey4eM12L8iLHrzdiDsPPDndd6xAR',
  'tuna4uSQZncNeeiAMKbstuxA9CUkHH6HmC64wgmnogD',
  'g3yMgSB3Q7gNjMfSoCm1PiJihqHdNJeUuPHvRyf45qY',
  'HE6bCtjsrra8DRbJnexKoVPSr5dYs57s3cuGHfotiQbq',
  'TRDwq3BN4mP3m9KsuNUWSN6QDff93VKGSwE95Jbr9Ss',
  '1avaAUcjccXCjSZzwUvB2gS3DzkkieV2Mw8CjdN65uu',
  'STAKEGztX7S1MUHxcQHieZhELCntb9Ys9BgUbeEtMu1'
];

const largePrograms = [
  // 'Stake11111111111111111111111111111111111111', Cannot create a string longer than 0x1fffffe8
  // 'MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA', Cannot create a string longer than 0x1fffffe8 characters
  // 'So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo', Cannot create a string longer than 0x1fffffe8 characters
  // 'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo', Cannot create a string longer than 0x1fffffe8 characters 2x
  // 'pytS9TjG1qyAZypk7n8rw8gfW9sUaqqYyMhJQ4E7JCQ',  Cannot create a string longer than 0x1fffffe8 characters
  // '9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z', bad 257k items
  // 'EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q', bad 380k items
  // 'FEESngU3neckdwib9X3KWqdL7Mjmqk9XNp3uh5JbP4KP', bad 90k items
  // 'PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu', bad 684k items
  // 'j1o2qRpjcyUwEvwtcfhEQefh773ZgjxcVRry7LDqg5X', bad 230k items
  // 'strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m', bad 191k items
  // '3parcLrT7WnXAcyPfkCz49oofuuf2guUKkjuFkAhZW8Y', bad 306k items
  // 'STAKEkKzbdeKkqzKpLkNQD3SUuLgshDKCD7U8duxAbB', bad 122k items
  // '6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup', bad 390k items
  // 'PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY', bad 107k items
  // '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt', bad 213k items x4
  // '85iDfUvr3HJyLM2zcq5BXSiDvUWfw6cSE1FfNBo8Ap29', bad 94k x2
  // 'stPdYNaJNsV3ytS9Xtx4GXXXRcVqVS6x66ZFa26K39S', bad 116k x3
  // 'JCFRaPv7852ESRwJJGRy2mysUMydXZgVVhrMLmExvmVp', bad 134k x2
  // 'QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB', bad 165k
  // 'voTpe3tHQ7AjQHMapgSue2HJFAh2cGsdokqN3XqmVSj', bad 433k
  // 'FarmqiPv5eAj3j1GMdMCMUGXqPUvmquZtMy86QH6rzhG', too large payloads
  // 'vaU6kP7iNEGkbmPkLmZfGwiGxd4Mob24QQCie5R9kd2', too large payload
  // '4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg', too large object
  // 'jupoNjAxXgZ4rjzxzPMP4oxduvQsQtZzyknqvzYNrNu', too large payload
  // 'DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M', too large payloads
  // 'LocpQgucEQHbqNABEYvBvwoxCPsSbG91A1QaQhQQqjn', too large payloads
  // 'rDeFiHPjHZRLiz4iBzMw3zv6unZs4VwdU6qQcVd3NSK', too large payload
  // 'rNfTQD84kwMbcRpWpLR92BVmxbuwrZc3o5HTauAZiXs', too large payloads
  // 'Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR', too large payload
  // '2gWf5xLAzZaKX9tQj9vuXsaxTWtzTZDFRn21J3zjNVgu', too large payload
  // 'vAuLTsyrvSfZRuRB3XgvkPwNGgYSs9YRYymVebLKoxR', too large payloads
  // 'SHARKobtfF1bHhxD2eqftjHBdVSCbKo9JtgK71FhELP', too large payloads
  // '1oopBoJG58DgkUVKkEzKgyG9dvRmpgeEm1AVjoHkF78', too large payload
  // 'ExponentnaRg3CQbW6dqQNZKXp7gtZ9DGMp1cwC4HAS7', too large payloads
  // 'CRSeeBqjDnm3UPefJ9gxrtngTsnQRhEJiTA345Q83X3v', too large payloads
  // 'STAKEvGqQTtzJZH6BWDcbpzXXn2BBerPAgQ3EGLN2GH', too large payloads
  // 'NXFiKimQN3QSL3CDhCXddyVmLfrai8HK36bHKaAzK7g', too large payloads
  // 'vsRJM68m7i18PwzTFphgPYXTujCgxEi28knpUwSmg3q',
]
