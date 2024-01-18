import { translations } from "@localization";
import dayjs from "dayjs";

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

export const convertLastActive = (time: string) => {
  const timeNumber = dayjs().diff(dayjs(time), "minutes");
  if (timeNumber === 0) {
    return translations.justNow;
  }
  const days = Math.floor(timeNumber / 1440);

  // Calculate the number of hours
  const hours = Math.floor((timeNumber % 1440) / 60);

  // Calculate the number of minutes
  const remainingMinutes = timeNumber % 60;

  if (days > 0) return `${days} ${translations.days}`;
  if (hours > 0) return `${hours} ${translations.hours}`;
  return `${remainingMinutes} ${translations.minutes}`;
};
