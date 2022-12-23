import dayjs from "dayjs";

export function formatDate(timestamp: dayjs.Dayjs): string {
    return timestamp.format('YYYY-MM-DD');
}