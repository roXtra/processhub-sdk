import { DateTime } from "luxon";
import { Language } from "../tl.js";

export function sleep(ms = 0): Promise<void> {
  return new Promise((r): void => {
    setTimeout(r, ms);
  });
}

export function getFormattedDate(date: Date | string, locale: Language): string {
  const luxonDate = typeof date === "string" ? DateTime.fromISO(date).setLocale(locale) : DateTime.fromJSDate(date).setLocale(locale);
  return luxonDate.toLocaleString(DateTime.DATE_SHORT);
}

export function getFormattedDateTime(dateTime: Date | string, locale: Language): string {
  const luxonDate = typeof dateTime === "string" ? DateTime.fromISO(dateTime).setLocale(locale) : DateTime.fromJSDate(dateTime).setLocale(locale);
  return luxonDate.toLocaleString(DateTime.DATETIME_SHORT);
}

export function getFormattedTimeZoneOffset(offset: number): string {
  const offsetHours: number = Math.floor(Math.abs(offset) / 60);
  const offsetMin: number = Math.abs(offset) % 60;
  let result = "GMT";
  if (offset <= 0) {
    result += "+";
  } else {
    result += "-";
  }
  if (offsetHours < 10) {
    result += "0";
  }
  result += offsetHours.toString() + ":";
  if (offsetMin < 10) {
    result += "0";
  }
  result += offsetMin.toString();
  return result;
}

export interface IDuration {
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
  weeks?: number;
  months?: number;
  years?: number;
}

export function durationToSeconds(duration: IDuration): number {
  const d: IDuration = {
    seconds: duration.seconds || 0,
    minutes: duration.minutes || 0,
    hours: duration.hours || 0,
    days: duration.days || 0,
    weeks: duration.weeks || 0,
    months: duration.months || 0,
    years: duration.years || 0,
  };
  return (
    (d.seconds ? d.seconds : 0) +
    (d.minutes ? d.minutes * 60 : 0) +
    (d.hours ? d.hours * 60 * 60 : 0) +
    (d.days ? d.days * 24 * 60 * 60 : 0) +
    (d.weeks ? d.weeks * 7 * 24 * 60 * 60 : 0) +
    (d.months ? d.months * 30 * 24 * 60 * 60 : 0) +
    (d.years ? d.years * 365 * 24 * 60 * 60 : 0)
  );
}
