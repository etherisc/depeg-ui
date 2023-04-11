import { AnyAction } from "@reduxjs/toolkit";
import { BigNumber, Signer } from "ethers";
import { Dispatch } from "react";
import { updateBundle } from "../redux/slices/bundles";
import { DepegState } from "../types/depeg_state";
import { ApplicationApiSmartContract } from "./application_api_smart_contract";
import { ApplicationApi, BackendApi, InvestApi } from "./backend_api";
import { BundleData } from "./bundle_data";
import { DepegProductApi } from "./depeg_product_api";
import { hasBalance } from "./erc20";
import { InvestApiSmartContract } from "./invest_api_smart_contract";
import { PolicyData } from "./policy_data";
import { PriceFeedApi } from "./price_feed/api";
import { PriceFeed } from "./price_feed/price_feed";
import { createApprovalForTreasury } from "./treasury";

export class BackendApiSmartContract implements BackendApi {

    private signer: Signer;
    private depegProductAddress: string;
    /** 
     * DO NOT USE DIRECTLY - use getProductApi() instead 
     */
    private doNoUseDirectlyDepegProductApi: DepegProductApi;
    
    usd1: string;
    usd1Decimals: number;
    usd2: string;
    usd2Decimals: number;
    application: ApplicationApi;
    invest: InvestApi;
    priceFeed: PriceFeedApi;

    constructor(
        signer: Signer,
        depegProductContractAddress: string, 
    ) {
        this.signer = signer;
        this.depegProductAddress = depegProductContractAddress;
        this.usd1 = process.env.NEXT_PUBLIC_DEPEG_USD1 || "";
        this.usd1Decimals = parseInt(process.env.NEXT_PUBLIC_DEPEG_USD1_DECIMALS || '6');
        this.usd2 = process.env.NEXT_PUBLIC_DEPEG_USD2 || "";
        this.usd2Decimals = parseInt(process.env.NEXT_PUBLIC_DEPEG_USD2_DECIMALS || '6');

        const minLifetime = parseInt(process.env.NEXT_PUBLIC_DEPEG_LIFETIME_DAYS_MINIMUM || "14");
        const maxLifetime = parseInt(process.env.NEXT_PUBLIC_DEPEG_LIFETIME_DAYS_MAXIMUM || "365");
        const insuredAmountMin = BigNumber.from(process.env.NEXT_PUBLIC_DEPEG_SUMINSURED_MINIMUM || "0");
        const insuredAmountMax = BigNumber.from(process.env.NEXT_PUBLIC_DEPEG_SUMINSURED_MAXIMUM || "0");
        const coverageDurationDaysMin = parseInt(process.env.NEXT_PUBLIC_DEPEG_COVERAGE_DURATION_DAYS_MINIMUM || "0");
        const coverageDurationDaysMax = parseInt(process.env.NEXT_PUBLIC_DEPEG_COVERAGE_DURATION_DAYS_MAXIMUM || "0");
        const investedAmountMin = BigNumber.from(process.env.NEXT_PUBLIC_DEPEG_INVESTED_AMOUNT_MINIMUM || "0");
        const investedAmountMax = BigNumber.from(process.env.NEXT_PUBLIC_DEPEG_INVESTED_AMOUNT_MAXIMUM || "0");
        const annualPctReturn = parseInt(process.env.NEXT_PUBLIC_DEPEG_ANNUAL_PCT_RETURN || "0");
        const annualPctReturnMax = parseInt(process.env.NEXT_PUBLIC_DEPEG_ANNUAL_PCT_RETURN_MAXIMUM || "0");

        this.doNoUseDirectlyDepegProductApi = new DepegProductApi(this.depegProductAddress, this.signer);
        this.application = new ApplicationApiSmartContract(this.doNoUseDirectlyDepegProductApi, insuredAmountMin, insuredAmountMax, coverageDurationDaysMin, coverageDurationDaysMax, this.usd2Decimals);
        this.invest = new InvestApiSmartContract(this.doNoUseDirectlyDepegProductApi, minLifetime, maxLifetime, investedAmountMin, investedAmountMax, insuredAmountMin, insuredAmountMax, coverageDurationDaysMin, coverageDurationDaysMax, annualPctReturn, annualPctReturnMax, this.usd2Decimals);
        this.priceFeed = new PriceFeed(this.depegProductAddress, this.signer);
    }

    /**
     * 
     * @returns lazy loaded DepegProductApi
     */
    private async getProductApi(): Promise<DepegProductApi> {
        // console.log("this.doNoUseDirectlyDepegProductApi", this.doNoUseDirectlyDepegProductApi);
        if (! this.doNoUseDirectlyDepegProductApi.isInitialized()) {
            await this.doNoUseDirectlyDepegProductApi.initialize();
        }
        return this.doNoUseDirectlyDepegProductApi;
    }

    async policy(walletAddress: string, idx: number, checkClaim: boolean): Promise<PolicyData> {
        return await (await this.getProductApi()).getPolicy(walletAddress, idx, checkClaim);
    }

    async policies(walletAddress: string): Promise<Array<PolicyData>> {
        return await (await this.getProductApi()).getPolicies(walletAddress);
    }

    async policiesCount(walletAddress: string): Promise<number> {
        return await (await this.getProductApi()).getPoliciesCount(walletAddress);
    }

    async getWalletAddress(): Promise<string> {
        return await this.signer.getAddress();
    }

    async hasUsd2Balance(walletAddress: string, amount: BigNumber): Promise<boolean> {
        const token = await (await this.getProductApi()).getUsd2Address();
        return await hasBalance(walletAddress, amount, token, this.signer);
    }

    async createTreasuryApproval(
        walletAddress: string, 
        premium: BigNumber, 
    ): Promise<boolean> {
        console.log("createApproval", walletAddress, premium);
        const depegProduct = (await this.getProductApi()).getDepegProduct();
        console.log("fsdsfsd");
        const token = await (await this.getProductApi()).getUsd2Address();
        console.log("fsdsfsd1");
        const registry = await depegProduct.getRegistry();
        console.log("fsdsfsd2");
        const { tx, receipt, exists } = await createApprovalForTreasury(token, this.signer, premium, registry);
        if (exists) {
            return true;
        }
        console.log("tx", tx, "receipt", receipt);
        return Promise.resolve(receipt!.status === 1);
    }

    async getDepegState(): Promise<DepegState> {
        const token = await (await this.getProductApi()).getUsd2Address();

        return await (await this.getProductApi()).getDepegState();
    }

    async triggerBundleUpdate(bundleId: number, dispatch?: Dispatch<AnyAction>): Promise<BundleData> {
        const res = await fetch("/api/bundles/update?bundleId=" + bundleId);

        if (res.status != 200) {
            throw new Error(`invalid response from backend. statuscode ${res.status}. test: ${res.text}`);
        }

        const bundles = await res.json() as BundleData[];
        const updatedBundle = bundles[0];
        if (dispatch !== undefined) {
            dispatch(updateBundle(updatedBundle));
        }
        return updatedBundle;
    }
}

