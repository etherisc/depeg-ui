import { Signer, VoidSigner } from "ethers";
import moment from "moment";
import { SnackbarMessage, OptionsObject, SnackbarKey } from "notistack";
import { DepegProduct__factory } from "../../contracts/depeg-contracts";
import { IERC20__factory } from "../../contracts/gif-interface";
import { InsuranceApi } from "../../model/insurance_api";
import { PolicyRowView, PolicyStatus } from "../../model/policy";
import { delay } from "../../utils/delay";
import { NoBundleFoundError } from "../../utils/error";
import { getDepegRiskpool, getInstanceService } from "./gif_registry";
import { getBestQuote, getBundleData } from "./riskbundle";
import DepegProductBuild from '@etherisc/depeg-contracts/build/contracts/DepegProduct.json';
import { Coder } from "abi-coder";

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
        async calculatePremium(walletAddress: string, insuredAmount: number, coverageDurationDays: number): Promise<number> {
            if (signer instanceof VoidSigner) {
                console.log('no chain connection, no premium calculation');
                return Promise.resolve(0);
            }

            const durationSecs = coverageDurationDays * 24 * 60 * 60;
            console.log("calculatePremium", walletAddress, insuredAmount, coverageDurationDays);
            const product = DepegProduct__factory.connect(contractAddress, signer);
            const riskpoolId = (await product.getRiskpoolId()).toNumber();
            const registryAddress = await product.getRegistry();
            const instanceService = await getInstanceService(registryAddress, signer);
            const depegRiskpool = await getDepegRiskpool(instanceService, riskpoolId);
            // TODO: retrieve bundle data on component load and not for every form update
            const bundleData = await getBundleData(instanceService, riskpoolId, depegRiskpool);
            console.log("bundleData", bundleData);
            const bestBundle = getBestQuote(bundleData, insuredAmount, durationSecs);
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
        async createApproval(walletAddress: string, premium: number) {
            // enqueueSnackbar(`Approval mocked (${walletAddress}, ${premium}`,  { autoHideDuration: 3000, variant: 'info' });
            console.log("createApproval", walletAddress, premium);
            enqueueSnackbar(`Awaiting approval of ${premium} from ${walletAddress}`,  { autoHideDuration: 3000, variant: 'info' });
            const product = DepegProduct__factory.connect(contractAddress, signer);
            // TODO: move getting erc20 address to own method
            const usd1Addess = await product.getToken();
            console.log(`creating approval for usd1 ${usd1Addess} for ${premium}`);
            const usd1 = IERC20__factory.connect(usd1Addess, signer);
            const registryAddress = await product.getRegistry();
            const instanceService = await getInstanceService(registryAddress, signer);
            const treasury = await instanceService.getTreasuryAddress();
            console.log("treasury", treasury);
            const tx = await usd1.approve(treasury, premium);
            console.log("approval created");
            const receipt = await tx.wait();
            // TODO: handle error
            console.log("approval mined");
            return Promise.resolve(true);
            
        },
        async applyForPolicy(walletAddress, insuredAmount, coverageDurationDays, premium) {
            // enqueueSnackbar(`Policy mocked (${walletAddress}, ${insuredAmount}, ${coverageDurationDays})`,  { autoHideDuration: 3000, variant: 'info' });
            console.log("applyForPolicy", walletAddress, insuredAmount, coverageDurationDays, premium);
            enqueueSnackbar(`Awaiting payment ${premium}`,  { autoHideDuration: 3000, variant: 'info' });
            const product = DepegProduct__factory.connect(contractAddress, signer);
            const tx = await product.applyForPolicy(
                insuredAmount, 
                coverageDurationDays * 24 * 60 * 60,
                premium);
            const receipt = await tx.wait();
            console.log(receipt);
            
            const productAbiCoder = new Coder(DepegProductBuild.abi);
            let processId = '';
    
            receipt.logs.forEach(log => {
                try {
                    const evt = productAbiCoder.decodeEvent(log.topics, log.data);
                    console.log(evt);
                    if (evt.name === 'LogDepegPolicyCreated') {
                        console.log(evt);
                        // @ts-ignore
                        processId = evt.values.policyId.toString();
                    }
                } catch (e) {
                    console.log(e);
                }
            });
            // TODO: handle error
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
