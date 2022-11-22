import { Signer, VoidSigner } from "ethers";
import { SnackbarMessage, OptionsObject, SnackbarKey } from "notistack";
import { DepegProduct__factory } from "../../contracts/depeg-contracts";
import { ApplicationApi, InsuranceApi, InvestApi } from "../../model/insurance_api";
import { PolicyRowView } from "../../model/policy";
import { delay } from "../../utils/delay";
import { BalanceTooSmallError, NoBundleFoundError } from "../../utils/error";
import { getBestQuote, getBundleData } from "./riskbundle";
import { BundleData } from "./bundle_data";
import { createApprovalForTreasury } from "./treasury";
import { applyForDepegPolicy, getPolicyEndDate, extractProcessIdFromApplicationLogs, getInstanceFromProduct, getPolicies, getPolicyState, PolicyState, getPoliciesCount, getPolicy } from "./depeg_product";
import { hasBalance } from "./erc20";

export class InsuranceApiSmartContract implements InsuranceApi {

    private signer: Signer;
    private depegProductContractAddress: string;
    private t: (key: string) => string;
    
    application: ApplicationApiSmartContract;
    invest: InvestApiSmartContract;
    usd1: string;
    usd2: string;

    constructor(
        signer: Signer,
        depegProductContractAddress: string, 
        t: (key: string) => string
    ) {
        this.signer = signer;
        this.depegProductContractAddress = depegProductContractAddress;
        this.t = t;
        this.usd1 = process.env.NEXT_PUBLIC_DEPEG_USD1 || "";
        this.usd2 = process.env.NEXT_PUBLIC_DEPEG_USD2 || "";
        const insuredAmountMin = parseInt(process.env.NEXT_PUBLIC_DEPEG_SUMINSURED_MINIMUM || "0");
        const insuredAmountMax = parseInt(process.env.NEXT_PUBLIC_DEPEG_SUMINSURED_MAXIMUM || "0");
        const coverageDurationDaysMin = parseInt(process.env.NEXT_PUBLIC_DEPEG_COVERAGE_DURATION_DAYS_MINIMUM || "0");
        const coverageDurationDaysMax = parseInt(process.env.NEXT_PUBLIC_DEPEG_COVERAGE_DURATION_DAYS_MAXIMUM || "0");
        const investedAmountMin = parseInt(process.env.NEXT_PUBLIC_DEPEG_INVESTED_AMOUNT_MINIMUM || "0");
        const investedAmountMax = parseInt(process.env.NEXT_PUBLIC_DEPEG_INVESTED_AMOUNT_MAXIMUM || "0");
        const annualPctReturn = parseInt(process.env.NEXT_PUBLIC_DEPEG_ANNUAL_PCT_RETURN || "0");
        const annualPctReturnMax = parseInt(process.env.NEXT_PUBLIC_DEPEG_ANNUAL_PCT_RETURN_MAXIMUM || "0");
    
        this.application = new ApplicationApiSmartContract(signer, depegProductContractAddress, insuredAmountMin, insuredAmountMax, coverageDurationDaysMin, coverageDurationDaysMax);
        this.invest = new InvestApiSmartContract(signer, depegProductContractAddress, investedAmountMin, investedAmountMax, insuredAmountMin, insuredAmountMax, coverageDurationDaysMin, coverageDurationDaysMax, annualPctReturn, annualPctReturnMax);
    }

    async policy(walletAddress: string, idx: number): Promise<PolicyRowView> {
        const rawPolicy = await getPolicy(walletAddress, idx, this.depegProductContractAddress, this.signer);
        const state = getPolicyState(rawPolicy);
        return {
            id: rawPolicy.processId,
            walletAddress: rawPolicy.owner,
            insuredAmount: `${this.usd1} ${rawPolicy.suminsured.toString()}`,
            coverageUntil: getPolicyEndDate(rawPolicy),
            state: this.t('application_state_' + state),
        } as PolicyRowView;
    }

    async policies(walletAddress: string): Promise<Array<PolicyRowView>> {
        const rawPolicies = await getPolicies(walletAddress, this.depegProductContractAddress, this.signer);
        return rawPolicies
            // TODO: move this mapping to ui
            .map(policy => {
                const state = getPolicyState(policy);
                return {
                    id: policy.processId,
                    walletAddress: policy.owner,
                    insuredAmount: `${this.usd1} ${policy.suminsured.toString()}`,
                    coverageUntil: getPolicyEndDate(policy),
                    state: this.t('application_state_' + state),
                } as PolicyRowView;
            });
    }

    async policiesCount(walletAddress: string): Promise<number> {
        return await getPoliciesCount(walletAddress, this.depegProductContractAddress, this.signer);
    }

    async createTreasuryApproval(walletAddress: string, premium: number, beforeWaitCallback?: () => void) {
        console.log("createApproval", walletAddress, premium);
        const product = DepegProduct__factory.connect(this.depegProductContractAddress, this.signer);
        const [tx, receipt] = await createApprovalForTreasury(await product.getToken(), this.signer, premium, await product.getRegistry(), beforeWaitCallback);
        console.log("tx", tx, "receipt", receipt);
        return Promise.resolve(true);
    }
}

class ApplicationApiSmartContract implements ApplicationApi {
    private signer: Signer;
    private depegProductContractAddress: string;
    insuredAmountMin: number;
    insuredAmountMax: number;
    coverageDurationDaysMin: number;
    coverageDurationDaysMax: number;
    
    constructor(signer: Signer,depegProductContractAddress: string, insuredAmountMin: number, insuredAmountMax: number, coverageDurationDaysMin: number, coverageDurationDaysMax: number) {
        this.signer = signer;
        this.depegProductContractAddress = depegProductContractAddress;
        this.insuredAmountMin = insuredAmountMin;
        this.insuredAmountMax = insuredAmountMax;
        this.coverageDurationDaysMin = coverageDurationDaysMin;
        this.coverageDurationDaysMax = coverageDurationDaysMax;
    }
    
    
    async getRiskBundles() {
        console.log("retrieving risk bundles from smart contract at " + this.depegProductContractAddress);
        const [ product, riskpool, riskpoolId, instanceService ] = await getInstanceFromProduct(this.depegProductContractAddress, this.signer);
        console.log(`riskpoolId: ${riskpoolId}, depegRiskpool: ${riskpool}`);
        return await getBundleData(instanceService, riskpoolId, riskpool);
    }

    async calculatePremium(walletAddress: string, insuredAmount: number, coverageDurationDays: number, bundles: Array<BundleData>): Promise<number> {
        if (this.signer instanceof VoidSigner) {
            console.log('no chain connection, no premium calculation');
            return Promise.resolve(0);
        }

        const durationSecs = coverageDurationDays * 24 * 60 * 60;
        console.log("calculatePremium", walletAddress, insuredAmount, coverageDurationDays);
        const product = DepegProduct__factory.connect(this.depegProductContractAddress, this.signer);
        console.log("bundleData", bundles);
        const bestBundle = getBestQuote(bundles, insuredAmount, durationSecs);
        if (bestBundle.idx == -1) { 
            throw new NoBundleFoundError();
        }
        console.log("bestBundle", bestBundle);
        const netPremium = (await product.calculateNetPremium(insuredAmount, durationSecs, bestBundle.bundleId)).toNumber();
        console.log("netPremium", netPremium);
        const premium = (await product.calculatePremium(netPremium)).toNumber();
        console.log("premium", premium);

        if (! await hasBalance(walletAddress, premium, await product.getToken(), this.signer)) {
            throw new BalanceTooSmallError();
        }

        return Promise.resolve(premium);
    }

    async applyForPolicy(
            walletAddress: string, 
            insuredAmount: number, 
            coverageDurationDays: number,
            premium: number,
            beforeWaitCallback?: () => void
        ) {
        console.log("applyForPolicy", walletAddress, insuredAmount, coverageDurationDays, premium);
        const [tx, receipt] = await applyForDepegPolicy(this.depegProductContractAddress, this.signer, insuredAmount, coverageDurationDays, premium, beforeWaitCallback);
        let processId = extractProcessIdFromApplicationLogs(receipt.logs);
        console.log(`processId: ${processId}`);
        return Promise.resolve(true);
    }
}

export class InvestApiSmartContract implements InvestApi {
    private signer: Signer;
    private depegProductContractAddress: string;

    minInvestedAmount: number;
    maxInvestedAmount: number;
    minSumInsured: number;
    maxSumInsured: number;
    minCoverageDuration: number;
    maxCoverageDuration: number;
    annualPctReturn: number;
    maxAnnualPctReturn: number;

    constructor(signer: Signer, depegProductContractAddress: string, minInvestedAmount: number, maxInvestedAmount: number, minSumInsured: number, maxSumInsured: number, minCoverageDuration: number, maxCoverageDuration: number, annualPctReturn: number, maxAnnualPctReturn: number) {
        this.signer = signer;
        this.depegProductContractAddress = depegProductContractAddress;
        this.minInvestedAmount = minInvestedAmount;
        this.maxInvestedAmount = maxInvestedAmount;
        this.minSumInsured = minSumInsured;
        this.maxSumInsured = maxSumInsured;
        this.minCoverageDuration = minCoverageDuration;
        this.maxCoverageDuration = maxCoverageDuration;
        this.annualPctReturn = annualPctReturn;
        this.maxAnnualPctReturn = maxAnnualPctReturn;
    }


    async invest(
        investorWalletAddress: string, 
        investedAmount: number, 
        minSumInsured: number, 
        maxSumInsured: number, 
        minDuration: number, 
        maxDuration: number, 
        annualPctReturn: number
    ): Promise<boolean> {
        // enqueueSnackbar(
        //     `Riskpool mocked ($investorWalletAddress, $investedAmount, $minSumInsured, $maxSumInsured, $minDuration, $maxDuration, $annualPctReturn)`,
        //     { autoHideDuration: 3000, variant: 'info' }
        // );
        await delay(2000);
        return Promise.resolve(true);
    }
}
