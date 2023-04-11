import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { createMocks } from 'node-mocks-http';
import { BundleData } from '../../../src/backend/bundle_data';
import handler from '../../../src/pages/api/bundles/active';

jest.mock('../../../src/utils/chain', () => ({
    ...(jest.requireActual('../../../src/utils/chain')),
    getVoidSigner: jest.fn(),
    getBackendVoidSigner: jest.fn(),
    getLastBlockTimestamp: jest.fn().mockImplementation(() => 100),
}));

let bundles = [] as Array<BundleData>;

// fake redis client
jest.mock('redis', () => ({
    createClient: jest.fn().mockImplementation(() => {
        return {
            on: jest.fn(),
            connect: jest.fn(),
        };
    }),
}));

jest.mock('../../../src/utils/redis', () => ({
    ...(jest.requireActual('../../../src/utils/redis')),
    redisClient: {
        get: jest.fn().mockImplementation(() => JSON.stringify(bundles)),
    },
}));


describe('/api/bundles/active', () => {
    test('returns all active bundles', async () => {

        bundles = [ 
            { // active
                id: 1,
                state: 0,
                createdAt: 200,
                lifetime: "100",
                capacity: parseUnits("10000",6).toString(),
                minProtectedAmount: parseUnits("1000", 6).toString(),
            } as BundleData,
            { // expired
                id: 2,
                state: 0,
                createdAt: 0,
                lifetime: "10",
                capacity: parseUnits("10000", 6).toString(),
                minProtectedAmount: parseUnits("1000", 6).toString()
            } as BundleData,
            { // no capacity
                id: 3,
                state: 0,
                createdAt: 200,
                lifetime: "100",
                capacity: parseUnits("0", 6).toString(),
                minProtectedAmount: parseUnits("1000", 6).toString(),
            } as BundleData,
            { // minSumInsured greater than capacity
                id: 4,
                state: 0,
                createdAt: 200,
                lifetime: "100",
                capacity: parseUnits("1000", 6).toString(),
                minProtectedAmount: parseUnits("10000", 6).toString(),
            } as BundleData,
            { // supported capacity remaining equals 0
                id: 5,
                state: 0,
                createdAt: 200,
                lifetime: "100",
                capacity: parseUnits("10000", 6).toString(),
                minProtectedAmount: parseUnits("1000", 6).toString(),
                capitalSupport: parseUnits("2000", 6).toString(),
                supportedCapacity: parseUnits("20000", 6).toString(),
                supportedCapacityRemaining: parseUnits('0', 6).toString(),
                locked: parseUnits("2200", 6).toString(),
            } as BundleData,
            { // supported capacity remaining less than 0
                id: 8,
                state: 0,
                createdAt: 200,
                lifetime: "100",
                capacity: parseUnits("10000", 6).toString(),
                minProtectedAmount: parseUnits("1000", 6).toString(),
                capitalSupport: parseUnits("2000", 6).toString(),
                supportedCapacity: parseUnits("20000", 6).toString(),
                supportedCapacityRemaining: parseUnits('-1000', 6).toString(),
                locked: parseUnits("2200", 6).toString(),
            } as BundleData,
            { // remaining capacity less than minSumInsured
                id: 6,
                state: 0,
                createdAt: 200,
                lifetime: "100",
                capacity: parseUnits("10000", 6).toString(),
                minProtectedAmount: parseUnits("1000", 6).toString(),
                capitalSupport: parseUnits("1000", 6).toString(),
                supportedCapacity: parseUnits("10000", 6).toString(),
                supportedCapacityRemaining: parseUnits('900', 6).toString(),
                locked: parseUnits('9100', 6).toString(),
            } as BundleData,
            { // state locked
                id: 7,
                state: 1,
                createdAt: 200,
                lifetime: "100",
                capacity: parseUnits("10000", 6).toString(),
                minProtectedAmount: parseUnits("1000", 6).toString(),
                capitalSupport: parseUnits("10000", 6).toString(),
                locked: parseUnits("9100", 6).toString(),
            } as BundleData,
        ];

        const { req, res } = createMocks({
            method: 'GET',
            query: {
                animal: 'dog',
            },
            });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        
        const result = JSON.parse(res._getData()) as Array<BundleData>;

        expect(result.length).toBe(1);
        expect(result[0].id).toBe(1);
    });

    test('returns bundle as active when effective remaining amount equals min sum insured', async () => {

        bundles = [ 
            { // effective remaining amount equals min sum insured
                id: 4,
                riskpoolId: 1,
                owner: '0x2CeC4C063Fef1074B0CD53022C3306A6FADb4729',
                apr: 5,
                minProtectedAmount: BigNumber.from('1000000000').toString(),
                maxProtectedAmount: BigNumber.from('2000000000').toString(),
                minDuration: 1209600,
                maxDuration: 7776000,
                balance: BigNumber.from('10004109000').toString(),
                capital: BigNumber.from('10000000000').toString(),
                locked: BigNumber.from('1000000000').toString(),
                capitalSupport: BigNumber.from('200000000').toString(),
                supportedCapacity: BigNumber.from('2000000000').toString(),
                supportedCapacityRemaining: BigNumber.from('1000000000').toString(),
                capacity: BigNumber.from('9000000000').toString(),
                policies: 1,
                state: 0,
                tokenId: 4,
                createdAt: 1679329540,
                name: 'bundle-4',
                lifetime: '7776000'
            } as BundleData,
        ];

        const { req, res } = createMocks({
            method: 'GET',
            query: {
                animal: 'dog',
            },
            });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        
        const result = JSON.parse(res._getData()) as Array<BundleData>;

        expect(result.length).toBe(1);
        expect(result[0].id).toBe(4);
    });
});