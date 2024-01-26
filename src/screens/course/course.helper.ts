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
