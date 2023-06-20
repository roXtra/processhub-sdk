import * as chai from "chai";
import { expect } from "chai";
import chaiExclude from "chai-exclude";
import { createId } from "./guid";
import * as StringTools from "./stringtools";
import { NestedElements, Group, Rule } from "./stringtools";

chai.use(chaiExclude);

describe("sdk", function () {
  describe("tools", function () {
    describe("stringtools", function () {
      describe("isValidMailAddress", function () {
        it("soll gültige Mailadressen akzeptieren", function () {
          chai.assert.isTrue(StringTools.isValidMailAddress("tr@processhub-nomail.com"));
        });
        it("soll ungültige Adressen ablehnen", function () {
          chai.assert.isFalse(StringTools.isValidMailAddress("tr@test"));
          chai.assert.isFalse(StringTools.isValidMailAddress(""));
          chai.assert.isFalse(StringTools.isValidMailAddress(null));
        });
      });

      describe("toCleanUrl", function () {
        it("soll Text url-tauglich formatieren", function () {
          chai.assert.equal(StringTools.toCleanUrl("Mein schöner Titel"), "mein-schoener-titel");

          // Ungültige Zeichen entfernen
          chai.assert.equal(StringTools.toCleanUrl("Ö/\\<>:+.?=&%_#| -ab"), "oe-ab");

          // Checks if numbers are not replaced
          chai.assert.equal(StringTools.toCleanUrl("ab123-cd456"), "ab123-cd456");
        });

        it("soll Unicode Characters korrekt behandeln", function () {
          chai.assert.equal(StringTools.toCleanUrl("위키백과:대문"), "위키백과-대문");
          chai.assert.equal(StringTools.toCleanUrl("としょかん"), "としょかん");
          chai.assert.equal(StringTools.toCleanUrl("كيبورد عربي"), "كيبورد-عربي");
        });
      });

      describe("replaceOldFieldSyntax", function () {
        it("soll alte Syntax austauschen", function () {
          const testValue = "(({{ field.Feld_1 }} == 1) && ({{ role.Bearbeiter }} == 'Administrator, Admin')) || role['Pruefer'].displayName && role['Ersteller'].firstname";
          const expectedValue = "((field['Feld_1'] == 1) && (role['Bearbeiter'] == 'Administrator, Admin')) || role['Pruefer'].displayName && role['Ersteller'].firstname";

          const res = StringTools.replaceOldFieldSyntax(testValue);

          chai.expect(res).to.be.equal(expectedValue, testValue + " == " + expectedValue);
        });
      });

      describe("Querybuilder", function () {
        const editTestParameters: { query: string; expectedGroup: Group; guid: string }[] = [
          {
            guid: "300b7a35-5441-48cd-9b62-02e8d5d7c356",
            query: "",
            expectedGroup: {
              rules: [],
              combinator: "&&",
              id: createId(),
            } as Group,
          },
          {
            guid: "b0e8c905-7f79-4a38-ae46-b9ccf6262106",
            query: "()",
            expectedGroup: {
              rules: [],
              combinator: "&&",
              id: createId(),
            } as Group,
          },
          {
            guid: "d5b3362e-83de-450f-8519-043ed7b8566f",
            query: "(())",
            expectedGroup: {
              rules: [
                {
                  rules: [],
                  combinator: "&&",
                  id: createId(),
                } as Group,
              ],
              combinator: "&&",
              id: createId(),
            } as Group,
          },
          {
            guid: "556712e5-d2e2-4d4e-ab92-1b01aa92d3a8",
            query: "(field['Zahl'] > 5)",
            expectedGroup: {
              rules: [
                {
                  field: "field['Zahl']",
                  operator: ">",
                  value: 5,
                } as Rule,
              ],
              combinator: "&&",
            } as Group,
          },
          {
            guid: "f175b832-4497-4e19-abe9-dade9e8c2688",
            query: `(field['Checklist'] == {"Option {&2}":true})`,
            expectedGroup: {
              rules: [
                {
                  field: "field['Checklist']",
                  operator: "==",
                  value: { "Option {&2}": true },
                  id: createId(),
                } as Rule,
              ],
              combinator: "&&",
            } as Group,
          },
          {
            guid: "e65c5a52-6922-4753-bfee-86a48f084f64",
            query: "(field['A&B'] != '[X|Y]')",
            expectedGroup: {
              rules: [
                {
                  field: "field['A&B']",
                  operator: "!=",
                  value: "[X|Y]",
                } as Rule,
              ],
              combinator: "&&",
            } as Group,
          },
          {
            guid: "148cd88f-b218-49bc-ba52-b6209a470bda",
            query: "(field['Date'] == undefined)",
            expectedGroup: {
              rules: [
                {
                  field: "field['Date']",
                  operator: "==",
                  value: undefined,
                } as Rule,
              ],
              combinator: "&&",
            } as Group,
          },
          {
            guid: "6a9041ad-a1b6-4cfa-9c35-336e00d9abb9",
            query: "(field['Gewährung eines Übernachtungszuschusses (Höchstbetrag 80 €; Höhere Erstattung nur in begründeten Ausnahmefällen möglich) in Höhe von'] == '')",
            expectedGroup: {
              rules: [
                {
                  field: "field['Gewährung eines Übernachtungszuschusses (Höchstbetrag 80 €; Höhere Erstattung nur in begründeten Ausnahmefällen möglich) in Höhe von']",
                  operator: "==",
                  value: "",
                } as Rule,
              ],
              combinator: "&&",
            } as Group,
          },
          {
            guid: "7abebd2c-c13c-4d84-b942-aeb3f819fdde",
            query: "(role['Mitarbeiter'].lastName == 'Mustermann' && role['GF/KB/PL'].firstName == 'Max')",
            expectedGroup: {
              rules: [
                {
                  field: "role['Mitarbeiter'].lastName",
                  operator: "==",
                  value: "Mustermann",
                } as Rule,
                {
                  field: "role['GF/KB/PL'].firstName",
                  operator: "==",
                  value: "Max",
                } as Rule,
              ],
              combinator: "&&",
            } as Group,
          },
          {
            guid: "67fbd46f-a7eb-418e-b5f5-e4fa156cf7f2",
            query: "(field['Check'] == {\"A\":true,\"B\":true} || field['DATUM'] >= '2019-08-14T22:00:00.000Z')",
            expectedGroup: {
              rules: [
                {
                  field: "field['Check']",
                  operator: "==",
                  value: { A: true, B: true },
                  id: createId(),
                } as Rule,
                {
                  field: "field['DATUM']",
                  operator: ">=",
                  value: "2019-08-14T22:00:00.000Z",
                } as Rule,
              ],
              combinator: "||",
            } as Group,
          },
          {
            guid: "28bddb73-54ff-42a9-8e9f-e74dc2bc4e3a",
            query:
              "(role['Abteilungsleitung'] == 'ABC' && field['Dienstbezeichnung'] == 'xyz' && (field['Art der Veranstaltung'] != 'gfdg dfg' || field['Entstehen Teilnehmergebühren?'] == 'nein'))",
            expectedGroup: {
              rules: [
                {
                  field: "role['Abteilungsleitung']",
                  operator: "==",
                  value: "ABC",
                } as Rule,
                {
                  field: "field['Dienstbezeichnung']",
                  operator: "==",
                  value: "xyz",
                } as Rule,
                {
                  rules: [
                    {
                      field: "field['Art der Veranstaltung']",
                      operator: "!=",
                      value: "gfdg dfg",
                    } as Rule,
                    {
                      field: "field['Entstehen Teilnehmergebühren?']",
                      operator: "==",
                      value: "nein",
                    } as Rule,
                  ],
                  combinator: "||",
                } as Group,
              ],
              combinator: "&&",
            } as Group,
          },
          {
            guid: "812fb4b1-3344-4107-9f43-cc3a42c6ba93",
            query: "((field['Name, Vorname'] == '' && field['Name, Vorname'] == '') && (field['Name, Vorname'] == '' && field['Name, Vorname'] == ''))",
            expectedGroup: {
              rules: [
                {
                  rules: [
                    {
                      field: "field['Name, Vorname']",
                      operator: "==",
                      value: "",
                      id: createId(),
                    } as Rule,
                    {
                      field: "field['Name, Vorname']",
                      operator: "==",
                      value: "",
                      id: createId(),
                    } as Rule,
                  ],
                  combinator: "&&",
                  id: createId(),
                } as Group,
                {
                  rules: [
                    {
                      field: "field['Name, Vorname']",
                      operator: "==",
                      value: "",
                      id: createId(),
                    } as Rule,
                    {
                      field: "field['Name, Vorname']",
                      operator: "==",
                      value: "",
                      id: createId(),
                    } as Rule,
                  ],
                  combinator: "&&",
                  id: createId(),
                } as Group,
              ],
              combinator: "&&",
              id: createId(),
            } as Group,
          },
          {
            guid: "961bd296-f5aa-4e16-bb54-239a7855606d",
            query: "(riskMetric['Erstbewertung'] > 50)",
            expectedGroup: {
              rules: [
                {
                  field: "riskMetric['Erstbewertung']",
                  operator: ">",
                  value: 50,
                } as Rule,
              ],
              combinator: "&&",
            } as Group,
          },
          {
            guid: "4cd99817-069e-49b8-a693-d8fc5bca9532",
            query: "(riskMetric['Erstbewertung'] > 50 || riskMetric['Zweitbewertung'] >= 20)",
            expectedGroup: {
              rules: [
                {
                  field: "riskMetric['Erstbewertung']",
                  operator: ">",
                  value: 50,
                  id: createId(),
                } as Rule,
                {
                  field: "riskMetric['Zweitbewertung']",
                  operator: ">=",
                  value: 20,
                } as Rule,
              ],
              combinator: "||",
            } as Group,
          },
        ];

        editTestParameters.forEach((p) => {
          it("soll verschachtelte Klammern finden und auflösen, und soll Gruppen und Regeln aus einer Bedingung auslesen und korrekt verarbeiten_" + p.guid, function () {
            const res: NestedElements = StringTools.getNestedElements(p.query);
            const res2 = StringTools.parseNestedElementsToGroupConstruct(res);

            chai.expect(res2).excludingEvery(["id", "isTopGroup"]).to.deep.equal(p.expectedGroup);
          });
        });

        const editTestParameters2: { expectedQuery?: string; group: Group; guid: string }[] = [
          {
            guid: "43c28ab1-0fc4-437f-a27b-63afddb4b850",
            expectedQuery: undefined,
            group: {
              rules: [],
              combinator: "&&",
              id: createId(),
            } as Group,
          },
          {
            guid: "25c23455-0952-4dc5-b28f-fce55d8c37c8",
            expectedQuery: "(())",
            group: {
              rules: [
                {
                  rules: [],
                  combinator: "&&",
                  id: createId(),
                } as Group,
              ],
              combinator: "&&",
              id: createId(),
            },
          },
          {
            guid: "6e0f41c2-8eb2-4219-81a4-576350814e37",
            expectedQuery: "(field['Zahl'] > 5)",
            group: {
              rules: [
                {
                  field: "field['Zahl']",
                  operator: ">",
                  value: 5,
                } as Rule,
              ],
              combinator: "&&",
            } as Group,
          },
          {
            guid: "8e5f09b2-65d3-4ebd-ae50-f1e4c7aafd61",
            expectedQuery: "(field['A&B'] != '[X|Y]')",
            group: {
              rules: [
                {
                  field: "field['A&B']",
                  operator: "!=",
                  value: "[X|Y]",
                } as Rule,
              ],
              combinator: "&&",
            } as Group,
          },
          {
            guid: "a7dd944f-21a7-4589-8cf0-0dcb96b15dbd",
            expectedQuery: "(field['Date'] == undefined)",
            group: {
              rules: [
                {
                  field: "field['Date']",
                  operator: "==",
                  value: undefined,
                } as Rule,
              ],
              combinator: "&&",
            } as Group,
          },
          {
            guid: "ff3e08f9-a3fb-4ad3-bbfd-1e107a4b7990",
            expectedQuery:
              "(field['Gewährung eines Übernachtungszuschusses (Höchstbetrag 80 €; Höhere Erstattung nur in begründeten Ausnahmefällen möglich) in Höhe von'] == '')",
            group: {
              rules: [
                {
                  field: "field['Gewährung eines Übernachtungszuschusses (Höchstbetrag 80 €; Höhere Erstattung nur in begründeten Ausnahmefällen möglich) in Höhe von']",
                  operator: "==",
                  value: "",
                } as Rule,
              ],
              combinator: "&&",
            } as Group,
          },
          {
            guid: "4bf3f6a5-ba6f-4ff7-98be-c8c278f43444",
            expectedQuery: "(role['Mitarbeiter'].lastName == 'Mustermann' && role['GF/KB/PL'].firstName == 'Max')",
            group: {
              rules: [
                {
                  field: "role['Mitarbeiter'].lastName",
                  operator: "==",
                  value: "Mustermann",
                } as Rule,
                {
                  field: "role['GF/KB/PL'].firstName",
                  operator: "==",
                  value: "Max",
                } as Rule,
              ],
              combinator: "&&",
            } as Group,
          },
          {
            guid: "551cb95f-2264-4bba-b7f1-50d36ef6826f",
            expectedQuery: "(field['Check'] == {\"A\":true,\"B\":true} || field['DATUM'] >= '2019-08-14T22:00:00.000Z')",
            group: {
              rules: [
                {
                  field: "field['Check']",
                  operator: "==",
                  value: { A: true, B: true },
                  id: createId(),
                } as Rule,
                {
                  field: "field['DATUM']",
                  operator: ">=",
                  value: "2019-08-14T22:00:00.000Z",
                  id: createId(),
                } as Rule,
              ],
              combinator: "||",
            } as Group,
          },
          {
            guid: "d9238b9f-047f-4144-b1a3-b5cbdadfe09b",
            expectedQuery:
              "(role['Abteilungsleitung'] == 'ABC' && field['Dienstbezeichnung'] == 'xyz' && (field['Art der Veranstaltung'] != 'gfdg dfg' || field['Entstehen Teilnehmergebühren?'] == 'nein'))",
            group: {
              rules: [
                {
                  field: "role['Abteilungsleitung']",
                  operator: "==",
                  value: "ABC",
                } as Rule,
                {
                  field: "field['Dienstbezeichnung']",
                  operator: "==",
                  value: "xyz",
                } as Rule,
                {
                  rules: [
                    {
                      field: "field['Art der Veranstaltung']",
                      operator: "!=",
                      value: "gfdg dfg",
                    } as Rule,
                    {
                      field: "field['Entstehen Teilnehmergebühren?']",
                      operator: "==",
                      value: "nein",
                    } as Rule,
                  ],
                  combinator: "||",
                } as Group,
              ],
              combinator: "&&",
            } as Group,
          },
          {
            guid: "aea74e8f-6f99-4fc2-926b-2ed396d60e82",
            expectedQuery: "(riskMetric['Erstbewertung'] > 100)",
            group: {
              rules: [
                {
                  field: "riskMetric['Erstbewertung']",
                  operator: ">",
                  value: 100,
                } as Rule,
              ],
              combinator: "&&",
            } as Group,
          },
          {
            guid: "efd7067f-d92b-4268-b0b7-afc2d6dfc3b7",
            expectedQuery: "(riskMetric['Erstbewertung'] > 100 || riskMetric['Zweitbewertung'] >= 50)",
            group: {
              rules: [
                {
                  field: "riskMetric['Erstbewertung']",
                  operator: ">",
                  value: 100,
                  id: createId(),
                } as Rule,
                {
                  field: "riskMetric['Zweitbewertung']",
                  operator: ">=",
                  value: 50,
                  id: createId(),
                } as Rule,
              ],
              combinator: "||",
            } as Group,
          },
        ];

        editTestParameters2.forEach((p) => {
          it("should parse Group to valid string expression_" + p.guid, function () {
            chai.expect(StringTools.getQueryFromGroup(p.group)).to.be.equal(p.expectedQuery);
          });
        });
      });

      describe("URLSafeBase64", function () {
        it("should encode and decode correctly URLSafeBase64", function () {
          // Encode "test", actual base64 "dGVzdA==", expected "dGVzdA"
          let encoded = StringTools.encodeURLSafeBase64("test");
          expect(encoded).to.equal("dGVzdA");
          let decoded = StringTools.decodeURLSafeBase64(encoded);
          expect(decoded).to.equal("test");

          // Encode "test2", actual base64 "dGVzdDI=", expected "dGVzdDI"
          encoded = StringTools.encodeURLSafeBase64("test2");
          expect(encoded).to.equal("dGVzdDI");
          decoded = StringTools.decodeURLSafeBase64(encoded);
          expect(decoded).to.equal("test2");

          // Encode "<=>Hello?", actual base64 "PD0+SGVsbG8/", expected "PD0-SGVsbG8_"
          encoded = StringTools.encodeURLSafeBase64("<=>Hello?");
          expect(encoded).to.equal("PD0-SGVsbG8_");
          decoded = StringTools.decodeURLSafeBase64(encoded);
          expect(decoded).to.equal("<=>Hello?");

          // Encode "öäüÄÖ!§$%&()=Ü=Hello.txt", actual base64 "w7bDpMO8w4TDliHCpyQlJigpPcOcPUhlbGxvLnR4dA==", expected "w7bDpMO8w4TDliHCpyQlJigpPcOcPUhlbGxvLnR4dA"
          encoded = StringTools.encodeURLSafeBase64("öäüÄÖ!§$%&()=Ü=Hello.txt");
          expect(encoded).to.equal("w7bDpMO8w4TDliHCpyQlJigpPcOcPUhlbGxvLnR4dA");
          decoded = StringTools.decodeURLSafeBase64(encoded);
          expect(decoded).to.equal("öäüÄÖ!§$%&()=Ü=Hello.txt");
        });

        it("should throw an error due to invalid base64", function () {
          const notValid = "This is not a valid base64!";
          expect(() => StringTools.decodeURLSafeBase64(notValid)).to.throw(Error, `Invalid character: the string to be decoded is not correctly encoded.`);
        });
      });
    });
  });
});
