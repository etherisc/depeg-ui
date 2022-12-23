import dayjs from "dayjs";

export function formatDateUtc(timestamp: dayjs.Dayjs): string {
    return timestamp.format('YYYY-MM-DD HH:mm UTC');
}