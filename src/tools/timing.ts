export function sleep(ms = 0): Promise<void> {
  return new Promise((r): void => {
    setTimeout(r, ms);
  });
}

export function getFormattedDate(date: Date): string {
  if (typeof date === "string") {
    date = new Date(date);
  }
  const days: string = date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString();
  const months: string = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();

  return days + "." + months + "." + date.getFullYear().toString();
}

export function getFormattedDateTime(dateTime: Date): string {
  if (typeof dateTime === "string") {
    dateTime = new Date(dateTime);
  }
  const hours: string = dateTime.getHours() < 10 ? "0" + dateTime.getHours().toString() : dateTime.getHours().toString();
  const minutes: string = dateTime.getMinutes() < 10 ? "0" + dateTime.getMinutes().toString() : dateTime.getMinutes().toString();

  return getFormattedDate(dateTime) + " " + hours + ":" + minutes;
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
