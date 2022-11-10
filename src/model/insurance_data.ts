export interface InsuranceApi {
    usd1: string;
    usd2: string;
    insuredAmountMin: number;
    insuredAmountMax: number;
    coverageDurationDaysMin: number;
    coverageDurationDaysMax: number;
    calculatePremium: (walletAddress: string, insuredAmount: number, coverageDurationDays: number) => Promise<number>;
    createApproval: (walletAddress: string, premium: number) => Promise<boolean>;
    applyForPolicy: (walletAddress: string, insuredAmount: number, coverageDurationDays: number) => Promise<boolean>;
}