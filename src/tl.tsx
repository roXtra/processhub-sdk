import { ModuleId } from "./modules";

export interface ITLProps {
  text: string;
  language?: string;
  moduleId?: number;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function TL(props: ITLProps): JSX.Element {
  return <span>{tl(props.text, props.language, props.moduleId)}</span>;
}

const translations: { [language: string]: ITranslations | undefined } = {};

// Variante für Strings, die nicht im JSX eingefügt werden
export function tl(text: string, language?: string, moduleId?: number): string {
  if (language) {
    const translationsForLanguage = translations[language];
    if (translationsForLanguage) {
      const id = moduleId || ModuleId.None;
      const translationsForModule = translationsForLanguage.translations.find((t) => t.moduleIds.includes(id) && t.strings[text] != null);
      if (translationsForModule && translationsForModule.strings[text]) {
        return translationsForModule.strings[text];
      }
      const translationsForDefaultModule = translationsForLanguage.translations.find((t) => t.moduleIds.includes(ModuleId.None));
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
    moduleIds: number[];
    strings: { [source: string]: string };
  }[];
}
