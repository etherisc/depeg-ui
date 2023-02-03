import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { BigNumber, ethers, Signer } from "ethers";
import { SnackbarMessage, OptionsObject, SnackbarKey } from "notistack";
import { BundleData } from "./bundle_data";
import { BackendApiMock } from "./backend_api_mock";
import { BackendApiSmartContract } from "./backend_api_smart_contract";
import { PolicyData } from "./policy_data";
import { PriceFeedApi } from "./price_feed/api";
import { ProductState } from "../types/product_state";

export interface BackendApi {
    usd1: string;
    usd1Decimals: number;
    usd2: string;
    usd2Decimals: number;
    getWalletAddress(): Promise<string>;
    hasUsd2Balance: (walletAddress: string, amount: BigNumber) => Promise<boolean>;
    createTreasuryApproval: 
        (
            walletAddress: string, 
            premium: BigNumber,
            beforeApprovalCallback?: (address: string, currency: string, amount: BigNumber) => void,
            beforeWaitCallback?: (address: string, currency: string, amount: BigNumber) => void
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
    getProductState(): Promise<ProductState>;
    application: ApplicationApi;
    invest: InvestApi;
    priceFeed: PriceFeedApi;
}

export interface ApplicationApi {
    insuredAmountMin: BigNumber;
    insuredAmountMax: BigNumber;
    coverageDurationDaysMin: number;
    coverageDurationDaysMax: number;
    /** Get all riskbundles for application from the blockchain */
    getRiskBundles: (
        handleBundle: (bundle: BundleData) => void
    ) => Promise<void>,
    /** Fetch all riskbundles for application from the api */
    fetchRiskBundles: (
        handleBundle: (bundle: BundleData) => void
    ) => Promise<void>,
    calculatePremium: 
        (
            walletAddress: string, 
            insuredAmount: BigNumber, 
            coverageDurationDays: number,
            bundles: Array<BundleData>,
        ) => Promise<[BigNumber, BundleData]>;
    applyForPolicy: 
        (
            walletAddress: string, 
            insuredAmount: BigNumber, 
            coverageDurationDays: number,
            premium: BigNumber,
            beforeApplyCallback?: (address: string) => void,
            beforeWaitCallback?: (address: string) => void
        ) => Promise<{ status: boolean, processId: string|undefined}>;
    lastBlockTimestamp(): Promise<number>;
}

export interface InvestApi {
    minLifetime: number;
    maxLifetime: number;
    minInvestedAmount: BigNumber;
    maxInvestedAmount: BigNumber;
    minSumInsured: BigNumber;
    maxSumInsured: BigNumber;
    minCoverageDuration: number;
    maxCoverageDuration: number;
    annualPctReturn: number;
    maxAnnualPctReturn: number;
    invest: 
        (
            name: string,
            lifetime: number,
            investorWalletAddress: string, 
            investedAmount: BigNumber, 
            minSumInsured: BigNumber, 
            maxSumInsured: BigNumber, 
            minDuration: number, 
            maxDuration: number, 
            annualPctReturn: number,
            beforeInvestCallback?: (address: string) => void,
            beforeWaitCallback?: (address: string) => void,
        ) => Promise<{ status: boolean, bundleId: string | undefined}>;
    bundleTokenAddress(): Promise<string>;
    bundleCount(): Promise<number>;
    bundleId(idx: number): Promise<number>;
    bundle(bundleId: number, walletAddress?: string): Promise<BundleData|undefined>;
    maxBundles(): Promise<number>;
}

export function getBackendApi(
        enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey, 
        t: (key: string) => string,
        signer?: Signer,
        provider?: ethers.providers.Provider
        ): BackendApi {
    
    const depegProductContractAddress = process.env.NEXT_PUBLIC_DEPEG_CONTRACT_ADDRESS;
    if (depegProductContractAddress == null) {
        console.log("Using mock insurance API");
        return BackendApiMock(enqueueSnackbar);
    } else {
        console.log("Using smart contract", depegProductContractAddress);
        let api: BackendApiSmartContract;
        if (signer === undefined || provider === undefined) {
            api = new BackendApiSmartContract(new ethers.VoidSigner(depegProductContractAddress, provider), depegProductContractAddress);
        } else {
            api = new BackendApiSmartContract(signer, depegProductContractAddress);
        }
        return api;
    }
}