import { ethers, Signer } from "ethers";
import { SnackbarMessage, OptionsObject, SnackbarKey } from "notistack";
import { insuranceApiMock } from "../application/insurance/insurance_api_mock";
import { insuranceApiSmartContract } from "../application/insurance/insurance_api_smart_contract";
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
            coverageDurationDays: number,
            premium: number
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

export function getInsuranceApi(
        enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey, 
        signer?: Signer,
        provider?: ethers.providers.Provider
        ): InsuranceApi {
    const contractAddress = process.env.NEXT_PUBLIC_DEPECT_CONTRACT_ADDRESS;
    if (contractAddress == null) {
        console.log("Using mock insurance API");
        return insuranceApiMock(enqueueSnackbar);
    } else {
        console.log("Using smart contract", contractAddress);
        if (signer === undefined || provider === undefined) {
            return insuranceApiSmartContract(new ethers.VoidSigner(contractAddress, provider), contractAddress, enqueueSnackbar);
        } else {
            return insuranceApiSmartContract(signer, contractAddress, enqueueSnackbar);
        }
    }
}