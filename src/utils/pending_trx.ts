import { Schema, Entity, Repository } from "redis-om";
import { redisOmClient } from "./redis";

export interface PendingTransaction {
    policyHolder: string;
    protectedWallet: string;
    protectedBalance: string;
    duration: number;
    bundleId: number;
    signatureId: string;
    signature: string;
    transactionHash: string;
    timestamp: Date;
}

export class PendingTransaction extends Entity {
}

export const PENDING_TRANSACTION_SCHEMA = new Schema(PendingTransaction, {
    policyHolder: { type: 'string', sortable: true },
    protectedWallet: { type: 'string' },
    protectedBalance: { type: 'string' },
    duration: { type: 'number' },
    bundleId: { type: 'number' },
    signatureId: { type: 'string' },
    signature: { type: 'string' },
    transactionHash: { type: 'string', sortable: true },
    timestamp: { type: 'date', sortable: true },
}, {
    dataStructure: 'HASH'
});

export async function getPendingTransactionRepository(): Promise<Repository<PendingTransaction>> {
    const priceRepository = (await redisOmClient).fetchRepository(PENDING_TRANSACTION_SCHEMA);
    await priceRepository.createIndex();
    return priceRepository;
}
