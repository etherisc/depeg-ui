import { Signer, VoidSigner } from "ethers";
import moment from "moment";
import { SnackbarMessage, OptionsObject, SnackbarKey } from "notistack";
import { DepegProduct__factory } from "../../contracts/depeg-contracts";
import { InsuranceApi } from "../../model/insurance_api";
import { PolicyRowView, PolicyStatus } from "../../model/policy";
import { delay } from "../../utils/delay";
import { NoBundleFoundError } from "../../utils/error";
import { getDepegRiskpool, getInstanceService } from "./gif_registry";
import { getBestQuote, getBundleData } from "./riskbundle";
import { BundleData } from "./bundle_data";
import { createApprovalForTreasury } from "./treasury";
import { applyForDepegPolicy, extractProcessIdFromApplicationLogs } from "./depeg_product";

export function insuranceApiSmartContract(
        signer: Signer,
        contractAddress: string,  // TODO: rename to depegProductContractAddress
        enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey,
        ): InsuranceApi {
    return {
        usd1: 'USDC',
        usd2: 'USDT',
        insuredAmountMin: 1000,
        insuredAmountMax: 20000,
        coverageDurationDaysMin: 10,
        coverageDurationDaysMax: 90,
        async getRiskBundles() {
            console.log("retrieving risk bundles from smart contract at " + contractAddress);
            const product = DepegProduct__factory.connect(contractAddress, signer);
            const riskpoolId = (await product.getRiskpoolId()).toNumber();
            const registryAddress = await product.getRegistry();
            const instanceService = await getInstanceService(registryAddress, signer);
            const depegRiskpool = await getDepegRiskpool(instanceService, riskpoolId);
            console.log(`riskpoolId: ${riskpoolId}, depegRiskpool: ${depegRiskpool}`);
            return await getBundleData(instanceService, riskpoolId, depegRiskpool);
        },
        async calculatePremium(walletAddress: string, insuredAmount: number, coverageDurationDays: number, bundles: Array<BundleData>): Promise<number> {
            if (signer instanceof VoidSigner) {
                console.log('no chain connection, no premium calculation');
                return Promise.resolve(0);
            }

            const durationSecs = coverageDurationDays * 24 * 60 * 60;
            console.log("calculatePremium", walletAddress, insuredAmount, coverageDurationDays);
            const product = DepegProduct__factory.connect(contractAddress, signer);
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
            return Promise.resolve(premium);
        },
        async createApproval(walletAddress: string, premium: number, beforeWaitCallback?) {
            console.log("createApproval", walletAddress, premium);
            const product = DepegProduct__factory.connect(contractAddress, signer);
            const [tx, receipt] = await createApprovalForTreasury(await product.getToken(), signer, premium, await product.getRegistry(), beforeWaitCallback);
            console.log("tx", tx, "receipt", receipt);
            return Promise.resolve(true);
            
        },
        async applyForPolicy(walletAddress, insuredAmount, coverageDurationDays, premium, beforeWaitCallback?) {
            console.log("applyForPolicy", walletAddress, insuredAmount, coverageDurationDays, premium);
            const [tx, receipt] = await applyForDepegPolicy(contractAddress, signer, insuredAmount, coverageDurationDays, premium, beforeWaitCallback);
            let processId = extractProcessIdFromApplicationLogs(receipt.logs);
            console.log(`processId: ${processId}`);
            return Promise.resolve(true);
        },
        async policies(walletAddress: string, onlyActive: boolean): Promise<Array<PolicyRowView>> {
            if (onlyActive) {
                return Promise.resolve(mockPoliciesActive);
            }
            return Promise.resolve(mockPolicies);
        },
        invest: investMock(enqueueSnackbar)
    } as InsuranceApi;
}

const mockPoliciesActive = [
    {
        id: '0x54E190322453300229D2BE2A38450B8A8BD8CF66',
        walletAddress: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
        insuredAmount: 'USDC 4,000.00',
        // 25 nov 2022
        coverageUntil: moment().add(14, 'days').format('DD MMM YYYY'),
        status: PolicyStatus[PolicyStatus.ACTIVE]
    } as PolicyRowView,
    {
        id: '0x34e190322453300229d2be2a38450b8a8bd8cf66',
        walletAddress: '0xdCeC4C063Fef1074B0CD53022C3306A6FADb4729',
        insuredAmount: 'USDC 10,000.00',
        coverageUntil: moment().add(47, 'days').format('DD MMM YYYY'),
        status: PolicyStatus[PolicyStatus.APPLIED]
    } as PolicyRowView,
];

const mockPolicies = mockPoliciesActive.concat(
    {
        id: '0x23e190322453300229d2be2a38450b8a8bd8cf66',
        walletAddress: '0xFEeC4C063Fef1074B0CD53022C3306A6FADb4729',
        insuredAmount: 'USDT 17,000.00',
        coverageUntil: moment().add(-3, 'days').format('DD MMM YYYY'),
        status: PolicyStatus[PolicyStatus.EXPIRED]
    } as PolicyRowView,
    {
        id: '0xc23223453200229d2be2a38450b8a8bd8cf66',
        walletAddress: '0x821c4C063Fef1074B0CD53022C3306A6FADb4729',
        insuredAmount: 'USDN 7,352.00',
        coverageUntil: moment().add(-2, 'months').format('DD MMM YYYY'),
        status: PolicyStatus[PolicyStatus.PAYED_OUT]
    } as PolicyRowView,
);

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
