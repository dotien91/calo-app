import { translations } from "@localization";

export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatLanguage = (countryId: string) => {
  switch (countryId) {
    case "en":
      return translations.en;
    case "vi":
      return translations.vi;
    default:
      return "";
  }
};
