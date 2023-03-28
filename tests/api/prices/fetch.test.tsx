import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { Repository } from 'redis-om';
import { AggregatorV3Interface } from '../../../src/contracts/chainlink-contracts';
import { fetchPrices, splitRoundId } from '../../../src/pages/api/prices/fetch';
import { Price } from '../../../src/pages/api/prices/redis_price_objects';

function calculateRoundIdWithPhaseId(phaseId: BigNumber, roundId: BigNumber): BigNumber {
    return phaseId.shl(64).add(roundId);
}

let initialAggregatorRoundId = 0;

const aggregatorMock = {
    latestRoundData: jest.fn().mockImplementation(() => {
        return {
            roundId: calculateRoundIdWithPhaseId(BigNumber.from(1), BigNumber.from(initialAggregatorRoundId)),
            answer: parseUnits('1', 8),
            startedAt: parseUnits('0', 0),
            updatedAt: parseUnits('107', 0),
            answeredInRound: parseUnits('0', 0),
        };
    }),
    getRoundData: jest.fn().mockImplementation((roundId: BigNumber) => {
        const { phaseId, aggregatorRoundId } = splitRoundId(roundId);
        if (aggregatorRoundId === 0) {
            return {
                roundId: parseUnits('0', 0),
                answer: parseUnits('0', 8),
                startedAt: parseUnits('0', 0),
                updatedAt: parseUnits('0', 0),
                answeredInRound: parseUnits('0', 0),
            };
        }
        return {
            roundId: calculateRoundIdWithPhaseId(BigNumber.from(1), BigNumber.from(aggregatorRoundId)),
            answer: parseUnits('1', 8),
            startedAt: parseUnits('0', 0),
            updatedAt: parseUnits((100 + aggregatorRoundId).toString(), 0),
            answeredInRound: parseUnits('0', 0),
        };
    }),

} as unknown as AggregatorV3Interface;

let savedPrices = [];

const priceRepositoryMock = {
    createAndSave: jest.fn().mockImplementation((price: Price) => {
        savedPrices.push(price);
    }),
} as unknown as Repository<Price>;

describe('/api/prices/fetch', () => {
    test('fetchs all prices during initial fetch', async () => {
        initialAggregatorRoundId = 7;
        savedPrices = [];

        const num = await fetchPrices(aggregatorMock, null, priceRepositoryMock);

        expect(num).toBe(7);
        expect(savedPrices.length).toBe(7);
    });

    test('fetchs all prices up to last fetch', async () => {
        initialAggregatorRoundId = 7;
        savedPrices = [];

        const lastFetchedPrice = {
            roundId: calculateRoundIdWithPhaseId(BigNumber.from(1), BigNumber.from(3)).toString(),
            aggregatorRoundId: 3,
            phaseId: 1,
            price: 1,
            timestamp: new Date(100 * 1000),
        } as Price;

        const num = await fetchPrices(aggregatorMock, lastFetchedPrice, priceRepositoryMock);

        expect(num).toBe(4);
        expect(savedPrices.length).toBe(4);
    });

    test('fetchs no prices if last round id is latest price', async () => {
        initialAggregatorRoundId = 7;
        savedPrices = [];

        const lastFetchedPrice = {
            roundId: calculateRoundIdWithPhaseId(BigNumber.from(1), BigNumber.from(7)).toString(),
            aggregatorRoundId: 7,
            phaseId: 1,
            price: 1,
            timestamp: new Date(100 * 1000),
        } as Price;

        const num = await fetchPrices(aggregatorMock, lastFetchedPrice, priceRepositoryMock);

        expect(num).toBe(0);
        expect(savedPrices.length).toBe(0);
    });

});