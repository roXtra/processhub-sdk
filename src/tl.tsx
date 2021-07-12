import { ModuleName } from "./modules";

export interface ITLProps {
  text: string;
  language?: string;
  moduleName?: ModuleName;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function TL(props: ITLProps): JSX.Element {
  return <span>{tl(props.text, props.language, props.moduleName)}</span>;
}

const translations: { [language: string]: ITranslations | undefined } = {};

// Variante für Strings, die nicht im JSX eingefügt werden
export function tl(text: string, language?: string, moduleName?: ModuleName): string {
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

export interface ITranslations {
  language: string;
  translations: {
    // Possible values are eg "processes", "risks", "audit", "action"
    moduleNames: ModuleName[];
    strings: { [source: string]: string };
  }[];
}
