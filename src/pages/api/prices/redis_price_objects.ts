import { Schema } from "redis-om";

export interface Price {
    roundId: string;
    aggregatorRoundId: number;
    phaseId: number;
    price: number;
    timestamp: Date;
}

export const PRICE_SCHEMA = new Schema('Price', {
    roundId: { type: 'string', sortable: true },
    aggregatorRoundId: { type: 'number', sortable: true },
    phaseId: { type: 'number', sortable: true },
    price: { type: 'number' },
    timestamp: { type: 'date', sortable: true },
}, {
    dataStructure: 'HASH'
});
