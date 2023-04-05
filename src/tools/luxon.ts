import { DateTime, Duration, Interval, ToRelativeUnit } from "luxon";
import { tl } from "../tl";
import { Language } from "../tl";

function getRelativUnit(diff: number): ToRelativeUnit {
  const duration = Duration.fromMillis(diff).shiftTo("minutes", "hours", "days", "weeks", "months", "years");
  const { minutes, hours, days, weeks, months, years } = duration;

  if (years + months + weeks + days + hours + minutes === 0) return "seconds";

  if (years + months + weeks + days + hours === 0) return "minutes";

  if (years + months + weeks + days === 0) return "hours";

  if (years + months + weeks === 0) return "days";

  if (years + months === 0) return "weeks";

  if (years === 0) return "months";

  return "years";
}

export function luxonRelativePast(dateInThePast: Date | string, locale: Language, now = new Date()): string {
  const luxonNow = DateTime.fromJSDate(now).setLocale(locale);
  const luxonDate = typeof dateInThePast === "string" ? DateTime.fromISO(dateInThePast).setLocale(locale) : DateTime.fromJSDate(dateInThePast).setLocale(locale);

  const diff = luxonNow.diff(luxonDate).toMillis();
  if (diff < 60 * 1000) {
    return tl("jetzt", locale, "processes");
  }

  const unit: ToRelativeUnit = getRelativUnit(diff);

  return luxonDate.toRelativeCalendar({ base: luxonNow, unit }) || "";
}

export function luxonDueDate(dateInTheFuture: Date | string, locale: Language, now = new Date()): string {
  const luxonNow = DateTime.fromJSDate(now).setLocale(locale);
  const luxonDate = typeof dateInTheFuture === "string" ? DateTime.fromISO(dateInTheFuture).setLocale(locale) : DateTime.fromJSDate(dateInTheFuture).setLocale(locale);

  if (isToday(luxonDate, luxonNow)) {
    return tl("heute", locale, "processes");
  }

  const diff = Math.abs(luxonNow.diff(luxonDate).toMillis());
  const unit: ToRelativeUnit = getRelativUnit(diff);

  return luxonDate.toRelativeCalendar({ base: luxonNow, unit }) || "";
}

//#region Utility functions for luxon DateTime
export function isInTheFuture(date: DateTime, today: DateTime): boolean {
  return date > today;
}

export function isInThePast(date: DateTime, today: DateTime): boolean {
  return date < today;
}

export function isToday(date: DateTime, today: DateTime): boolean {
  const todayInterval = Interval.fromDateTimes(today.startOf("day"), today.endOf("day"));
  return todayInterval.contains(date) || (todayInterval.start != null && todayInterval.start.equals(date)) || (todayInterval.end != null && todayInterval.end.equals(date));
}

export function isInTheNthWeek(date: DateTime, today: DateTime, n: number): boolean {
  const nthWeek = today.plus({ week: n });

  const weekIntervall = Interval.fromDateTimes(nthWeek.startOf("week"), nthWeek.endOf("week"));

  return weekIntervall.contains(date) || (weekIntervall.start != null && weekIntervall.start.equals(date)) || (weekIntervall.end != null && weekIntervall.end.equals(date));
}

export function isInTheNextWeek(date: DateTime, today: DateTime): boolean {
  return isInTheNthWeek(date, today, 1);
}

export function isInTheSameWeek(date: DateTime, today: DateTime): boolean {
  return isInTheNthWeek(date, today, 0);
}

export function isInTheLastWeek(date: DateTime, today: DateTime): boolean {
  return isInTheNthWeek(date, today, -1);
}

export function isInTheWeekBeforeLast(date: DateTime, today: DateTime): boolean {
  return isInTheNthWeek(date, today, -2);
}
//#endregion
