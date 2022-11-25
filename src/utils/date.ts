import { Moment } from "moment";

export function formatDate(moment: Moment): string {
    return moment.format('YYYY-MM-DD');
}