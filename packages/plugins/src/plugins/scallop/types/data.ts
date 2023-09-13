export type UserLending = {
    coinType: string;
    amount: number;
};

export type CollateralAsset = {
    type: string;
    fields: {
        name: string;
    }
}

export type DebtAsset = {
    type: string;
    fields: {
        name: string;
    }
}