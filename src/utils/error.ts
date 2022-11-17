export class NoBundleFoundError extends Error {
    constructor() {
        super("No matching bundle found");
    }
}
