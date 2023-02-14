import { createMocks } from 'node-mocks-http';
import { BundleData } from '../../../src/backend/bundle_data';
import handler from '../../../src/pages/api/bundles/stakeable';
// import { getLastBlockTimestamp, getVoidSigner } from "../../../src/utils/chain";

jest.mock('../../../src/utils/chain', () => ({
    ...(jest.requireActual('../../../src/utils/chain')),
    getVoidSigner: jest.fn(),
    getLastBlockTimestamp: jest.fn().mockImplementation(() => 100),
}));

let bundles = [] as Array<BundleData>;

jest.mock('../../../src/utils/redis', () => ({
    ...(jest.requireActual('../../../src/utils/redis')),
    redisClient: {
        get: jest.fn().mockImplementation(() => JSON.stringify(bundles)),
    },
}));


describe('/api/bundles/stakeable', () => {
    test('returns all stakable bundles', async () => {

        bundles = [ 
            { // stakeable
                id: 1,
                createdAt: 200,
                lifetime: "100",
                capacity: "10000",
                minSumInsured: "1000",
            } as BundleData,
            { // expired
                id: 2,
                createdAt: 0,
                lifetime: "10",
                capacity: "10000",
                minSumInsured: "1000",
            } as BundleData,
            { // no capacity
                id: 3,
                createdAt: 200,
                lifetime: "100",
                capacity: "0",
                minSumInsured: "1000",
            } as BundleData,
            { // minSumInsured greater than capacity
                id: 4,
                createdAt: 200,
                lifetime: "100",
                capacity: "1000",
                minSumInsured: "10000",
            } as BundleData,
            { // locked capital greater than capital support
                id: 5,
                createdAt: 200,
                lifetime: "100",
                capacity: "10000",
                minSumInsured: "1000",
                capitalSupport: "2000",
                locked: "2200",
            } as BundleData,
            { // remaining capacity less than minSumInsured
                id: 6,
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
});