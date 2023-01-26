import { BigNumber, Signer } from "ethers";
import { ApplicationApi, BackendApi, InvestApi } from "./backend_api";
import { createApprovalForTreasury } from "./treasury";
import { DepegProductApi } from "./depeg_product_api";
import { PolicyData } from "./policy_data";
import { ApplicationApiSmartContract } from "./application_api_smart_contract";
import { InvestApiSmartContract } from "./invest_api_smart_contract";
import { hasBalanceBN } from "./erc20";

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
        const insuredAmountMin = parseInt(process.env.NEXT_PUBLIC_DEPEG_SUMINSURED_MINIMUM || "0");
        const insuredAmountMax = parseInt(process.env.NEXT_PUBLIC_DEPEG_SUMINSURED_MAXIMUM || "0");
        const coverageDurationDaysMin = parseInt(process.env.NEXT_PUBLIC_DEPEG_COVERAGE_DURATION_DAYS_MINIMUM || "0");
        const coverageDurationDaysMax = parseInt(process.env.NEXT_PUBLIC_DEPEG_COVERAGE_DURATION_DAYS_MAXIMUM || "0");
        const investedAmountMin = parseInt(process.env.NEXT_PUBLIC_DEPEG_INVESTED_AMOUNT_MINIMUM || "0");
        const investedAmountMax = parseInt(process.env.NEXT_PUBLIC_DEPEG_INVESTED_AMOUNT_MAXIMUM || "0");
        const annualPctReturn = parseInt(process.env.NEXT_PUBLIC_DEPEG_ANNUAL_PCT_RETURN || "0");
        const annualPctReturnMax = parseInt(process.env.NEXT_PUBLIC_DEPEG_ANNUAL_PCT_RETURN_MAXIMUM || "0");

        this.doNoUseDirectlyDepegProductApi = new DepegProductApi(this.depegProductAddress, this.signer);
        this.application = new ApplicationApiSmartContract(this.doNoUseDirectlyDepegProductApi, insuredAmountMin, insuredAmountMax, coverageDurationDaysMin, coverageDurationDaysMax);
        this.invest = new InvestApiSmartContract(this.doNoUseDirectlyDepegProductApi, minLifetime, maxLifetime, investedAmountMin, investedAmountMax, insuredAmountMin, insuredAmountMax, coverageDurationDaysMin, coverageDurationDaysMax, annualPctReturn, annualPctReturnMax);
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

    async policy(walletAddress: string, idx: number): Promise<PolicyData> {
        return await (await this.getProductApi()).getPolicy(walletAddress, idx);
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
        return await hasBalanceBN(walletAddress, amount, token, this.signer);
    }

    async createTreasuryApproval(
        walletAddress: string, 
        premium: number, 
        beforeApprovalCallback?: (address: string, currency: string, amount: number) => void,
        beforeWaitCallback?: (address: string, currency: string, amount: number) => void,
    ): Promise<boolean> {
        console.log("createApproval", walletAddress, premium);
        // TODO: avoid this
        const depegProduct = (await this.getProductApi()).getDepegProduct();
        const [tx, receipt] = await createApprovalForTreasury(await depegProduct.getToken(), this.signer, premium, await depegProduct.getRegistry(), beforeApprovalCallback, beforeWaitCallback);
        console.log("tx", tx, "receipt", receipt);
        return Promise.resolve(receipt.status === 1);
    }
}

