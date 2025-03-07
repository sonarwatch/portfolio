export const PlutoIDL = {
    address: "5UFYdXHgXLMsDzHyv6pQW9zv3fNkRSNqHwhR7UPnkhzy",
    metadata: {
        name: "pluto",
        version: "0.1.0",
        spec: "0.1.0",
        description: "Created with Anchor"
    },
    instructions: [],
    accounts: [
        {
            name: "vaultEarn",
            discriminator: [
                255,
                18,
                25,
                189,
                255,
                106,
                176,
                136
            ]
        },
        {
            name: "vaultLeverage",
            discriminator: [
                135,
                160,
                136,
                66,
                119,
                36,
                19,
                115
            ]
        },
        {
            name: "Lender",
            discriminator: [
                107,
                30,
                175,
                31,
                232,
                82,
                180,
                124
            ]
        },
        {
            name: "Obligation",
            discriminator: [
                168,
                206,
                141,
                106,
                88,
                76,
                172,
                167
            ]
        }
    ],
    events: [],
    errors: [],
    types: [
        {
            name: "vaultEarn",
            serialization: "bytemuckunsafe",
            repr: {
                kind: "c"
            },
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "isInitialized",
                        type: "bool"
                    },
                    {
                        name: "version",
                        type: "u8"
                    },
                    {
                        name: "bump",
                        type: "u8"
                    },
                    {
                        name: "align0",
                        type: {
                            array: [
                                "u8",
                                5
                            ]
                        }
                    },
                    {
                        name: "protocol",
                        type: "pubkey"
                    },
                    {
                        name: "earnStats",
                        type: "pubkey"
                    },
                    {
                        name: "creator",
                        type: "pubkey"
                    },
                    {
                        name: "authority",
                        type: "pubkey"
                    },
                    {
                        name: "earnConfig",
                        type: "pubkey"
                    },
                    {
                        name: "vaultLiquidity",
                        type: "pubkey"
                    },
                    {
                        name: "priceOracle",
                        type: "pubkey"
                    },
                    {
                        name: "priceFeed",
                        type: {
                            array: [
                                "u8",
                                64
                            ]
                        }
                    },
                    {
                        name: "tokenProgram",
                        type: "pubkey"
                    },
                    {
                        name: "tokenMint",
                        type: "pubkey"
                    },
                    {
                        name: "tokenDecimal",
                        type: "u8"
                    },
                    {
                        name: "align1",
                        type: {
                            array: [
                                "u8",
                                7
                            ]
                        }
                    },
                    {
                        name: "lastUpdated",
                        type: "i64"
                    },
                    {
                        name: "unitSupply",
                        type: "u128"
                    },
                    {
                        name: "unitBorrowed",
                        type: "u128"
                    },
                    {
                        name: "unitLent",
                        type: "u128"
                    },
                    {
                        name: "unitLeverage",
                        type: "u128"
                    },
                    {
                        name: "index",
                        type: "u128"
                    },
                    {
                        name: "lastIndexUpdated",
                        type: "i64"
                    },
                    {
                        name: "apy",
                        type: {
                            defined: {
                                name: "rate"
                            }
                        }
                    },
                    {
                        name: "padding1",
                        type: {
                            array: [
                                "u64",
                                64
                            ]
                        }
                    }
                ]
            }
        },
        {
            name: "rate",
            serialization: "bytemuckunsafe",
            repr: {
                kind: "c"
            },
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "lastUpdated",
                        type: "i64"
                    },
                    {
                        name: "lastValue",
                        type: "u32"
                    },
                    {
                        name: "align0",
                        type: {
                            array: [
                                "u8",
                                4
                            ]
                        }
                    },
                    {
                        name: "lastEmaHourUpdated",
                        type: "i64"
                    },
                    {
                        name: "emaHourly",
                        type: "u32"
                    },
                    {
                        name: "align1",
                        type: {
                            array: [
                                "u8",
                                4
                            ]
                        }
                    },
                    {
                        name: "lastEmaDayUpdated",
                        type: "i64"
                    },
                    {
                        name: "ema3d",
                        type: "u32"
                    },
                    {
                        name: "ema7d",
                        type: "u32"
                    },
                    {
                        name: "ema14d",
                        type: "u32"
                    },
                    {
                        name: "ema30d",
                        type: "u32"
                    },
                    {
                        name: "ema90d",
                        type: "u32"
                    },
                    {
                        name: "ema180d",
                        type: "u32"
                    },
                    {
                        name: "ema365d",
                        type: "u32"
                    },
                    {
                        name: "align2",
                        type: {
                            array: [
                                "u8",
                                4
                            ]
                        }
                    },
                    {
                        name: "padding1",
                        type: {
                            array: [
                                "u64",
                                7
                            ]
                        }
                    }
                ]
            }
        },
        {
            name: "vaultLeverage",
            serialization: "bytemuckunsafe",
            repr: {
                kind: "c"
            },
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "isInitialized",
                        type: "bool"
                    },
                    {
                        name: "version",
                        type: "u8"
                    },
                    {
                        name: "bump",
                        type: "u8"
                    },
                    {
                        name: "align0",
                        type: {
                            array: [
                                "u8",
                                5
                            ]
                        }
                    },
                    {
                        name: "protocol",
                        type: "pubkey"
                    },
                    {
                        name: "leverageStats",
                        type: "pubkey"
                    },
                    {
                        name: "creator",
                        type: "pubkey"
                    },
                    {
                        name: "authority",
                        type: "pubkey"
                    },
                    {
                        name: "leverageConfig",
                        type: "pubkey"
                    },
                    {
                        name: "borrowVault",
                        type: "pubkey"
                    },
                    {
                        name: "tokenCollateralPriceOracle",
                        type: "pubkey"
                    },
                    {
                        name: "tokenCollateralPriceFeed",
                        type: {
                            array: [
                                "u8",
                                64
                            ]
                        }
                    },
                    {
                        name: "tokenCollateralTokenProgram",
                        type: "pubkey"
                    },
                    {
                        name: "tokenCollateralTokenMint",
                        type: "pubkey"
                    },
                    {
                        name: "tokenCollateralVaultLiquidity",
                        type: "pubkey"
                    },
                    {
                        name: "tokenCollateralTokenDecimal",
                        type: "u8"
                    },
                    {
                        name: "align1",
                        type: {
                            array: [
                                "u8",
                                7
                            ]
                        }
                    },
                    {
                        name: "nativeCollateralPriceOracle",
                        type: "pubkey"
                    },
                    {
                        name: "nativeCollateralPriceFeed",
                        type: {
                            array: [
                                "u8",
                                64
                            ]
                        }
                    },
                    {
                        name: "nativeCollateralTokenProgram",
                        type: "pubkey"
                    },
                    {
                        name: "nativeCollateralTokenMint",
                        type: "pubkey"
                    },
                    {
                        name: "nativeCollateralVaultLiquidity",
                        type: "pubkey"
                    },
                    {
                        name: "nativeCollateralTokenDecimal",
                        type: "u8"
                    },
                    {
                        name: "align2",
                        type: {
                            array: [
                                "u8",
                                7
                            ]
                        }
                    },
                    {
                        name: "lastUpdated",
                        type: "i64"
                    },
                    {
                        name: "borrowingUnitSupply",
                        type: "u128"
                    },
                    {
                        name: "borrowingIndex",
                        type: "u128"
                    },
                    {
                        name: "unitSupply",
                        type: "u128"
                    },
                    {
                        name: "index",
                        type: "u128"
                    },
                    {
                        name: "lastIndexUpdated",
                        type: "i64"
                    },
                    {
                        name: "borrowingApy",
                        type: {
                            defined: {
                                name: "rate"
                            }
                        }
                    },
                    {
                        name: "apy",
                        type: {
                            defined: {
                                name: "rate"
                            }
                        }
                    },
                    {
                        name: "padding1",
                        type: {
                            array: [
                                "u64",
                                64
                            ]
                        }
                    }
                ]
            }
        },
        {
            name: "Lender",
            serialization: "bytemuckunsafe",
            repr: {
                kind: "c"
            },
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "is_initialized",
                        type: "bool"
                    },
                    {
                        name: "version",
                        type: "u8"
                    },
                    {
                        name: "bump",
                        type: "u8"
                    },
                    {
                        name: "align",
                        type: {
                            array: [
                                "u8",
                                5
                            ]
                        }
                    },
                    {
                        name: "owner",
                        type: "pubkey"
                    },
                    {
                        name: "protocol",
                        type: "pubkey"
                    },
                    {
                        name: "vault",
                        type: "pubkey"
                    },
                    {
                        name: "last_updated",
                        type: "i64"
                    },
                    {
                        name: "pending_deposit_amount",
                        type: "u64"
                    },
                    {
                        name: "pending_deposit_unit",
                        type: "u64"
                    },
                    {
                        name: "pending_deposit_index",
                        type: "u128"
                    },
                    {
                        name: "pending_withdraw_amount",
                        type: "u64"
                    },
                    {
                        name: "pending_withdraw_unit",
                        type: "u64"
                    },
                    {
                        name: "pending_withdraw_index",
                        type: "u128"
                    },
                    {
                        name: "unit",
                        type: "u64"
                    },
                    {
                        name: "index",
                        type: "u128"
                    },
                    {
                        name: "padding1",
                        type: {
                            array: [
                                "u64",
                                10
                            ]
                        }
                    }
                ]
            }
        },
        {
            name: "Obligation",
            serialization: "bytemuckunsafe",
            repr: {
                kind: "c"
            },
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "is_initialized",
                        type: "bool"
                    },
                    {
                        name: "version",
                        type: "u8"
                    },
                    {
                        name: "bump",
                        type: "u8"
                    },
                    {
                        name: "align0",
                        type: {
                            array: [
                                "u8",
                                5
                            ]
                        }
                    },
                    {
                        name: "owner",
                        type: "pubkey"
                    },
                    {
                        name: "protocol",
                        type: "pubkey"
                    },
                    {
                        name: "vault",
                        type: "pubkey"
                    },
                    {
                        name: "borrow_vault",
                        type: "pubkey"
                    },
                    {
                        name: "last_updated",
                        type: "i64"
                    },
                    {
                        name: "positions",
                        type: {
                            array: [
                                {
                                    defined: {
                                        name: "Position"
                                    }
                                },
                                3
                            ]
                        }
                    },
                    {
                        name: "padding1",
                        type: {
                            array: [
                                "u64",
                                64
                            ]
                        }
                    }
                ]
            }
        },
        {
            name: "LeverageAction",
            type: {
                kind: "enum",
                variants: [
                    {
                        name: "Idle"
                    },
                    {
                        name: "Open"
                    },
                    {
                        name: "AddCollateral"
                    },
                    {
                        name: "AddPosition"
                    },
                    {
                        name: "Close"
                    },
                    {
                        name: "Safe"
                    },
                    {
                        name: "Eject"
                    },
                    {
                        name: "Liquidate"
                    },
                    {
                        name: "Deleverage"
                    },
                    {
                        name: "TakeProfit"
                    }
                ]
            }
        },
        {
            name: "PositionState",
            serialization: "bytemuckunsafe",
            repr: {
                kind: "c"
            },
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "action",
                        type: {
                            defined: {
                                name: "LeverageAction"
                            }
                        }
                    },
                    {
                        name: "align01",
                        type: {
                            array: [
                                "u8",
                                7
                            ]
                        }
                    },
                    {
                        name: "token_collateral_price_oracle",
                        type: "pubkey"
                    },
                    {
                        name: "token_collateral_price_feed",
                        type: {
                            array: [
                                "u8",
                                64
                            ]
                        }
                    },
                    {
                        name: "token_collateral_price",
                        type: "u64"
                    },
                    {
                        name: "token_collateral_price_exponent",
                        type: "u32"
                    },
                    {
                        name: "align0",
                        type: {
                            array: [
                                "u8",
                                4
                            ]
                        }
                    },
                    {
                        name: "native_collateral_price_oracle",
                        type: "pubkey"
                    },
                    {
                        name: "native_collateral_price_feed",
                        type: {
                            array: [
                                "u8",
                                64
                            ]
                        }
                    },
                    {
                        name: "native_collateral_price",
                        type: "u64"
                    },
                    {
                        name: "native_collateral_price_exponent",
                        type: "u32"
                    },
                    {
                        name: "protocol_fee",
                        type: "u32"
                    },
                    {
                        name: "leverage_fee",
                        type: "u32"
                    },
                    {
                        name: "deleverage_fee",
                        type: "u32"
                    },
                    {
                        name: "closing_fee",
                        type: "u32"
                    },
                    {
                        name: "spread_rate",
                        type: "u32"
                    },
                    {
                        name: "liquidation_fee",
                        type: "u32"
                    },
                    {
                        name: "liquidation_threshold",
                        type: "u32"
                    },
                    {
                        name: "liquidation_protocol_ratio",
                        type: "u32"
                    },
                    {
                        name: "slippage_rate",
                        type: "u32"
                    },
                    {
                        name: "emergency_eject_period",
                        type: "i64"
                    },
                    {
                        name: "saver_threshold",
                        type: "u32"
                    },
                    {
                        name: "saver_target_reduction",
                        type: "u32"
                    },
                    {
                        name: "fund_amount",
                        type: "u64"
                    },
                    {
                        name: "leverage_fee_amount",
                        type: "u64"
                    },
                    {
                        name: "borrow_amount",
                        type: "u64"
                    },
                    {
                        name: "borrowing_fee_amount",
                        type: "u64"
                    },
                    {
                        name: "borrowing_unit",
                        type: "u64"
                    },
                    {
                        name: "borrowing_index",
                        type: "u128"
                    },
                    {
                        name: "leveraged_amount",
                        type: "u64"
                    },
                    {
                        name: "min_native_collateral_output",
                        type: "u64"
                    },
                    {
                        name: "release_amount",
                        type: "u64"
                    },
                    {
                        name: "release_unit",
                        type: "u64"
                    },
                    {
                        name: "release_index",
                        type: "u128"
                    },
                    {
                        name: "release_rate",
                        type: "u32"
                    },
                    {
                        name: "align1",
                        type: {
                            array: [
                                "u8",
                                4
                            ]
                        }
                    },
                    {
                        name: "repay_amount",
                        type: "u64"
                    },
                    {
                        name: "repay_unit",
                        type: "u64"
                    },
                    {
                        name: "repay_index",
                        type: "u128"
                    },
                    {
                        name: "release_min_output",
                        type: "u64"
                    },
                    {
                        name: "release_current_leverage",
                        type: "u32"
                    },
                    {
                        name: "release_target_leverage",
                        type: "u32"
                    },
                    {
                        name: "utilization_rate",
                        type: "u32"
                    },
                    {
                        name: "align2",
                        type: {
                            array: [
                                "u8",
                                4
                            ]
                        }
                    },
                    {
                        name: "protocol_fee_factor",
                        type: "u128"
                    },
                    {
                        name: "protocol_fee_amount",
                        type: "u64"
                    },
                    {
                        name: "repay_borrow_amount",
                        type: "u64"
                    },
                    {
                        name: "liquidation_fee_amount",
                        type: "u64"
                    },
                    {
                        name: "health_factor",
                        type: "u32"
                    },
                    {
                        name: "borrow_fee",
                        type: "u32"
                    },
                    {
                        name: "padding1",
                        type: {
                            array: [
                                "u64",
                                63
                            ]
                        }
                    }
                ]
            }
        },
        {
            name: "Position",
            serialization: "bytemuckunsafe",
            repr: {
                kind: "c"
            },
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "owner",
                        type: "pubkey"
                    },
                    {
                        name: "id",
                        type: "pubkey"
                    },
                    {
                        name: "tag_id",
                        type: {
                            array: [
                                "u8",
                                64
                            ]
                        }
                    },
                    {
                        name: "number",
                        type: "i8"
                    },
                    {
                        name: "align0",
                        type: {
                            array: [
                                "u8",
                                7
                            ]
                        }
                    },
                    {
                        name: "open_at",
                        type: "i64"
                    },
                    {
                        name: "last_updated",
                        type: "i64"
                    },
                    {
                        name: "emergency_eject",
                        type: "bool"
                    },
                    {
                        name: "safety_mode",
                        type: "bool"
                    },
                    {
                        name: "safety_level",
                        type: "u8"
                    },
                    {
                        name: "align1",
                        type: {
                            array: [
                                "u8",
                                5
                            ]
                        }
                    },
                    {
                        name: "token_collateral_amount",
                        type: "u64"
                    },
                    {
                        name: "token_to_native_ratio",
                        type: "u128"
                    },
                    {
                        name: "borrowing_unit",
                        type: "u64"
                    },
                    {
                        name: "avg_borrowing_index",
                        type: "u128"
                    },
                    {
                        name: "unit",
                        type: "u64"
                    },
                    {
                        name: "avg_index",
                        type: "u128"
                    },
                    {
                        name: "state",
                        type: {
                            defined: {
                                name: "PositionState"
                            }
                        }
                    },
                    {
                        name: "token_collateral_price_oracle",
                        type: "pubkey"
                    },
                    {
                        name: "token_collateral_price_feed",
                        type: {
                            array: [
                                "u8",
                                64
                            ]
                        }
                    },
                    {
                        name: "token_collateral_price",
                        type: "u64"
                    },
                    {
                        name: "token_collateral_price_exponent",
                        type: "u32"
                    },
                    {
                        name: "align2",
                        type: {
                            array: [
                                "u8",
                                4
                            ]
                        }
                    },
                    {
                        name: "native_collateral_price_oracle",
                        type: "pubkey"
                    },
                    {
                        name: "native_collateral_price_feed",
                        type: {
                            array: [
                                "u8",
                                64
                            ]
                        }
                    },
                    {
                        name: "native_collateral_price",
                        type: "u64"
                    },
                    {
                        name: "native_collateral_price_exponent",
                        type: "u32"
                    },
                    {
                        name: "profit_taker",
                        type: "bool"
                    },
                    {
                        name: "align3",
                        type: {
                            array: [
                                "u8",
                                3
                            ]
                        }
                    },
                    {
                        name: "profit_target_rate",
                        type: "u32"
                    },
                    {
                        name: "profit_taking_rate",
                        type: "u32"
                    },
                    {
                        name: "padding1",
                        type: {
                            array: [
                                "u64",
                                63
                            ]
                        }
                    }
                ]
            }
        }
    ]
}
