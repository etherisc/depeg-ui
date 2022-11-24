export enum PolicyStatus {
    ACTIVE,
    CLOSED,
    BURNED
    // TODO: more states
}

export interface BundleRowView {
    id: string;
    capital: string;
    policies: string;
    state: string;
}
