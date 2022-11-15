import { PolicyRowView } from "./policy";

export interface InsuranceApi {
    usd1: string;
    usd2: string;
    insuredAmountMin: number;
    insuredAmountMax: number;
    coverageDurationDaysMin: number;
    coverageDurationDaysMax: number;
    calculatePremium: 
        (
            walletAddress: string, 
            insuredAmount: number, 
            coverageDurationDays: number
        ) => Promise<number>;
    createApproval: 
        (
            walletAddress: string, 
            premium: number
        ) => Promise<boolean>;
    applyForPolicy: 
        (
            walletAddress: string, 
            insuredAmount: number, 
            coverageDurationDays: number
        ) => Promise<boolean>;
    policies: 
        (
            walletAddress: string, 
            onlyActive: boolean
        ) => Promise<Array<PolicyRowView>>;
    invest: InvestApi;
}

export interface InvestApi {
    usd1: string;
    minInvestedAmount: number;
    maxInvestedAmount: number;
    minSumInsured: number;
    maxSumInsured: number;
    minCoverageDuration: number;
    maxCoverageDuration: number;
    annualPctReturn: number;
    maxAnnualPctReturn: number;
    invest: 
        (
            investorWalletAddress: string, 
            investedAmount: number, 
            minSumInsured: number, 
            maxSumInsured: number, 
            minDuration: number, 
            maxDuration: number, 
            annualPctReturn: number
        ) => Promise<boolean>;
}