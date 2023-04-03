import { ComponentState } from "../types/component_state";

export function mapComponentState(componentState: number): ComponentState {
    switch(componentState) {
        case 0:
            return ComponentState.Created;
        case 1:
            return ComponentState.Proposed;
        case 2:
            return ComponentState.Declined;
        case 3:
            return ComponentState.Active;
        case 4:
            return ComponentState.Paused;
        case 5:
            return ComponentState.Suspended;
        case 6:
            return ComponentState.Archived;
        default:
            throw new Error("Invalid component state");
    }
}
