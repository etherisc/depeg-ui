import { event } from "nextjs-google-analytics";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const envId = process.env.NEXT_PUBLIC_GA_ENVIRONMENT_ID;

export function ga_event(eventName: string, options: any) {
    if ( gaMeasurementId === undefined) { 
        return;
    }
    if ( envId !== undefined && envId !== "") {
        options.environment = envId;
    }
    event(eventName, options);
}
