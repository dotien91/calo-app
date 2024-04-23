import LocalizedStrings from "react-native-localization";

import enTranslations from "./en.localization";
import viTranslations from "./vi.localization";
import jpTranslations from "./jp.localization";

export const translations = new LocalizedStrings({
  en: enTranslations,
  // tr: trTranslations,
  vi: viTranslations,
  jp: jpTranslations,
});
