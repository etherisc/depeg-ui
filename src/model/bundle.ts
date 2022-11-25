export enum PolicyStatus {
    ACTIVE,
    CLOSED,
    BURNED
    // TODO: more states
}

export interface BundleRowView {
    id: string;
    capital: string;
    created: string;
    policies: string;
    state: string;
}
