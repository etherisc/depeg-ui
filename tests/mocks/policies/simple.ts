import dayjs from "dayjs";
import { BigNumber } from "ethers";
import { ClaimState, PolicyData } from "../../../src/backend/policy_data";

export function mockPoliciesSimple() {

    return [
        {
            id: '0x54E190322453300229D2BE2A38450B8A8BD8CF61',
            policyHolder: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
            protectedWallet: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
            applicationState: 2,
            policyState: 0,
            createdAt: dayjs().add(-2, 'days').unix(),
            duration: 14 * 24 * 60 * 60,
            premium: BigNumber.from(17).toString(),
            suminsured: BigNumber.from(10000).toString()
        } as PolicyData,
        {
            id: '0x54E190322453300229D2BE2A38450B8A8BD8CF62',
            policyHolder: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
            protectedWallet: '0xA3C552FA4756dd343394785283923bE2f27f8814',
            applicationState: 2,
            policyState: 0,
            payoutState: 0,
            createdAt: dayjs().add(-2, 'days').unix(),
            duration: 14 * 24 * 60 * 60,
            premium: BigNumber.from(17).toString(),
            suminsured: BigNumber.from(11000000000).toString()
        } as PolicyData,
        {
            id: '0x54E190322453300229D2BE2A38450B8A8BD8CF63',
            policyHolder: '0xA3C552FA4756dd343394785283923bE2f27f8814',
            protectedWallet: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
            applicationState: 2,
            policyState: 0,
            createdAt: dayjs().add(-2, 'days').unix(),
            duration: 14 * 24 * 60 * 60,
            premium: BigNumber.from(17).toString(),
            suminsured: BigNumber.from(10000).toString()
        } as PolicyData,
    ];
}

export function mockPoliciesSimpleWithClaim() {

    return [
        {
            id: '0x54E190322453300229D2BE2A38450B8A8BD8CF61',
            policyHolder: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
            protectedWallet: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
            applicationState: 2,
            policyState: 0,
            createdAt: dayjs().add(-2, 'days').unix(),
            duration: 14 * 24 * 60 * 60,
            premium: BigNumber.from(17).toString(),
            suminsured: BigNumber.from(10000).toString()
        } as PolicyData,
        {
            id: '0x54E190322453300229D2BE2A38450B8A8BD8CF62',
            policyHolder: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
            protectedWallet: '0xA3C552FA4756dd343394785283923bE2f27f8814',
            applicationState: 2,
            policyState: 0,
            payoutState: 0,
            createdAt: dayjs().add(-2, 'days').unix(),
            duration: 14 * 24 * 60 * 60,
            premium: BigNumber.from(17).toString(),
            suminsured: BigNumber.from(11000000000).toString()
        } as PolicyData,
        {
            id: '0xccE190322453300229D2BE2A38450B8A8BD8CF63',
            policyHolder: '0xA3C552FA4756dd343394785283923bE2f27f8814',
            protectedWallet: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
            applicationState: 2,
            policyState: 0,
            createdAt: dayjs().add(-2, 'days').unix(),
            duration: 14 * 24 * 60 * 60,
            premium: BigNumber.from(17).toString(),
            suminsured: BigNumber.from(10000).toString(),
            isAllowedToClaim: true,
        } as PolicyData,
        {
            id: '0xccE190322453300229D2BE2A38450B8A8BD8CF64',
            policyHolder: '0xA3C552FA4756dd343394785283923bE2f27f8814',
            protectedWallet: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
            applicationState: 2,
            policyState: 1,
            payoutState: 0,
            createdAt: dayjs().add(-2, 'days').unix(),
            duration: 15 * 24 * 60 * 60,
            premium: BigNumber.from(17).toString(),
            suminsured: BigNumber.from(10000000000).toString(),
            isAllowedToClaim: false,
            claim: {
                state: ClaimState.APPLIED,
                claimAmount: BigNumber.from(10000000000).toString(),
                actualAmount: BigNumber.from(5000000000).toString(),
                claimCreatedAt: dayjs().add(-1, 'days').unix(),
            }
        } as PolicyData,
    ];
}