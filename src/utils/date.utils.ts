/**
 * Get first day of week
 * @param currentDate
 */

import dayjs from "dayjs";
import { translations } from "@localization";
import { SERVICE_UNIT } from "constants";
import "dayjs/locale/vi";

export function getFirstDayOfWeek(currentDate: Date): Date {
  const first = currentDate.getDate() - currentDate.getDay(); // First day is the day of the month - the day of the week
  return new Date(new Date().setMonth(currentDate.getMonth(), first));
}

/**
 * Get last day of week
 * @param currentDate
 */
export function getLastDayOfWeek(currentDate: Date): Date {
  const first = currentDate.getDate() - currentDate.getDay(); // First day is the day of the month - the day of the week
  const last = first + 6; // last day is the first day + 6

  return new Date(new Date().setDate(last));
}

/**
 * Calculate age from date
 * @param birthday
 */
export function calculateAge(birthday: Date) {
  // birthday is a date
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs); // milliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

/**
 * Convert second to mm:ss
 * @param second
 */
export function secondToMMSS(second: number): string {
  const minutes = Math.floor(second / 60);
  const seconds = second % 60;
  return (
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (seconds < 10 ? "0" + Math.round(seconds) : Math.round(seconds))
  );
}

/**
 * Jamviet.comm added: Check if date is valid or not and get valid date
 * @param date Anything
 * @returns boolean
 */
export function dateIsValid(date) {
  return date instanceof Date;
}
export function getValidDate(_date) {
  let date = new Date(_date);
  if (!dateIsValid(date) || _date === "") {
    date = new Date();
  }
  return date;
}

/**
 *  Find user's sign by birthday
 * Jamviet.com fixed: if date is null or undefined
 * @param date
 */
export function findSignByDate(_date: string): string {
  const date = getValidDate(_date);
  const days = [21, 20, 21, 21, 22, 22, 23, 24, 24, 24, 23, 22];
  const signs = [
    "Aquarius",
    "Pisces",
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Virgo",
    "Leo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
  ];
  let month = date.getMonth();
  const day = date.getDate();
  if (month === 0 && day <= 20) {
    month = 11;
  } else if (day < days[month]) {
    month--;
  }
  return signs[month];
}

/**
 * Convert value time to other time by unit time
 * Jamviet.com Fixed: add return string because of toFixed() function
 * @param preUnit
 * @param afterUnit
 * @param valueTime
 */
export function convertUnitTime(
  preUnit: SERVICE_UNIT,
  afterUnit: SERVICE_UNIT,
  valueTime: number,
): number | string {
  if (preUnit === afterUnit) return valueTime;

  //default unit is second
  let result: number = valueTime;

  switch (preUnit) {
    case SERVICE_UNIT.minute:
      result = valueTime * 60;
      break;
    case SERVICE_UNIT.hour:
      result = valueTime * 60 * 60;
      break;
    case SERVICE_UNIT.day:
      result = valueTime * 60 * 60 * 24;
      break;
  }

  switch (afterUnit) {
    case SERVICE_UNIT.minute:
      result = valueTime / 60;
      break;
    case SERVICE_UNIT.hour:
      result = valueTime / 60 / 60;
      break;
    case SERVICE_UNIT.day:
      result = valueTime / 60 / 60 / 24;
      break;
  }

  if (result % 1 === 0) {
    return result;
  } else {
    return result.toFixed(2);
  }
}

export function convertUnitTimeString(
  preUnit: SERVICE_UNIT,
  afterUnit: SERVICE_UNIT,
  valueTime: number,
): string {
  const result = convertUnitTime(preUnit, afterUnit, valueTime);
  return `${result} ${afterUnit}${result === 1 ? "" : "s"}`;
}

export function getFormatDayMessage(
  time: Date | string,
  sameDay = "HH:mm",
  sameYear = "HH:mm DD/MM",
  diffYear = "DD/MM/YYYY",
) {
  if (!time) {
    return "";
  }
  const IsSameDay = dayjs(new Date()).isSame(time, "day");
  const IsSameYear = dayjs(new Date()).isSame(time, "year");
  return IsSameDay
    ? dayjs(time).format(sameDay)
    : IsSameYear
    ? dayjs(time).format(sameYear)
    : dayjs(time).format(diffYear);
}

export function getFormatDayNotification(
  time: Date | string,
  sameDay = "HH:mm",
  diffYear = "DD/MM/YYYY",
) {
  if (!time) {
    return "";
  }
  const IsSameDay = dayjs(new Date()).isSame(time, "day");
  const IsSameYear = dayjs(new Date()).isSame(time, "year");
  return IsSameDay
    ? dayjs(time).format(sameDay)
    : IsSameYear
    ? dayjs(time).format("DD/MM") +
      ` ${translations.common.at} ` +
      dayjs(time).format("HH:mm")
    : dayjs(time).format(diffYear) +
      ` ${translations.common.at} ` +
      dayjs(time).format("HH:mm");
}

export function getDisplayDate(date: string) {
  const today = dayjs().startOf("day");
  const yesterday = dayjs(today).subtract(1, "day");
  const tomorrow = dayjs(today).add(1, "day");

  if (dayjs(date).isSame(dayjs(today), "day")) {
    return `${translations.today} ${dayjs(date).format("hh:mm A")}`;
  }

  if (dayjs(date).isSame(dayjs(yesterday), "day")) {
    return `${translations.yesterday} ${dayjs(date).format("hh:mm A")}`;
  }

  if (dayjs(date).isSame(dayjs(tomorrow), "day")) {
    return `${translations.tomorrow} ${dayjs(date).format("hh:mm A")}`;
  }

  return `${dayjs(date).locale("vi").format("DD/MM/YYYY hh:mm A")}`;
}

export const isBetweenDate = (
  date: string,
  startDate: string,
  endDate: string,
) => {
  const _date = new Date(date).getTime();
  const _startDate = new Date(startDate).getTime();
  const _endDate = new Date(endDate).getTime();
  return _date > _startDate && _date < _endDate;
};

export const formatDate = (date) => {
  const _date = new Date(date);
  if (_date.toString() === "Invalid Date") {
    return "";
  }
  const year = _date.getFullYear();
  const month = _date.getMonth() + 1;
  const day = _date.getDate();

  return `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;
};

export const formatFullDate = (date) => {
  const _date = new Date(date);
  if (_date.toString() === "Invalid Date") {
    return "";
  }
  const year = _date.getFullYear();
  const month = _date.getMonth() + 1;
  const day = _date.getDate();
  const hours = _date.getHours();
  const minutes = _date.getMinutes();

  return `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  } ${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }`;
};

export const formatVNDate = (date) => {
  const _date = new Date(date);
  if (_date.toString() === "Invalid Date") {
    return "";
  }

  const year = _date.getFullYear();
  const month = _date.getMonth() + 1;
  const day = _date.getDate();

  return `${day < 10 ? `0${day}` : day}/${
    month < 10 ? `0${month}` : month
  }/${year}`;
};
export const formatTimeHHMM = (date) => {
  const _date = new Date(date);
  if (_date.toString() === "Invalid Date") {
    return "";
  }

  const hourse = _date.getHours();
  const min = _date.getMinutes();

  if (min < 30) {
    return `${hourse < 10 ? `0${hourse}` : hourse}:00`;
  }

  if (min < 60) {
    return `${hourse < 10 ? `0${hourse}` : hourse}:30`;
  }

  return `${hourse < 10 ? `0${hourse}` : hourse}:${min < 10 ? `0${min}` : min}`;
};

export const getDayOfWeek = (day: number) => {
  switch (day) {
    case 0:
      return "Sun";
    case 1:
      return "Mon";
    case 2:
      return "Tue";
    case 3:
      return "Wed";
    case 4:
      return "Thu";
    case 5:
      return "Fri";
    case 6:
      return "Sat";

    default:
      return "";
  }
};

export const isSameMinute = (date1: string, date2: string) => {
  const _date1 = new Date(date1);
  const _date2 = new Date(date2);
  return (
    _date1.getMinutes() == _date2.getMinutes() &&
    _date1.getDate() == _date2.getDate() &&
    _date1.getMonth() == _date2.getMonth() &&
    _date1.getYear() == _date2.getYear()
  );
};
