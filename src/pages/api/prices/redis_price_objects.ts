import { Schema, Entity } from "redis-om";

export interface Price {
    roundId: string;
    price: string;
    timestamp: Date;
}

export class Price extends Entity {
}

export const PRICE_SCHEMA = new Schema(Price, {
    roundId: { type: 'number', sortable: true },
    price: { type: 'number' },
    timestamp: { type: 'date', sortable: true },
}, {
    dataStructure: 'HASH'
});

    
