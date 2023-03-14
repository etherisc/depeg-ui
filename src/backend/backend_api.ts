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
        ) => Promise<boolean>;
    policy: 
        (
            walletAddress: string, 
            index: number,
            checkClaim: boolean,
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
    triggerBundleUpdate: (bundleId: number, dispatch: Dispatch<AnyAction>) => Promise<BundleData>;
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
    fetchStakeableRiskBundles: (
        handleBundle: (bundle: BundleData) => void
    ) => Promise<void>,
    calculatePremium: 
        (
            walletAddress: string, 
            insuredAmount: BigNumber, 
            coverageDurationSeconds: number,
            bundle: BundleData,
        ) => Promise<BigNumber>;
    applyForPolicy: 
        (
            walletAddress: string, 
            insuredAmount: BigNumber, 
            coverageDurationSeconds: number,
            bundleId: number,
            beforeApplyCallback?: (address: string) => void,
            beforeWaitCallback?: (address: string) => void
        ) => Promise<{ status: boolean, processId: string|undefined}>;
    lastBlockTimestamp(): Promise<number>;
    claim(
        processId: string,
        beforeTrxCallback?: (address: string) => void,
        beforeWaitCallback?: (address: string) => void,
    ): Promise<{ status: boolean, claimId: string|undefined}>;
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
    isRiskpoolCapacityAvailable(): Promise<boolean>;
    riskpoolRemainingCapacity(): Promise<BigNumber>;
    isInvestorWhitelisted(walletAddress: string): Promise<boolean>;
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
    fetchAllBundles(handleBundle: (bundle: BundleData) => void): Promise<void>;
    bundleCount(): Promise<number>;
    bundleId(idx: number): Promise<number>;
    bundle(bundleId: number, walletAddress?: string): Promise<BundleData|undefined>;
    activeBundles(): Promise<number>;
    maxBundles(): Promise<number>;
    lockBundle(
        bundleId: number,
        ): Promise<boolean>;
    unlockBundle(
        bundleId: number,
        ): Promise<boolean>;
    closeBundle(
        bundleId: number,
        ): Promise<boolean>;
    burnBundle(
        bundleId: number,
        ): Promise<boolean>;
    withdrawBundle(bundleId: number, amount: BigNumber): Promise<boolean>;
    fundBundle(bundleId: number, amount: BigNumber): Promise<boolean>;
    getBundleCapitalCap(): Promise<BigNumber>;
    getBundleLifetimeMin(): Promise<number>;
    getBundleLifetimeMax(): Promise<number>;
}

export function getBackendApi(
        enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey, 
        t: (key: string) => string,
        signer?: Signer,
        provider?: ethers.providers.Provider
        ): BackendApi {
    
    const depegProductContractAddress = process.env.NEXT_PUBLIC_DEPEG_CONTRACT_ADDRESS;
    if (depegProductContractAddress == null) {
        console.log("Using mock API");
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