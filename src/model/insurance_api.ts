import { ethers, Signer } from "ethers";
import { SnackbarMessage, OptionsObject, SnackbarKey } from "notistack";
import { BundleData } from "../application/insurance/bundle_data";
import { insuranceApiMock } from "../application/insurance/insurance_api_mock";
import { insuranceApiSmartContract } from "../application/insurance/insurance_api_smart_contract";
import { PolicyRowView } from "./policy";

export interface InsuranceApi {
    usd1: string;
    usd2: string;
    createTreasuryApproval: 
        (
            walletAddress: string, 
            premium: number,
            beforeWaitCallback?: () => void
        ) => Promise<boolean>;
    policies: 
        (
            walletAddress: string, 
            onlyActive: boolean
        ) => Promise<Array<PolicyRowView>>;
    application: ApplicationApi;
    invest: InvestApi;
}

export interface ApplicationApi {
    insuredAmountMin: number;
    insuredAmountMax: number;
    coverageDurationDaysMin: number;
    coverageDurationDaysMax: number;
    getRiskBundles: 
        () => Promise<Array<BundleData>>,
    calculatePremium: 
        (
            walletAddress: string, 
            insuredAmount: number, 
            coverageDurationDays: number,
            bundles: Array<BundleData>,
        ) => Promise<number>;
    applyForPolicy: 
        (
            walletAddress: string, 
            insuredAmount: number, 
            coverageDurationDays: number,
            premium: number,
            beforeWaitCallback?: () => void
        ) => Promise<boolean>;
}

export interface InvestApi {
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
    
    const depegProductContractAddress = process.env.NEXT_PUBLIC_DEPEG_CONTRACT_ADDRESS;
    if (depegProductContractAddress == null) {
        console.log("Using mock insurance API");
        return insuranceApiMock(enqueueSnackbar);
    } else {
        console.log("Using smart contract", depegProductContractAddress);
        if (signer === undefined || provider === undefined) {
            return insuranceApiSmartContract(new ethers.VoidSigner(depegProductContractAddress, provider), depegProductContractAddress, enqueueSnackbar);
        } else {
            return insuranceApiSmartContract(signer, depegProductContractAddress, enqueueSnackbar);
        }
    }
}