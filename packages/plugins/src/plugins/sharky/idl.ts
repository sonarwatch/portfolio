export const SharkyIDL = {
  metadata: {
    name: 'sharky',
    version: '7.0.0',
    spec: '0.1.0',
    description: 'Sharky Program',
  },
  instructions: [
    {
      name: 'add_liquidity_token_pool',
      discriminator: [231, 202, 43, 10, 123, 196, 118, 172],
      accounts: [
        { name: 'orderbook' },
        { name: 'pool', writable: true },
        { name: 'usdc_vault', writable: true },
        { name: 'lender', writable: true, signer: true },
        { name: 'lender_usdc', writable: true },
        { name: 'loan_mint' },
        { name: 'token_program' },
      ],
      args: [{ name: 'usdc_amount', type: 'u64' }],
    },
    {
      name: 'close_escrow_value_mint_ata_admin',
      discriminator: [4, 134, 1, 41, 168, 248, 221, 28],
      accounts: [
        { name: 'loan' },
        { name: 'lender', writable: true, signer: true },
        { name: 'escrow' },
        { name: 'escrow_value_mint_token_account', writable: true },
        { name: 'admin', writable: true, signer: true },
        { name: 'system_program' },
        { name: 'token_program' },
        { name: 'associated_token_program' },
      ],
      args: [{ name: 'escrow_bump', type: 'u8' }],
    },
    {
      name: 'close_nft_list',
      discriminator: [35, 8, 121, 82, 218, 78, 252, 162],
      accounts: [
        { name: 'nft_list', writable: true },
        { name: 'payer', signer: true },
      ],
      args: [],
    },
    {
      name: 'close_order_book',
      docs: ['Closes an order book, must be signed by sharky key'],
      discriminator: [219, 134, 73, 219, 180, 7, 94, 206],
      accounts: [
        { name: 'order_book', writable: true },
        { name: 'payer', signer: true },
      ],
      args: [],
    },
    {
      name: 'close_token_orderbook',
      discriminator: [227, 4, 225, 109, 207, 235, 71, 106],
      accounts: [
        { name: 'orderbook', writable: true },
        { name: 'authority', writable: true, signer: true },
        { name: 'system_program' },
      ],
      args: [],
    },
    {
      name: 'close_token_pool',
      discriminator: [2, 251, 54, 4, 242, 200, 174, 143],
      accounts: [
        { name: 'orderbook' },
        { name: 'pool', writable: true },
        { name: 'usdc_vault', writable: true },
        { name: 'collateral_vault', writable: true },
        { name: 'lender', writable: true, signer: true },
        { name: 'lender_usdc', writable: true },
        { name: 'lender_collateral', writable: true },
        { name: 'loan_mint' },
        { name: 'collateral_mint' },
        { name: 'token_program' },
      ],
      args: [],
    },
    {
      name: 'create_nft_list',
      discriminator: [243, 38, 198, 76, 172, 64, 127, 24],
      accounts: [
        { name: 'nft_list', writable: true },
        { name: 'payer', signer: true },
      ],
      args: [{ name: 'collection_name', type: 'string' }],
    },
    {
      name: 'create_order_book',
      docs: ['Creates an order book, must be signed by sharky key'],
      discriminator: [153, 114, 9, 51, 100, 68, 240, 197],
      accounts: [
        { name: 'order_book', writable: true, signer: true },
        { name: 'payer', writable: true, signer: true },
        { name: 'system_program' },
      ],
      args: [
        {
          name: 'order_book_type',
          type: { defined: { name: 'OrderBookType' } },
        },
        { name: 'apy', type: { defined: { name: 'APY' } } },
        { name: 'loan_terms', type: { defined: { name: 'BookLoanTerms' } } },
        { name: 'fee_permillicentage', type: 'u16' },
        { name: 'fee_authority', type: 'pubkey' },
      ],
    },
    {
      name: 'create_program_version',
      discriminator: [103, 216, 0, 238, 92, 107, 219, 121],
      accounts: [
        { name: 'authority', writable: true, signer: true },
        { name: 'program_version', writable: true },
        { name: 'system_program' },
        { name: 'rent' },
      ],
      args: [{ name: 'version', type: 'u8' }],
    },
    {
      name: 'create_token_orderbook',
      discriminator: [136, 150, 94, 93, 212, 162, 222, 214],
      accounts: [
        { name: 'orderbook', writable: true },
        { name: 'loan_mint' },
        { name: 'collateral_mint' },
        { name: 'authority', writable: true, signer: true },
        { name: 'system_program' },
      ],
      args: [
        { name: 'duration', type: 'u64' },
        { name: 'apr', type: 'u32' },
        { name: 'fee_permillicentage', type: 'u16' },
        { name: 'fee_authority', type: 'pubkey' },
        { name: 'min_liquidity', type: { option: 'u64' } },
        { name: 'max_liquidity', type: { option: 'u64' } },
      ],
    },
    {
      name: 'create_token_pool',
      discriminator: [23, 169, 27, 122, 147, 169, 209, 152],
      accounts: [
        { name: 'orderbook' },
        { name: 'pool', writable: true },
        { name: 'usdc_vault', writable: true },
        { name: 'collateral_vault' },
        { name: 'lender', writable: true, signer: true },
        { name: 'lender_usdc_ata', writable: true },
        { name: 'loan_mint' },
        { name: 'collateral_mint' },
        { name: 'token_program' },
        { name: 'system_program' },
      ],
      args: [
        { name: 'nonce', type: 'u64' },
        { name: 'initial_usdc_liquidity', type: 'u64' },
        { name: 'required_collateral_amount', type: 'u64' },
      ],
    },
    {
      name: 'extend_loan_core',
      docs: ['Extend a loan with a new loan (core)'],
      discriminator: [141, 227, 91, 229, 198, 38, 150, 79],
      accounts: [
        { name: 'loan', writable: true },
        { name: 'new_loan', writable: true },
        { name: 'borrower', writable: true, signer: true },
        { name: 'lender', writable: true },
        { name: 'new_lender', writable: true },
        { name: 'escrow', writable: true },
        { name: 'new_escrow', writable: true },
        { name: 'value_mint' },
        {
          name: 'collateral_mint',
          docs: ['Core Asset (collateral mint)'],
          writable: true,
        },
        {
          name: 'collection',
          docs: ['The collection to which the asset belongs.'],
          writable: true,
          optional: true,
        },
        { name: 'order_book' },
        { name: 'fee_authority', writable: true },
        { name: 'system_program' },
        { name: 'rent' },
        {
          name: 'log_wrapper',
          docs: ['The SPL Noop program.'],
          optional: true,
        },
        { name: 'mpl_core_program', docs: ['The MPL Core program.'] },
      ],
      args: [{ name: 'expected_loan', type: 'string' }],
    },
    {
      name: 'extend_loan_v3',
      discriminator: [71, 27, 17, 131, 78, 73, 62, 92],
      accounts: [
        { name: 'loan', writable: true },
        { name: 'new_loan', writable: true },
        { name: 'borrower', writable: true, signer: true },
        { name: 'borrower_collateral_token_account', writable: true },
        { name: 'lender', writable: true },
        { name: 'new_lender', writable: true },
        { name: 'escrow', writable: true },
        { name: 'escrow_collateral_token_account', writable: true },
        { name: 'new_escrow', writable: true },
        { name: 'new_escrow_collateral_token_account', writable: true },
        { name: 'value_mint' },
        { name: 'collateral_mint' },
        { name: 'order_book' },
        { name: 'fee_authority', writable: true },
        { name: 'metadata', writable: true },
        { name: 'edition', writable: true },
        { name: 'system_program' },
        { name: 'token_program' },
        { name: 'associated_token_program' },
        { name: 'rent' },
        { name: 'mpl_token_metadata_program' },
      ],
      args: [{ name: 'expected_loan', type: 'string' }],
    },
    {
      name: 'extend_loan_v3_compressed',
      docs: ['Extend a loan with a new loan (cNFT)'],
      discriminator: [148, 161, 75, 87, 138, 34, 131, 62],
      accounts: [
        { name: 'loan', writable: true },
        { name: 'new_loan', writable: true },
        { name: 'borrower', writable: true, signer: true },
        { name: 'lender', writable: true },
        { name: 'new_lender', writable: true },
        { name: 'escrow', writable: true },
        { name: 'new_escrow', writable: true },
        { name: 'value_mint' },
        { name: 'order_book' },
        { name: 'fee_authority', writable: true },
        { name: 'tree_authority' },
        { name: 'log_wrapper' },
        { name: 'merkle_tree', writable: true },
        { name: 'system_program' },
        { name: 'token_program' },
        { name: 'mpl_bubblegum_program' },
        { name: 'compression_program' },
        { name: 'rent' },
      ],
      args: [
        { name: 'expected_loan', type: 'string' },
        { name: 'cnft_root', type: { array: ['u8', 32] } },
        { name: 'cnft_data_hash', type: { array: ['u8', 32] } },
        { name: 'cnft_creator_hash', type: { array: ['u8', 32] } },
        { name: 'cnft_nonce', type: 'u64' },
        { name: 'cnft_index', type: 'u32' },
      ],
    },
    {
      name: 'extend_token_loan',
      discriminator: [57, 33, 61, 102, 70, 86, 164, 130],
      accounts: [
        { name: 'orderbook' },
        { name: 'old_loan', writable: true },
        { name: 'new_loan', writable: true, signer: true },
        { name: 'old_pool', writable: true },
        { name: 'new_pool', writable: true },
        { name: 'old_lender_usdc', writable: true },
        { name: 'old_collateral_vault', writable: true },
        { name: 'new_usdc_vault', writable: true },
        { name: 'new_collateral_vault', writable: true },
        { name: 'borrower', writable: true, signer: true },
        { name: 'borrower_usdc', writable: true },
        { name: 'borrower_collateral', writable: true },
        { name: 'loan_mint' },
        { name: 'collateral_mint' },
        { name: 'fee_authority_usdc_ata', writable: true },
        { name: 'burn_wallet_usdc_ata', writable: true },
        { name: 'token_program' },
        { name: 'associated_token_program' },
        { name: 'system_program' },
      ],
      args: [
        { name: 'new_usdc_amount', type: 'u64' },
        { name: 'expected_new_loan', type: 'string' },
      ],
    },
    {
      name: 'foreclose_loan_core',
      docs: ['Forecloses on a taken lone that has met some condition (core)'],
      discriminator: [207, 35, 84, 147, 119, 14, 195, 133],
      accounts: [
        { name: 'loan', writable: true },
        { name: 'escrow', writable: true },
        {
          name: 'collateral_mint',
          docs: ['Core Asset (collateral mint)'],
          writable: true,
        },
        {
          name: 'collection',
          docs: ['The collection to which the asset belongs.'],
          writable: true,
          optional: true,
        },
        { name: 'borrower', writable: true },
        { name: 'lender', writable: true, signer: true },
        { name: 'system_program' },
        { name: 'rent' },
        {
          name: 'log_wrapper',
          docs: ['The SPL Noop program.'],
          optional: true,
        },
        { name: 'mpl_core_program', docs: ['The MPL Core program.'] },
      ],
      args: [],
    },
    {
      name: 'foreclose_loan_v3',
      docs: ['Forecloses on a taken lone that has met some condition'],
      discriminator: [136, 184, 50, 58, 183, 92, 63, 216],
      accounts: [
        { name: 'loan', writable: true },
        { name: 'escrow', writable: true },
        { name: 'escrow_collateral_token_account', writable: true },
        { name: 'collateral_mint', writable: true },
        { name: 'borrower', writable: true },
        { name: 'lender', writable: true, signer: true },
        { name: 'lender_collateral_token_account', writable: true },
        { name: 'borrower_collateral_token_account', writable: true },
        { name: 'metadata', writable: true },
        { name: 'edition', writable: true },
        { name: 'system_program' },
        { name: 'token_program' },
        { name: 'associated_token_program' },
        { name: 'rent' },
        { name: 'mpl_token_metadata_program' },
      ],
      args: [],
    },
    {
      name: 'foreclose_loan_v3_compressed',
      docs: ['Forecloses on a taken lone that has met some condition (cNFT)'],
      discriminator: [194, 193, 5, 193, 115, 133, 231, 197],
      accounts: [
        { name: 'loan', writable: true },
        { name: 'escrow', writable: true },
        { name: 'borrower', writable: true },
        { name: 'lender', writable: true, signer: true },
        { name: 'tree_authority' },
        { name: 'log_wrapper' },
        { name: 'merkle_tree', writable: true },
        { name: 'system_program' },
        { name: 'token_program' },
        { name: 'mpl_bubblegum_program' },
        { name: 'compression_program' },
        { name: 'rent' },
      ],
      args: [
        { name: 'cnft_root', type: { array: ['u8', 32] } },
        { name: 'cnft_data_hash', type: { array: ['u8', 32] } },
        { name: 'cnft_creator_hash', type: { array: ['u8', 32] } },
        { name: 'cnft_nonce', type: 'u64' },
        { name: 'cnft_index', type: 'u32' },
      ],
    },
    {
      name: 'foreclose_token_loan',
      discriminator: [197, 56, 225, 73, 11, 232, 33, 30],
      accounts: [
        { name: 'orderbook' },
        { name: 'loan', writable: true },
        { name: 'borrower', writable: true },
        { name: 'pool', writable: true },
        { name: 'lender', writable: true, signer: true },
        { name: 'lender_collateral_ata', writable: true },
        { name: 'collateral_vault', writable: true },
        { name: 'loan_mint' },
        { name: 'collateral_mint' },
        { name: 'token_program' },
      ],
      args: [],
    },
    {
      name: 'offer_loan',
      docs: ['Offers a loan for a given order book'],
      discriminator: [44, 12, 76, 144, 210, 208, 239, 85],
      accounts: [
        { name: 'lender', writable: true, signer: true },
        { name: 'lender_value_token_account', writable: true },
        { name: 'value_mint' },
        { name: 'loan', writable: true, signer: true },
        { name: 'escrow', writable: true },
        { name: 'escrow_token_account', writable: true },
        { name: 'order_book' },
        { name: 'system_program' },
        { name: 'token_program' },
        { name: 'associated_token_program' },
        { name: 'rent' },
      ],
      args: [
        { name: 'escrow_bump', type: 'u8' },
        { name: 'principal_lamports', type: 'u64' },
        {
          name: 'terms_choice',
          type: { option: { defined: { name: 'LoanTermsSpec' } } },
        },
      ],
    },
    {
      name: 'repay_loan_core',
      docs: ['Repays a given loan in exchange for the NFT (core)'],
      discriminator: [240, 132, 186, 214, 101, 67, 215, 140],
      accounts: [
        { name: 'loan', writable: true },
        { name: 'borrower', writable: true, signer: true },
        { name: 'lender', writable: true },
        { name: 'escrow', writable: true },
        { name: 'value_mint' },
        {
          name: 'collateral_mint',
          docs: ['Core Asset (collateral mint)'],
          writable: true,
        },
        {
          name: 'collection',
          docs: ['The collection to which the asset belongs.'],
          writable: true,
          optional: true,
        },
        { name: 'order_book' },
        { name: 'fee_authority', writable: true },
        { name: 'system_program' },
        { name: 'rent' },
        {
          name: 'log_wrapper',
          docs: ['The SPL Noop program.'],
          optional: true,
        },
        { name: 'mpl_core_program', docs: ['The MPL Core program.'] },
      ],
      args: [],
    },
    {
      name: 'repay_loan_v3',
      docs: ['Repays a given loan in exchange for the NFT'],
      discriminator: [97, 123, 85, 54, 76, 16, 61, 157],
      accounts: [
        { name: 'loan', writable: true },
        { name: 'borrower', writable: true, signer: true },
        { name: 'borrower_collateral_token_account', writable: true },
        { name: 'lender', writable: true },
        { name: 'escrow', writable: true },
        { name: 'escrow_collateral_token_account', writable: true },
        { name: 'value_mint' },
        { name: 'collateral_mint', writable: true },
        { name: 'order_book' },
        { name: 'fee_authority', writable: true },
        { name: 'metadata', writable: true },
        { name: 'edition', writable: true },
        { name: 'system_program' },
        { name: 'token_program' },
        { name: 'associated_token_program' },
        { name: 'rent' },
        { name: 'mpl_token_metadata_program' },
      ],
      args: [],
    },
    {
      name: 'repay_loan_v3_compressed',
      docs: ['Repays a given loan in exchange for the NFT (cNFT)'],
      discriminator: [159, 159, 245, 168, 191, 154, 100, 6],
      accounts: [
        { name: 'loan', writable: true },
        { name: 'borrower', writable: true, signer: true },
        { name: 'lender', writable: true },
        { name: 'escrow', writable: true },
        { name: 'value_mint' },
        { name: 'order_book' },
        { name: 'fee_authority', writable: true },
        { name: 'tree_authority' },
        { name: 'log_wrapper' },
        { name: 'merkle_tree', writable: true },
        { name: 'system_program' },
        { name: 'token_program' },
        { name: 'mpl_bubblegum_program' },
        { name: 'compression_program' },
        { name: 'rent' },
      ],
      args: [
        { name: 'cnft_root', type: { array: ['u8', 32] } },
        { name: 'cnft_data_hash', type: { array: ['u8', 32] } },
        { name: 'cnft_creator_hash', type: { array: ['u8', 32] } },
        { name: 'cnft_nonce', type: 'u64' },
        { name: 'cnft_index', type: 'u32' },
      ],
    },
    {
      name: 'repay_token_loan',
      discriminator: [208, 50, 208, 39, 189, 153, 25, 251],
      accounts: [
        { name: 'orderbook' },
        { name: 'loan', writable: true },
        { name: 'pool', writable: true },
        { name: 'lender_usdc', writable: true },
        { name: 'collateral_vault', writable: true },
        { name: 'borrower', writable: true, signer: true },
        { name: 'borrower_usdc', writable: true },
        { name: 'borrower_collateral', writable: true },
        { name: 'loan_mint' },
        { name: 'collateral_mint' },
        { name: 'token_program' },
        { name: 'associated_token_program' },
        { name: 'system_program' },
      ],
      args: [],
    },
    {
      name: 'rescind_loan',
      docs: ['Removes an offered but not taken loan'],
      discriminator: [64, 64, 160, 211, 51, 36, 177, 158],
      accounts: [
        { name: 'loan', writable: true },
        { name: 'lender_value_token_account', writable: true, optional: true },
        { name: 'lender', writable: true, signer: true },
        { name: 'value_mint' },
        { name: 'escrow', writable: true },
        { name: 'escrow_token_account', writable: true },
        { name: 'system_program' },
        { name: 'token_program' },
      ],
      args: [],
    },
    {
      name: 'take_loan_core',
      docs: ['Takes an offered loan in exchange for a valid NFT (core)'],
      discriminator: [178, 111, 236, 60, 159, 108, 234, 254],
      accounts: [
        { name: 'lender', writable: true },
        {
          name: 'borrower',
          docs: [
            'The borrower that will receive the tokens in exchange for collateral',
          ],
          writable: true,
          signer: true,
        },
        {
          name: 'collateral_mint',
          docs: ['Core Asset (collateral mint)'],
          writable: true,
        },
        {
          name: 'collection',
          docs: ['The collection to which the asset belongs.'],
          writable: true,
          optional: true,
        },
        {
          name: 'loan',
          docs: [
            'Expected loan prevents a replacement attack where the loan is replaced between the',
            'user signing take_loan and it hitting the chain',
          ],
          writable: true,
        },
        { name: 'escrow', writable: true },
        { name: 'order_book' },
        { name: 'system_program' },
        { name: 'rent' },
        {
          name: 'log_wrapper',
          docs: ['The SPL Noop program.'],
          optional: true,
        },
        { name: 'mpl_core_program', docs: ['The MPL Core program.'] },
      ],
      args: [
        { name: 'expected_loan', type: 'string' },
        { name: 'nft_list_index', type: { option: 'u32' } },
      ],
    },
    {
      name: 'take_loan_v3',
      docs: [
        'Takes an offered loan in exchange for a valid NFT (migration off cardinal)',
      ],
      discriminator: [255, 115, 220, 58, 26, 157, 112, 185],
      accounts: [
        { name: 'lender', writable: true },
        {
          name: 'borrower',
          docs: [
            'The borrower that will receive the tokens in exchange for collateral',
          ],
          writable: true,
          signer: true,
        },
        { name: 'borrower_collateral_token_account', writable: true },
        { name: 'collateral_mint', docs: ['type of token'], writable: true },
        {
          name: 'loan',
          docs: [
            'Expected loan prevents a replacement attack where the loan is replaced between the',
            'user signing take_loan and it hitting the chain',
          ],
          writable: true,
        },
        { name: 'escrow', writable: true },
        { name: 'escrow_collateral_token_account', writable: true },
        { name: 'order_book' },
        { name: 'metadata', writable: true },
        { name: 'edition', writable: true },
        { name: 'system_program' },
        { name: 'token_program' },
        { name: 'associated_token_program' },
        { name: 'rent' },
        { name: 'mpl_token_metadata_program' },
      ],
      args: [
        { name: 'expected_loan', type: 'string' },
        { name: 'nft_list_index', type: { option: 'u32' } },
        { name: 'skip_freezing_collateral', type: 'bool' },
      ],
    },
    {
      name: 'take_loan_v3_compressed',
      docs: ['Takes an offered loan in exchange for a valid NFT (cNFT)'],
      discriminator: [241, 114, 106, 79, 16, 89, 233, 125],
      accounts: [
        { name: 'lender', writable: true },
        {
          name: 'borrower',
          docs: [
            'The borrower that will receive the tokens in exchange for collateral',
          ],
          writable: true,
          signer: true,
        },
        {
          name: 'loan',
          docs: [
            'Expected loan prevents a replacement attack where the loan is replaced between the',
            'user signing take_loan and it hitting the chain',
          ],
          writable: true,
        },
        { name: 'escrow', writable: true },
        { name: 'order_book' },
        { name: 'collateral_mint' },
        { name: 'tree_authority' },
        { name: 'log_wrapper' },
        { name: 'merkle_tree', writable: true },
        { name: 'system_program' },
        { name: 'token_program' },
        { name: 'mpl_bubblegum_program' },
        { name: 'compression_program' },
        { name: 'rent' },
      ],
      args: [
        { name: 'expected_loan', type: 'string' },
        { name: 'nft_list_index', type: { option: 'u32' } },
        { name: 'cnft_args', type: { defined: { name: 'CnftArgs' } } },
      ],
    },
    {
      name: 'take_token_loan',
      discriminator: [221, 216, 127, 10, 107, 189, 152, 111],
      accounts: [
        { name: 'orderbook' },
        { name: 'loan', writable: true, signer: true },
        { name: 'pool', writable: true },
        { name: 'usdc_vault', writable: true },
        { name: 'collateral_vault', writable: true },
        { name: 'borrower', writable: true, signer: true },
        { name: 'borrower_usdc', writable: true },
        { name: 'borrower_collateral', writable: true },
        { name: 'fee_authority_usdc_ata', writable: true },
        { name: 'burn_wallet_usdc_ata', writable: true },
        { name: 'loan_mint' },
        { name: 'collateral_mint' },
        { name: 'token_program' },
        { name: 'system_program' },
      ],
      args: [
        { name: 'usdc_amount', type: 'u64' },
        { name: 'expected_loan', type: 'string' },
      ],
    },
    {
      name: 'update_nft_list',
      discriminator: [215, 13, 25, 187, 11, 93, 34, 143],
      accounts: [
        { name: 'nft_list', writable: true },
        { name: 'payer', signer: true },
      ],
      args: [
        { name: 'mints', type: { vec: { defined: { name: 'UpdateIndex' } } } },
      ],
    },
    {
      name: 'update_order_book',
      docs: ['Updates an order book, must be signed by sharky key'],
      discriminator: [31, 72, 159, 232, 220, 153, 90, 109],
      accounts: [
        { name: 'order_book', writable: true },
        { name: 'payer', signer: true },
      ],
      args: [
        {
          name: 'order_book_type',
          type: { option: { defined: { name: 'OrderBookType' } } },
        },
        { name: 'apy', type: { option: { defined: { name: 'APY' } } } },
        {
          name: 'loan_terms',
          type: { option: { defined: { name: 'BookLoanTerms' } } },
        },
        { name: 'fee_permillicentage', type: { option: 'u16' } },
        { name: 'fee_authority', type: { option: 'pubkey' } },
      ],
    },
    {
      name: 'update_program_version',
      discriminator: [235, 132, 215, 225, 213, 43, 43, 38],
      accounts: [
        { name: 'authority', signer: true },
        { name: 'program_version', writable: true },
      ],
      args: [{ name: 'version', type: 'u8' }],
    },
    {
      name: 'update_token_orderbook',
      discriminator: [19, 248, 131, 69, 150, 2, 41, 143],
      accounts: [
        { name: 'orderbook', writable: true },
        { name: 'authority', signer: true },
        { name: 'system_program' },
      ],
      args: [
        { name: 'duration', type: { option: 'u64' } },
        { name: 'apr', type: { option: 'u32' } },
        { name: 'fee_permillicentage', type: { option: 'u16' } },
        { name: 'fee_authority', type: { option: 'pubkey' } },
        { name: 'min_liquidity', type: { option: 'u64' } },
        { name: 'max_liquidity', type: { option: 'u64' } },
      ],
    },
    {
      name: 'update_token_pool',
      discriminator: [225, 28, 181, 13, 220, 64, 31, 102],
      accounts: [
        { name: 'orderbook' },
        { name: 'pool', writable: true },
        { name: 'lender', signer: true },
      ],
      args: [{ name: 'new_required_collateral_amount', type: 'u64' }],
    },
    {
      name: 'withdraw_liquidity_token_pool',
      discriminator: [55, 103, 20, 35, 39, 183, 180, 64],
      accounts: [
        { name: 'orderbook' },
        { name: 'pool', writable: true },
        { name: 'usdc_vault', writable: true },
        { name: 'lender', writable: true, signer: true },
        { name: 'lender_usdc', writable: true },
        { name: 'loan_mint' },
        { name: 'token_program' },
      ],
      args: [],
    },
  ],
  accounts: [
    { name: 'EscrowPDA', discriminator: [109, 117, 137, 181, 64, 48, 65, 235] },
    { name: 'Loan', discriminator: [20, 195, 70, 117, 165, 227, 182, 1] },
    { name: 'NFTList', discriminator: [46, 244, 104, 226, 152, 35, 170, 239] },
    { name: 'OrderBook', discriminator: [55, 230, 125, 218, 149, 39, 65, 248] },
    {
      name: 'ProgramVersion',
      discriminator: [138, 104, 244, 197, 206, 47, 159, 154],
    },
    {
      name: 'TokenLendingLoan',
      discriminator: [48, 250, 133, 85, 42, 11, 45, 154],
    },
    {
      name: 'TokenLendingOrderBook',
      discriminator: [192, 71, 92, 163, 99, 85, 39, 27],
    },
    {
      name: 'TokenLendingPool',
      discriminator: [33, 59, 13, 135, 153, 105, 127, 146],
    },
  ],
  errors: [
    { code: 6000, name: 'Custom', msg: 'Custom' },
    { code: 6001, name: 'InvalidArgument', msg: 'InvalidArgument' },
    { code: 6002, name: 'InvalidAccountData', msg: 'InvalidAccountData' },
    { code: 6003, name: 'IllegalOwner', msg: 'IllegalOwner' },
    { code: 6004, name: 'InvalidMint', msg: 'Mint is invalid' },
    {
      code: 6005,
      name: 'NumericalOverflowError',
      msg: 'Numerical overflow error',
    },
    {
      code: 6006,
      name: 'MismatchedNftCollateralMint',
      msg: 'Mismatched NFT collateral mint',
    },
    {
      code: 6007,
      name: 'MismatchedValueTokenMint',
      msg: 'Mismatched value token mint',
    },
    { code: 6008, name: 'MismatchedLender', msg: 'Mismatched lender' },
    { code: 6009, name: 'NotForeclosable', msg: 'Loan is not foreclosable' },
    { code: 6010, name: 'FeeCalculationError', msg: 'Fee calculation error' },
    {
      code: 6011,
      name: 'InvalidBookLoanTermsType',
      msg: 'Invalid book loan terms type',
    },
    { code: 6012, name: 'InvalidEscrowBump', msg: 'Invalid escrow bump' },
    { code: 6013, name: 'InvalidLoanVersion', msg: 'Invalid loan version' },
    {
      code: 6014,
      name: 'InvalidValueMint',
      msg: 'Value mint only supports native mint',
    },
    {
      code: 6015,
      name: 'OfferedLoanCannotBeForeclosed',
      msg: 'Offered loan cannot be foreclosed',
    },
    {
      code: 6016,
      name: 'EscrowValueMintTokenAccountEmpty',
      msg: 'Escrow value mint token account empty',
    },
    { code: 6017, name: 'InvalidUsdcMint', msg: 'Invalid USDC mint' },
    { code: 6018, name: 'InvalidDuration', msg: 'Invalid duration' },
    { code: 6019, name: 'InvalidApr', msg: 'Invalid APR' },
    { code: 6020, name: 'InvalidLoanAmount', msg: 'Invalid loan amount' },
    {
      code: 6021,
      name: 'InvalidCollateralAmount',
      msg: 'Invalid collateral amount',
    },
    { code: 6022, name: 'InvalidLtv', msg: 'Invalid LTV' },
    { code: 6023, name: 'InvalidOrderBook', msg: 'Invalid orderbook' },
    { code: 6024, name: 'AlreadyBorrowed', msg: 'Already borrowed' },
    {
      code: 6025,
      name: 'InvalidCollateralMint',
      msg: 'Invalid collateral mint',
    },
    { code: 6026, name: 'InvalidLiquidity', msg: 'Invalid liquidity' },
    { code: 6027, name: 'PoolPaused', msg: 'Pool is paused' },
    { code: 6028, name: 'InvalidBump', msg: 'Invalid bump' },
    { code: 6029, name: 'InvalidPool', msg: 'Invalid pool' },
    { code: 6030, name: 'InvalidFeeAuthority', msg: 'Invalid fee authority' },
    {
      code: 6031,
      name: 'InvalidPriceAuthority',
      msg: 'Invalid price authority',
    },
    { code: 6032, name: 'InvalidPoolCount', msg: 'Invalid pool count' },
    { code: 6033, name: 'InvalidPoolVault', msg: 'Invalid Pool Vault' },
    { code: 6034, name: 'MathOverflow', msg: 'Math overflow' },
    { code: 6035, name: 'LoanNotExpired', msg: 'Loan has not expired' },
    { code: 6036, name: 'NoInterestToClaim', msg: 'No interest to claim' },
    {
      code: 6037,
      name: 'PoolHasActiveLoans',
      msg: 'Pool still has active loans',
    },
    { code: 6038, name: 'PoolVaultNotEmpty', msg: 'Pool vault is not empty' },
    { code: 6039, name: 'PoolStillActive', msg: 'Pool still active' },
    { code: 6040, name: 'InvalidUsdcVault', msg: 'Invalid usdc vault' },
    {
      code: 6041,
      name: 'InvalidCollateralVault',
      msg: 'Invalid collateral vault',
    },
  ],
  types: [
    {
      name: 'APY',
      docs: ['APY settings on an [`OrderBook`]'],
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Fixed',
            fields: [
              { name: 'apy', docs: ['Thousandths of a percent'], type: 'u32' },
            ],
          },
        ],
      },
    },
    {
      name: 'BookLoanTerms',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Fixed',
            fields: [
              { name: 'terms', type: { defined: { name: 'LoanTermsSpec' } } },
            ],
          },
          { name: 'LenderChooses' },
        ],
      },
    },
    {
      name: 'CnftArgs',
      type: {
        kind: 'struct',
        fields: [
          { name: 'cnft_root', type: { array: ['u8', 32] } },
          { name: 'cnft_data_hash', type: { array: ['u8', 32] } },
          { name: 'cnft_creator_hash', type: { array: ['u8', 32] } },
          { name: 'cnft_nonce', type: 'u64' },
          { name: 'cnft_index', type: 'u32' },
        ],
      },
    },
    {
      name: 'EscrowPDA',
      type: { kind: 'struct', fields: [{ name: 'bump', type: 'u8' }] },
    },
    {
      name: 'Loan',
      type: {
        kind: 'struct',
        fields: [
          { name: 'version', type: 'u8' },
          {
            name: 'principal_lamports',
            docs: ['amount in tokens, decimals included'],
            type: 'u64',
          },
          { name: 'order_book', type: 'pubkey' },
          {
            name: 'value_token_mint',
            docs: ['Token mint for what the loan is in (spl address)'],
            type: 'pubkey',
          },
          { name: 'escrow_bump_seed', type: 'u8' },
          {
            name: 'loan_state',
            docs: ['stores start and duration'],
            type: { defined: { name: 'LoanState' } },
          },
        ],
      },
    },
    {
      name: 'LoanOffer',
      type: {
        kind: 'struct',
        fields: [
          { name: 'lender_wallet', type: 'pubkey' },
          { name: 'terms_spec', type: { defined: { name: 'LoanTermsSpec' } } },
          { name: 'offer_time', type: 'i64' },
        ],
      },
    },
    {
      name: 'LoanState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Offer',
            fields: [
              { name: 'offer', type: { defined: { name: 'LoanOffer' } } },
            ],
          },
          {
            name: 'Taken',
            fields: [
              { name: 'taken', type: { defined: { name: 'TakenLoan' } } },
            ],
          },
        ],
      },
    },
    {
      name: 'LoanTerms',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Time',
            fields: [
              {
                name: 'start',
                docs: ['This is a [`UnixTimeStamp`]'],
                type: 'i64',
              },
              { name: 'duration', type: 'u64' },
              { name: 'total_owed_lamports', type: 'u64' },
            ],
          },
        ],
      },
    },
    {
      name: 'LoanTermsSpec',
      type: {
        kind: 'enum',
        variants: [
          { name: 'Time', fields: [{ name: 'duration', type: 'u64' }] },
        ],
      },
    },
    {
      name: 'NFTList',
      type: {
        kind: 'struct',
        fields: [
          { name: 'version', type: 'u8' },
          { name: 'collection_name', type: 'string' },
        ],
      },
    },
    {
      name: 'OrderBook',
      type: {
        kind: 'struct',
        fields: [
          { name: 'version', type: 'u8' },
          {
            name: 'order_book_type',
            type: { defined: { name: 'OrderBookType' } },
          },
          { name: 'apy', type: { defined: { name: 'APY' } } },
          { name: 'loan_terms', type: { defined: { name: 'BookLoanTerms' } } },
          { name: 'fee_permillicentage', type: 'u16' },
          { name: 'fee_authority', type: 'pubkey' },
        ],
      },
    },
    {
      name: 'OrderBookType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Collection',
            fields: [{ name: 'collection_key', type: 'pubkey' }],
          },
          {
            name: 'NFTList',
            fields: [{ name: 'list_account', type: 'pubkey' }],
          },
        ],
      },
    },
    {
      name: 'ProgramVersion',
      type: {
        kind: 'struct',
        fields: [
          { name: 'version', type: 'u8' },
          { name: 'bump', type: 'u8' },
          { name: 'updated', type: 'i64' },
        ],
      },
    },
    {
      name: 'TakenLoan',
      type: {
        kind: 'struct',
        fields: [
          { name: 'nft_collateral_mint', type: 'pubkey' },
          { name: 'lender_note_mint', type: 'pubkey' },
          { name: 'borrower_note_mint', type: 'pubkey' },
          {
            name: 'apy',
            docs: [
              'Thousandths of a percent (allows to have 3 decimal points of precision)',
            ],
            type: { defined: { name: 'APY' } },
          },
          { name: 'terms', type: { defined: { name: 'LoanTerms' } } },
          { name: 'is_collateral_frozen', type: 'u8' },
        ],
      },
    },
    {
      name: 'TokenLendingLoan',
      serialization: 'bytemuck',
      repr: { kind: 'c' },
      type: {
        kind: 'struct',
        fields: [
          { name: 'orderbook', type: 'pubkey' },
          { name: 'borrower', type: 'pubkey' },
          { name: 'pool', type: 'pubkey' },
          { name: 'principal_usdc_amount', type: 'u64' },
          { name: 'collateral_required_amount', type: 'u64' },
          { name: 'start_ts', type: 'i64' },
          { name: 'end_ts', type: 'i64' },
          { name: 'apr', type: 'u32' },
          { name: 'version', type: 'u8' },
          { name: 'padding', type: { array: ['u8', 3] } },
        ],
      },
    },
    {
      name: 'TokenLendingOrderBook',
      docs: ['Token Lending States'],
      serialization: 'bytemuck',
      repr: { kind: 'c' },
      type: {
        kind: 'struct',
        fields: [
          { name: 'fee_authority', type: 'pubkey' },
          { name: 'loan_mint', type: 'pubkey' },
          { name: 'collateral_mint', type: 'pubkey' },
          { name: 'collateral_token_program', type: 'pubkey' },
          { name: 'duration', type: 'u64' },
          { name: 'min_liquidity', type: 'u64' },
          { name: 'max_liquidity', type: 'u64' },
          { name: 'apr', type: 'u32' },
          { name: 'fee_permillicentage', type: 'u16' },
          { name: 'collateral_decimals', type: 'u8' },
          { name: 'version', type: 'u8' },
          { name: 'bump', type: 'u8' },
          { name: 'padding', type: { array: ['u8', 7] } },
        ],
      },
    },
    {
      name: 'TokenLendingPool',
      serialization: 'bytemuck',
      repr: { kind: 'c' },
      type: {
        kind: 'struct',
        fields: [
          { name: 'orderbook', type: 'pubkey' },
          { name: 'lender', type: 'pubkey' },
          { name: 'usdc_vault', type: 'pubkey' },
          { name: 'collateral_vault', type: 'pubkey' },
          { name: 'nonce', type: 'u64' },
          { name: 'total_usdc_liquidity', type: 'u64' },
          { name: 'available_usdc_liquidity', type: 'u64' },
          { name: 'collateral_required_amount', type: 'u64' },
          { name: 'total_usdc_interest', type: 'u64' },
          { name: 'total_loan_count', type: 'u64' },
          { name: 'active_loan_count', type: 'u64' },
          { name: 'total_defaulted_loan_count', type: 'u64' },
          { name: 'total_defaulted_usdc_amount', type: 'u64' },
          { name: 'total_defaulted_collateral_amount', type: 'u64' },
          { name: 'version', type: 'u8' },
          { name: 'bump', type: 'u8' },
          { name: 'padding', type: { array: ['u8', 6] } },
        ],
      },
    },
    {
      name: 'UpdateIndex',
      type: {
        kind: 'struct',
        fields: [
          { name: 'index', type: 'u32' },
          { name: 'mint', type: 'pubkey' },
        ],
      },
    },
  ],
};
