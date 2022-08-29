import { assert, expect } from "chai";
import { Language, supportedLanguages } from "../tl";
import { sleep, getFormattedTimeZoneOffset, getFormattedDate, getFormattedDateTime } from "./timing";

describe("tools", function () {
  describe("timing", function () {
    describe("sleep", function () {
      it("should wait", async function () {
        const startat = new Date().getTime();
        await sleep(1200);
        const endat = new Date().getTime();
        assert.isAtLeast(endat - startat, 1000);
      });
    });

    describe("getFormattedDate", function () {
      it("should format date for all supported languages", () => {
        const now: Date = new Date();
        now.setFullYear(2021, 11, 27);
        now.setHours(12, 0, 0, 0);

        // Translations
        /* eslint-disable @typescript-eslint/naming-convention */
        const localeTranslation: { [locale in Language]: string } = {
          "de-DE": "27.12.2021",
          "en-US": "12/27/2021",
          "zh-CN": "2021/12/27",
          "zh-HK": "27/12/2021",
          "it-IT": "27/12/2021",
          "es-ES": "27/12/2021",
          "fr-FR": "27/12/2021",
          "tr-TR": "27.12.2021",
          "nl-NL": "27-12-2021",
          "hu-HU": "2021. 12. 27.",
          "cs-CZ": "27. 12. 2021",
          "pt-PT": "27/12/2021",
          "pt-BR": "27/12/2021",
          "hr-HR": "27. 12. 2021.",
          "pl-PL": "27.12.2021",
          "ru-RU": "27.12.2021",
          "sr-Latn": "27.12.2021.",
          "vi-VN": "27/12/2021",
          "ko-KR": "2021. 12. 27.",
          "ja-JP": "2021/12/27",
        };
        /* eslint-enable @typescript-eslint/naming-convention */

        expect(Object.keys(localeTranslation)).to.have.lengthOf(supportedLanguages.length);

        for (const locale of supportedLanguages) {
          expect(getFormattedDate(now, locale)).to.equal(localeTranslation[locale]);
        }
      });
    });

    describe("getFormattedDateTime", function () {
      it("should format date time for all supported languages", () => {
        const now: Date = new Date();
        now.setFullYear(2021, 11, 27);
        now.setHours(12, 0, 0, 0);

        // Translations
        /* eslint-disable @typescript-eslint/naming-convention */
        const localeTranslation: { [locale in Language]: string } = {
          "de-DE": "27.12.2021, 12:00",
          "en-US": "12/27/2021, 12:00 PM",
          "zh-CN": "2021/12/27 下午12:00",
          "zh-HK": "27/12/2021 下午12:00",
          "it-IT": "27/12/2021, 12:00",
          "es-ES": "27/12/2021 12:00",
          "fr-FR": "27/12/2021, 12:00",
          "tr-TR": "27.12.2021 12:00",
          "nl-NL": "27-12-2021 12:00",
          "hu-HU": "2021. 12. 27. 12:00",
          "cs-CZ": "27. 12. 2021 12:00",
          "pt-PT": "27/12/2021, 12:00",
          "pt-BR": "27/12/2021 12:00",
          "hr-HR": "27. 12. 2021. 12:00",
          "pl-PL": "27.12.2021, 12:00",
          "ru-RU": "27.12.2021, 12:00",
          "sr-Latn": "27.12.2021. 12:00",
          "vi-VN": "12:00, 27/12/2021",
          "ko-KR": "2021. 12. 27. 오후 12:00",
          "ja-JP": "2021/12/27 12:00",
        };

        /* eslint-enable @typescript-eslint/naming-convention */

        expect(Object.keys(localeTranslation)).to.have.lengthOf(supportedLanguages.length);

        for (const locale of supportedLanguages) {
          // Skip zh-CN, es-ES and fr-FR due to ubuntu Update, should be removed in the future
          if (["zh-CN", "es-ES", "fr-FR"].includes(locale)) continue;
          expect(getFormattedDateTime(now, locale), "Unexpected getFormattedDateTime output for " + locale).to.equal(localeTranslation[locale]);
        }
      });
    });

    describe("getFormattedTimeZoneOffset", function () {
      it("GMT+0100", () => {
        expect(getFormattedTimeZoneOffset(-60)).to.equal("GMT+01:00");
      });

      it("GMT+0530 (India)", () => {
        expect(getFormattedTimeZoneOffset(-330)).to.equal("GMT+05:30");
      });

      it("GMT-0130", () => {
        expect(getFormattedTimeZoneOffset(90)).to.equal("GMT-01:30");
      });

      it("GMT+0000", () => {
        expect(getFormattedTimeZoneOffset(0)).to.equal("GMT+00:00");
      });
    });
  });
});
