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

export class ApprovalFailedError extends Error {
    code;
    reason;
    
    constructor(code: string, cause: any) {
        super(`Approval failed with code '${code}' and cause ${cause}`);
        this.code = code;
        this.reason = cause;
    }
}