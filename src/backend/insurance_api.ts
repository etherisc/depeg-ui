import { ethers, Signer } from "ethers";
import { SnackbarMessage, OptionsObject, SnackbarKey } from "notistack";
import { BundleData } from "./bundle_data";
import { insuranceApiMock } from "./insurance_api_mock";
import { InsuranceApiSmartContract } from "./insurance_api_smart_contract";
import { PolicyData } from "./policy_data";

export interface InsuranceApi {
    usd1: string;
    usd1Decimals: number;
    usd2: string;
    usd2Decimals: number;
    createTreasuryApproval: 
        (
            walletAddress: string, 
            premium: number,
            beforeApprovalCallback?: (address: string, currency: string, amount: number) => void,
            beforeWaitCallback?: (address: string, currency: string, amount: number) => void
        ) => Promise<boolean>;
    policy: 
        (
            walletAddress: string, 
            index: number,
        ) => Promise<PolicyData>;
    policies: 
        (
            walletAddress: string, 
        ) => Promise<Array<PolicyData>>;
    policiesCount
        (
            walletAddress: string,
        ): Promise<number>;
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
            beforeApplyCallback?: (address: string) => void,
            beforeWaitCallback?: (address: string) => void
        ) => Promise<boolean>;
}

export interface InvestApi {
    minLifetime: number;
    maxLifetime: number;
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
            name: string,
            lifetime: number,
            investorWalletAddress: string, 
            investedAmount: number, 
            minSumInsured: number, 
            maxSumInsured: number, 
            minDuration: number, 
            maxDuration: number, 
            annualPctReturn: number,
            beforeInvestCallback?: (address: string) => void,
            beforeWaitCallback?: (address: string) => void,
        ) => Promise<boolean>;
    bundleTokenAddress(): Promise<string>;
    bundleCount(): Promise<number>;
    bundleId(idx: number): Promise<number>;
    bundle(walletAddress: string, bundleTokenAddress: string, bundleId: number): Promise<BundleData|undefined>;
}

export function getInsuranceApi(
        enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey, 
        t: (key: string) => string,
        signer?: Signer,
        provider?: ethers.providers.Provider
        ): InsuranceApi {
    
    const depegProductContractAddress = process.env.NEXT_PUBLIC_DEPEG_CONTRACT_ADDRESS;
    if (depegProductContractAddress == null) {
        console.log("Using mock insurance API");
        return insuranceApiMock(enqueueSnackbar);
    } else {
        console.log("Using smart contract", depegProductContractAddress);
        let api: InsuranceApiSmartContract;
        if (signer === undefined || provider === undefined) {
            api = new InsuranceApiSmartContract(new ethers.VoidSigner(depegProductContractAddress, provider), depegProductContractAddress);
        } else {
            api = new InsuranceApiSmartContract(signer, depegProductContractAddress);
        }
        return api;
    }
}