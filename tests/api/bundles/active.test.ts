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
                capacity: "10000",
                minSumInsured: "1000",
            } as BundleData,
            { // expired
                id: 2,
                state: 0,
                createdAt: 0,
                lifetime: "10",
                capacity: "10000",
                minSumInsured: "1000",
            } as BundleData,
            { // no capacity
                id: 3,
                state: 0,
                createdAt: 200,
                lifetime: "100",
                capacity: "0",
                minSumInsured: "1000",
            } as BundleData,
            { // minSumInsured greater than capacity
                id: 4,
                state: 0,
                createdAt: 200,
                lifetime: "100",
                capacity: "1000",
                minSumInsured: "10000",
            } as BundleData,
            { // locked capital greater than capital support
                id: 5,
                state: 0,
                createdAt: 200,
                lifetime: "100",
                capacity: "10000",
                minSumInsured: "1000",
                capitalSupport: "2000",
                locked: "2200",
            } as BundleData,
            { // remaining capacity less than minSumInsured
                id: 6,
                state: 0,
                createdAt: 200,
                lifetime: "100",
                capacity: "10000",
                minSumInsured: "1000",
                capitalSupport: "10000",
                locked: "9100",
            } as BundleData,
            { // state locked
                id: 6,
                state: 1,
                createdAt: 200,
                lifetime: "100",
                capacity: "10000",
                minSumInsured: "1000",
                capitalSupport: "10000",
                locked: "9100",
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
                minSumInsured: '1000000000',
                maxSumInsured: '2000000000',
                minDuration: 1209600,
                maxDuration: 7776000,
                balance: '10004109000',
                capital: '10000000000',
                locked: '1000000000',
                capitalSupport: '2000000000',
                capacity: '9000000000',
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