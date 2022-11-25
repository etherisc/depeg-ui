export enum PolicyStatus {
    ACTIVE,
    APPLIED,
    EXPIRED,
    PAYED_OUT
}

export interface PolicyRowView {
    id: string;
    walletAddress: string;
    insuredAmount: string;
    created: string;
    coverageUntil: string;
    state: string;
}
