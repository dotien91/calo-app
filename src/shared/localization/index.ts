import LocalizedStrings from "react-native-localization";

import enTranslations from "./en.localization";
import viTranslations from "./vi.localization";
export const translations = new LocalizedStrings({
  en: enTranslations,
  // tr: trTranslations,
  vi: viTranslations,
});
