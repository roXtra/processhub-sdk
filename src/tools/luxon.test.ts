import { expect } from "chai";
import { DateTime } from "luxon";
import { Language, supportedLanguages, tl } from "../tl.js";
import { luxonDueDate, luxonRelativePast } from "./luxon.js";

describe("sdk", function () {
  describe("tools", function () {
    describe("luxon", function () {
      describe("luxonRelativePast", function () {
        it("should return now for 30 secs ago", () => {
          const now: Date = new Date();
          const thirtySecsAgo = new Date(now.getTime() - 30 * 1000);
          expect(luxonRelativePast(thirtySecsAgo, "de-DE", now)).to.equal(tl("jetzt", "de-DE", "processes"));
        });

        it("should return now for tomorrow", () => {
          const now: Date = new Date();
          const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          expect(luxonRelativePast(tomorrow, "de-DE", now)).to.equal(tl("jetzt", "de-DE", "processes"));
        });

        it("should not return now for 90 secs ago", () => {
          const now: Date = new Date();
          const ninetySecsAgo = new Date(now.getTime() - 90 * 1000);
          expect(luxonRelativePast(ninetySecsAgo, "de-DE", now)).not.to.equal(tl("jetzt", "de-DE", "processes"));
        });

        it("should translate 2 minutes ago to all supported languages", () => {
          const now: Date = new Date();
          const twoMinutesAgo = new Date(now.getTime() - 120 * 1000);

          // Translations
          /* eslint-disable @typescript-eslint/naming-convention */
          const localeTranslation: { [locale in Language]: string } = {
            "de-DE": "vor 2 Minuten",
            "en-US": "2 minutes ago",
            "zh-CN": "2分钟前",
            "zh-HK": "2 分鐘前",
            "it-IT": "2 minuti fa",
            "es-ES": "hace 2 minutos",
            "fr-FR": "il y a 2 minutes",
            "tr-TR": "2 dakika önce",
            "nl-NL": "2 minuten geleden",
            "hu-HU": "2 perccel ezelőtt",
            "cs-CZ": "před 2 minutami",
            "pt-PT": "há 2 minutos",
            "pt-BR": "há 2 minutos",
            "hr-HR": "prije 2 minute",
            "pl-PL": "2 minuty temu",
            "ru-RU": "2 минуты назад",
            "sr-Latn": "pre 2 minuta",
            "vi-VN": "2 phút trước",
            "ko-KR": "2분 전",
            "ja-JP": "2 分前",
            "ro-RO": "acum 2 minute",
            "da-DK": "for 2 minutter siden",
            "sk-SK": "pred 2 minútami",
            "sl-SI": "pred 2 minutama",
          };
          /* eslint-enable @typescript-eslint/naming-convention */

          expect(Object.keys(localeTranslation)).to.have.lengthOf(supportedLanguages.length);

          for (const locale of supportedLanguages) {
            expect(luxonRelativePast(twoMinutesAgo, locale, now)).to.equal(localeTranslation[locale]);
          }
        });

        it("should test all relativ units", () => {
          const now: Date = new Date("2021-12-23");

          const twoMinutesAgo = new Date(now.getTime() - 120 * 1000);
          expect(luxonRelativePast(twoMinutesAgo, "en-US", now)).to.be.equal("2 minutes ago");

          const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
          expect(luxonRelativePast(oneHourAgo, "en-US", now)).to.be.equal("1 hour ago");

          const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          expect(luxonRelativePast(yesterday, "en-US", now)).to.be.equal("yesterday");

          const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
          expect(luxonRelativePast(twoDaysAgo, "en-US", now)).to.be.equal("2 days ago");

          const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          expect(luxonRelativePast(lastWeek, "en-US", now)).to.be.equal("last week");

          const twoWeeksAgo = new Date(now.getTime() - 2 * 7 * 24 * 60 * 60 * 1000);
          expect(luxonRelativePast(twoWeeksAgo, "en-US", now)).to.be.equal("2 weeks ago");

          const lastMonth = new Date(now.getTime() - 4 * 7 * 24 * 60 * 60 * 1000);
          expect(luxonRelativePast(lastMonth, "en-US", now)).to.be.equal("last month");

          const twoMonthAgo = new Date(now.getTime() - 2 * 4 * 7 * 24 * 60 * 60 * 1000);
          expect(luxonRelativePast(twoMonthAgo, "en-US", now)).to.be.equal("2 months ago");

          const lastYear = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          expect(luxonRelativePast(lastYear, "en-US", now)).to.be.equal("last year");

          const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
          expect(luxonRelativePast(twoYearsAgo, "en-US", now)).to.be.equal("2 years ago");
        });
      });

      describe("luxonDueDate", function () {
        it("should return today", () => {
          const now: Date = new Date("2021-12-23");
          expect(luxonDueDate(now, "de-DE", now)).to.equal(tl("heute", "de-DE", "processes"));

          const startOfToday = DateTime.fromJSDate(now).startOf("day").toJSDate();
          expect(luxonDueDate(startOfToday, "de-DE", now)).to.equal(tl("heute", "de-DE", "processes"));

          const endOfToday = DateTime.fromJSDate(now).endOf("day").toJSDate();
          expect(luxonDueDate(endOfToday, "de-DE", now)).to.equal(tl("heute", "de-DE", "processes"));
        });

        it("should translate in 2 days to all supported languages", () => {
          const now: Date = new Date();
          const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
          expect(luxonDueDate(inTwoDays, "de-DE", now)).not.to.equal(tl("heute", "de-DE", "processes"));

          // Translations
          /* eslint-disable @typescript-eslint/naming-convention */
          const localeTranslation: { [locale in Language]: string } = {
            "de-DE": "übermorgen",
            "en-US": "in 2 days",
            "zh-CN": "后天",
            "zh-HK": "後日",
            "it-IT": "dopodomani",
            "es-ES": "pasado mañana",
            "fr-FR": "après-demain",
            "tr-TR": "öbür gün",
            "nl-NL": "overmorgen",
            "hu-HU": "holnapután",
            "cs-CZ": "pozítří",
            "pt-PT": "depois de amanhã",
            "pt-BR": "depois de amanhã",
            "hr-HR": "prekosutra",
            "pl-PL": "pojutrze",
            "ru-RU": "послезавтра",
            "sr-Latn": "prekosutra",
            "vi-VN": "Ngày kia",
            "ko-KR": "모레",
            "ja-JP": "明後日",
            "ro-RO": "poimâine",
            "da-DK": "i overmorgen",
            "sk-SK": "pozajtra",
            "sl-SI": "pojutrišnjem",
          };
          /* eslint-enable @typescript-eslint/naming-convention */

          expect(Object.keys(localeTranslation)).to.have.lengthOf(supportedLanguages.length);

          for (const locale of supportedLanguages) {
            expect(luxonDueDate(inTwoDays, locale, now)).to.equal(localeTranslation[locale]);
          }
        });

        it("should test all relativ units", () => {
          const now: Date = new Date("2021-12-23");

          const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
          expect(luxonDueDate(twoYearsAgo, "en-US", now)).to.be.equal("2 years ago");

          const lastYear = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          expect(luxonDueDate(lastYear, "en-US", now)).to.be.equal("last year");

          const twoMonthAgo = new Date(now.getTime() - 2 * 4 * 7 * 24 * 60 * 60 * 1000);
          expect(luxonDueDate(twoMonthAgo, "en-US", now)).to.be.equal("2 months ago");

          const lastMonth = new Date(now.getTime() - 4 * 7 * 24 * 60 * 60 * 1000);
          expect(luxonDueDate(lastMonth, "en-US", now)).to.be.equal("last month");

          const twoWeeksAgo = new Date(now.getTime() - 2 * 7 * 24 * 60 * 60 * 1000);
          expect(luxonDueDate(twoWeeksAgo, "en-US", now)).to.be.equal("2 weeks ago");

          const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          expect(luxonDueDate(lastWeek, "en-US", now)).to.be.equal("last week");

          const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
          expect(luxonDueDate(twoDaysAgo, "en-US", now)).to.be.equal("2 days ago");

          const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          expect(luxonDueDate(yesterday, "en-US", now)).to.be.equal("yesterday");

          const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          expect(luxonDueDate(tomorrow, "en-US", now)).to.be.equal("tomorrow");

          const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
          expect(luxonDueDate(inTwoDays, "en-US", now)).to.be.equal("in 2 days");

          const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          expect(luxonDueDate(nextWeek, "en-US", now)).to.be.equal("next week");

          const inTwoWeeks = new Date(now.getTime() + 2 * 7 * 24 * 60 * 60 * 1000);
          expect(luxonDueDate(inTwoWeeks, "en-US", now)).to.be.equal("in 2 weeks");

          const nextMonth = new Date(now.getTime() + 4 * 7 * 24 * 60 * 60 * 1000);
          expect(luxonDueDate(nextMonth, "en-US", now)).to.be.equal("next month");

          const inTwoMonths = new Date(now.getTime() + 2 * 4 * 7 * 24 * 60 * 60 * 1000);
          expect(luxonDueDate(inTwoMonths, "en-US", now)).to.be.equal("in 2 months");

          const nextYear = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
          expect(luxonDueDate(nextYear, "en-US", now)).to.be.equal("next year");

          const inTwoYears = new Date(now.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
          expect(luxonDueDate(inTwoYears, "en-US", now)).to.be.equal("in 2 years");
        });
      });
    });
  });
});
