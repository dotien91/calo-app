import { translations } from "@localization";
import { daysOfWeek } from "constants/course.constant";
import lodash from "lodash";

export const countNumberFilter = (params) => {
  let numberFilters = 0;
  let countedPrice = false;
  Object.keys(params).map((v) => {
    const item = params[v];
    console.log("itemmmmm", item);
    if (Array.isArray(item)) {
      numberFilters += item.length;
    }
    if (v == "onlyEnglishNativeSpeakers" && !!item) {
      numberFilters += 1;
    }
    if (v == "max_price" && Number(item) < 1e9 && !countedPrice) {
      countedPrice = true;
      numberFilters += 1;
    }
    if (v == "min_price" && Number(item) > 0 && !countedPrice) {
      countedPrice = true;
      numberFilters += 1;
    }
  });

  return numberFilters;
};

export const getLabelHourLesson = (data) => {
  let hasMorningLabel = false;
  let hasAfternoonLabel = false;
  let hasNightLabel = false;

  return data.map((item) => {
    const label = item?.label || " ";
    const endTime = Number(label.slice(label.length - 5, label.length - 3));
    if (endTime <= 12 && !hasMorningLabel) {
      hasMorningLabel = true;
      return {
        ...item,
        extraLabel: translations.purchase.morning,
      };
    }

    if (endTime > 12 && endTime <= 18 && !hasAfternoonLabel) {
      hasAfternoonLabel = true;

      return {
        ...item,
        extraLabel: translations.purchase.Afternoon,
      };
    }
    if (endTime > 19 && !hasNightLabel) {
      hasNightLabel = true;

      return {
        is_picked: true,
        ...item,
        extraLabel: translations.purchase.Night,
      };
    }
    return item;
  });
};

export const getDaysFromTimepick = (timePick) => {
  timePick = lodash.uniqBy(timePick, "day");
  let days = "";
  console.log("object");
  timePick.map((item) => {
    const day = daysOfWeek.find((_item) => _item.value == item.day)?.label;
    days += (days ? ", " : "") + day;
  });
  return days;
};

export const HHMMtoNumber = (v: string) => {
  return Number(v.slice(0, v.length - 3));
};

export const getTimeFromTimepick = (timePick, isClassRoom = false) => {
  let learningTime = "";
  if (isClassRoom) {
    timePick.course_calendars.forEach((element) => {
      learningTime +=
        element.time_start +
        " - " +
        HHMMtoNumber(element.time_start) +
        1 +
        ":00";
    });
    return;
  }

  console.log("timePicktimePick", timePick);
  return "  ";
  learningTime =
    timePick[0].time_start +
    " - " +
    timePick[0].time_end +
    (timePick.length > 1
      ? "; " + timePick[1].time_start + " - " + timePick[1].time_end
      : "");
  return learningTime;
};
