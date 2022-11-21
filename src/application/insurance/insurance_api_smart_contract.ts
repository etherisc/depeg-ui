import { Signer, VoidSigner } from "ethers";
import { SnackbarMessage, OptionsObject, SnackbarKey } from "notistack";
import { DepegProduct__factory } from "../../contracts/depeg-contracts";
import { ApplicationApi, InsuranceApi } from "../../model/insurance_api";
import { PolicyRowView } from "../../model/policy";
import { delay } from "../../utils/delay";
import { BalanceTooSmallError, NoBundleFoundError } from "../../utils/error";
import { getBestQuote, getBundleData } from "./riskbundle";
import { BundleData } from "./bundle_data";
import { createApprovalForTreasury } from "./treasury";
import { applyForDepegPolicy, getPolicyEndDate, extractProcessIdFromApplicationLogs, getInstanceFromProduct, getPolicies, getPolicyState, PolicyState, getPoliciesCount, getPolicy } from "./depeg_product";
import { hasBalance } from "./erc20";

export function insuranceApiSmartContract(
        signer: Signer,
        depegProductContractAddress: string, 
        enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey,
        t: (key: string) => string
        ): InsuranceApi {
    // TODO: get from smart contract
    const usd1 = 'USDC';
    const usd2 = 'USDT';
    return {
        usd1: usd1,
        usd2: usd2,
        application: applicationApi(signer, depegProductContractAddress),
        async policy(walletAddress: string, idx: number): Promise<PolicyRowView> {
            const rawPolicy = await getPolicy(walletAddress, idx, depegProductContractAddress, signer);
            const state = getPolicyState(rawPolicy);
            return {
                id: rawPolicy.processId,
                walletAddress: rawPolicy.owner,
                insuredAmount: `${usd1} ${rawPolicy.suminsured.toString()}`,
                coverageUntil: getPolicyEndDate(rawPolicy),
                state: t('application_state_' + state),
            } as PolicyRowView;
        },
        async policies(walletAddress: string): Promise<Array<PolicyRowView>> {
            const rawPolicies = await getPolicies(walletAddress, depegProductContractAddress, signer);
            return rawPolicies
                .map(policy => {
                    const state = getPolicyState(policy);
                    return {
                        id: policy.processId,
                        walletAddress: policy.owner,
                        insuredAmount: `${usd1} ${policy.suminsured.toString()}`,
                        coverageUntil: getPolicyEndDate(policy),
                        state: t('application_state_' + state),
                    } as PolicyRowView;
                });
        },
        async policiesCount(walletAddress: string): Promise<number> {
            return await getPoliciesCount(walletAddress, depegProductContractAddress, signer);
        },
        invest: investMock(enqueueSnackbar),
        async createTreasuryApproval(walletAddress: string, premium: number, beforeWaitCallback?) {
            console.log("createApproval", walletAddress, premium);
            const product = DepegProduct__factory.connect(depegProductContractAddress, signer);
            const [tx, receipt] = await createApprovalForTreasury(await product.getToken(), signer, premium, await product.getRegistry(), beforeWaitCallback);
            console.log("tx", tx, "receipt", receipt);
            return Promise.resolve(true);
        },
    } as InsuranceApi;
}

function applicationApi(signer: Signer,
        depegProductContractAddress: string, 
        ) {
    return {
        insuredAmountMin: 1000,
        insuredAmountMax: 20000,
        coverageDurationDaysMin: 10,
        coverageDurationDaysMax: 90,
        async getRiskBundles() {
            console.log("retrieving risk bundles from smart contract at " + depegProductContractAddress);
            const [ product, riskpool, riskpoolId, instanceService ] = await getInstanceFromProduct(depegProductContractAddress, signer);
            console.log(`riskpoolId: ${riskpoolId}, depegRiskpool: ${riskpool}`);
            return await getBundleData(instanceService, riskpoolId, riskpool);
        },
        async calculatePremium(walletAddress: string, insuredAmount: number, coverageDurationDays: number, bundles: Array<BundleData>): Promise<number> {
            if (signer instanceof VoidSigner) {
                console.log('no chain connection, no premium calculation');
                return Promise.resolve(0);
            }

            const durationSecs = coverageDurationDays * 24 * 60 * 60;
            console.log("calculatePremium", walletAddress, insuredAmount, coverageDurationDays);
            const product = DepegProduct__factory.connect(depegProductContractAddress, signer);
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

            if (! await hasBalance(walletAddress, premium, await product.getToken(), signer)) {
                throw new BalanceTooSmallError();
            }

            return Promise.resolve(premium);
        },
        async applyForPolicy(walletAddress, insuredAmount, coverageDurationDays, premium, beforeWaitCallback?) {
            console.log("applyForPolicy", walletAddress, insuredAmount, coverageDurationDays, premium);
            const [tx, receipt] = await applyForDepegPolicy(depegProductContractAddress, signer, insuredAmount, coverageDurationDays, premium, beforeWaitCallback);
            let processId = extractProcessIdFromApplicationLogs(receipt.logs);
            console.log(`processId: ${processId}`);
            return Promise.resolve(true);
        },
    } as ApplicationApi;
}

function investMock(enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey) {
    return {
        usd1: 'USDC',
        minInvestedAmount: 25000,
        maxInvestedAmount: 100000,
        minSumInsured: 1000,
        maxSumInsured: 25000,
        minCoverageDuration: 14,
        maxCoverageDuration: 90,
        annualPctReturn: 5,
        maxAnnualPctReturn: 20,
        async invest(
            investorWalletAddress: string, 
            investedAmount: number, 
            minSumInsured: number, 
            maxSumInsured: number, 
            minDuration: number, 
            maxDuration: number, 
            annualPctReturn: number
        ): Promise<boolean> {
            enqueueSnackbar(
                `Riskpool mocked ($investorWalletAddress, $investedAmount, $minSumInsured, $maxSumInsured, $minDuration, $maxDuration, $annualPctReturn)`,
                { autoHideDuration: 3000, variant: 'info' }
            );
            await delay(2000);
            return Promise.resolve(true);
        }
    };
};
