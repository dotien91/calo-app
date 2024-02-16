import { translations } from "@localization";

export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatLanguage = (countryId: string) => {
  switch (countryId) {
    case "en":
      return translations.vi;
    case "vi":
      return translations.en;
    default:
      return "";
  }
};
