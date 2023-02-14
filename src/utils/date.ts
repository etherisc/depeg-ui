import moment from "moment";

export function formatDateUtc(timestamp: number): string {
    return moment.unix(timestamp).utc().format('YYYY-MM-DD');
}

export function formatDateTimeUtc(timestamp: number): string {
    return moment.unix(timestamp).utc().format('YYYY-MM-DD HH:mm UTC');
}

export function formatDateLocal(timestamp: number): string {
    return moment.unix(timestamp).format('YYYY-MM-DD [Local]');
}

export function formatDateTimeLocal(timestamp: number): string {
    return moment.unix(timestamp).format('YYYY-MM-DD HH:mm [Local]');
}