export class NoBundleFoundError extends Error {
    constructor() {
        super("No matching bundle found");
    }
}

export class BalanceTooSmallError extends Error {
    constructor() {
        super("Wallet balance too low");
    }
}