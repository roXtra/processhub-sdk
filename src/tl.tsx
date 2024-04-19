import { ModuleName } from "./modules/imodule.js";

export const supportedLanguages = [
  "de-DE",
  "en-US",
  "zh-CN",
  "zh-HK",
  "it-IT",
  "es-ES",
  "fr-FR",
  "tr-TR",
  "nl-NL",
  "hu-HU",
  "cs-CZ",
  "pt-PT",
  "pt-BR",
  "hr-HR",
  "pl-PL",
  "ru-RU",
  "sr-Latn",
  "vi-VN",
  "ko-KR",
  "ja-JP",
  "ro-RO",
] as const;

export type Language = (typeof supportedLanguages)[number];

const translations: { [language: string]: ITranslations | undefined } = {};

// Variante für Strings, die nicht im JSX eingefügt werden
export function tl(text: string, language: string, moduleName?: ModuleName): string {
  if (language) {
    const translationsForLanguage = translations[language];
    if (translationsForLanguage) {
      const name = moduleName || "processes";
      const translationsForModule = translationsForLanguage.translations.find((t) => t.moduleNames.includes(name) && t.strings[text] != null);
      if (translationsForModule && translationsForModule.strings[text]) {
        return translationsForModule.strings[text];
      }
      const translationsForDefaultModule = translationsForLanguage.translations.find((t) => t.moduleNames.includes("processes"));
      if (translationsForDefaultModule && translationsForDefaultModule.strings[text]) {
        return translationsForDefaultModule.strings[text];
      }
    }
  }
  return text;
}

export function registerTranslations(newTranslations: ITranslations): void {
  translations[newTranslations.language] = newTranslations;
}

/**
 * Translation string pairs
 */
export type TranslationStrings = {
  [source: string]: string;
};

export interface ITranslations {
  language: string;
  translations: {
    // Possible values are eg "processes", "risks", "audit", "action"
    moduleNames: ModuleName[];
    strings: TranslationStrings;
  }[];
}
