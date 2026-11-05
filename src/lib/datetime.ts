/** Cape Verde is fixed at UTC-1 (no DST). All slot/appointment times are shown in it. */
export const CV_TIMEZONE = "Atlantic/Cape_Verde";
const CV_OFFSET_MS = 60 * 60 * 1000;

/** `YYYY-MM-DD` key of a moment, as seen in Cape Verde. */
export function cvDateKey(date: Date = new Date()): string {
  return new Date(date.getTime() - CV_OFFSET_MS).toISOString().slice(0, 10);
}

export function addDaysToKey(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** `count` consecutive date keys starting today (Cape Verde time). */
export function upcomingDateKeys(count: number): string[] {
  const today = cvDateKey();
  return Array.from({ length: count }, (_, i) => addDaysToKey(today, i));
}

const timeFmt = new Intl.DateTimeFormat("pt-PT", {
  timeZone: CV_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** ISO instant → "09:30" in Cape Verde time. */
export const formatTime = (iso: string) => timeFmt.format(new Date(iso));

function keyToDate(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

const utc = { timeZone: "UTC" } as const;

export const formatWeekdayShort = (key: string) =>
  new Intl.DateTimeFormat("pt-PT", { ...utc, weekday: "short" }).format(keyToDate(key)).replace(".", "");

export const formatDayNumber = (key: string) => String(Number(key.slice(8, 10)));

export const formatMonthShort = (key: string) =>
  new Intl.DateTimeFormat("pt-PT", { ...utc, month: "short" }).format(keyToDate(key)).replace(".", "");

/** "quinta-feira, 12 de novembro" for a date key. */
export const formatKeyLong = (key: string) =>
  new Intl.DateTimeFormat("pt-PT", { ...utc, weekday: "long", day: "numeric", month: "long" }).format(keyToDate(key));

/** "quinta-feira, 12 de novembro" for an ISO instant, in Cape Verde time. */
export const formatInstantLong = (iso: string) =>
  new Intl.DateTimeFormat("pt-PT", { timeZone: CV_TIMEZONE, weekday: "long", day: "numeric", month: "long" }).format(
    new Date(iso),
  );
