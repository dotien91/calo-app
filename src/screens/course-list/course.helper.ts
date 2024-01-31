import { translations } from "@localization";

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
    console.log("endTimeendTimeendTime", endTime);
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
