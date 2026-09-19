# Kendo-Aktualisierung: SDK-Prüfung vom 17.09.2026

## Ergebnis und Umfang

Im `processhub-sdk` sind weder direkte noch transitive `@progress/kendo-*`-Pakete
oder `kendo-ui-core` installiert. Geprüft wurden alle mit Git erfassten
Paketmanifeste und Lockdateien sowie `renovate.config.js` und
`.github/renovate.json`, ausgehend von `origin/master` bei `fb527de0`.

Die einzige Renovate-Regel für Progress fasst Aktualisierungen zusammen. Sie
enthält weder eine Versionsbeschränkung noch eine Deaktivierung. Es gibt hier
deshalb keine Kendo-Pins, Overrides oder Renovate-Sperren zu entfernen.
`package.json`, `package-lock.json` und die Renovate-Konfiguration bleiben
unverändert. Ein SDK-Release oder eine Änderung seiner öffentlichen API ist für
die Kendo-Aktualisierung nicht erforderlich.

`src/modules/imodule.ts` verwendet den lokalen Typ `KendoSeriesType` für
Diagrammkonfigurationen. Der Typ importiert kein Kendo-Paket; die Darstellung
dieser Konfigurationen muss im aktualisierten ProcessHub geprüft werden.

## Behobene Hindernisse bei der Testausführung

Die bestehende Datei `src/tools/fetchwithtimeout.test.ts` enthielt `it.only` und
eine Ausnahme von der zugehörigen ESLint-Regel. Dadurch wurde bei einem regulären
Testlauf nur ein Test gegen die öffentliche roXtra-Webseite ausgeführt; die
übrige SDK-Testsuite lief nicht.

Die Einschränkung und die ESLint-Ausnahme wurden entfernt. Erfolgreiche Antworten,
Verbindungsabbrüche und Timeouts werden jetzt mit einem lokalen HTTP-Server auf
einem vom Betriebssystem vergebenen Port geprüft. Die Tests benötigen weder
Internet noch einen laufenden ProcessHub-Server. Der Fehlerfall prüft den
konkreten Verbindungsfehler und kann nicht mehr durch das Abfangen seiner eigenen
fehlgeschlagenen Assertion erfolgreich werden.

Die dadurch wieder aktivierte Testsuite zeigte außerdem einen bestehenden
Datumsformat-Testfehler für `zh-HK`: Node.js 24 verwendet an einer Stelle ein
Unicode Thin Space statt eines normalen Leerzeichens. Der Test normalisiert nur
typografische Leerzeichen vor dem Vergleich. Datumswerte, Reihenfolge und
Interpunktion bleiben Gegenstand der Assertion; das produktive Datumsformat
wurde nicht verändert.

## Durchgeführte Prüfungen

Umgebung: Windows, Node.js `24.19.0`, npm `12.0.2`, isolierter Git-Worktree.
Vorhandene, nicht zu dieser Aufgabe gehörende BPMN-Änderungen im ursprünglichen
SDK-Arbeitsverzeichnis wurden weder verändert noch in den Branch übernommen.

| Prüfung | Ergebnis |
| --- | --- |
| `npm ci --no-audit --no-fund` | Erfolgreich; unveränderte Lockdatei |
| `npm run check:format` | Erfolgreich |
| `npm run lint` | Erfolgreich; bestehende Warnungen, keine Fehler |
| `npm run build` | Erfolgreich; JavaScript und Deklarationen erzeugt |
| `npm run testcoverage` | 162 Tests erfolgreich, keine fehlgeschlagenen Tests |
| Git-Inventur aller Manifeste/Locks und Renovate-Dateien | Keine Kendo-Abhängigkeit oder Kendo-Versionssperre |

Es verbleiben keine Build- oder Testfehler. Einschränkung der Messung: Der
bestehende NYC-Lauf meldet trotz der 162 ausgeführten Tests für dieses ESM-Projekt
0 % Coverage. Dieses Ergebnis belegt keine Codeabdeckung. Die bestehende
Konfiguration deaktiviert `check-coverage`; eine separate Umstellung der
Coverage-Instrumentierung wurde im Rahmen dieser Kendo-Prüfung nicht vorgenommen.
Die erfolgreichen Assertions und die Zahl ausgeführter Tests sind davon getrennt
zu bewerten.

Für eine Wiederholung Node.js 24 und npm 11 oder 12 verwenden:

```sh
npm ci
npm run check:format
npm test
```

Der abschließende Testbericht muss 162 erfolgreiche Tests enthalten. Ein Lauf mit
nur einem erfolgreichen Test prüft nicht diese korrigierte Branch-Version.

## Manuelle Integrationsprüfung

Diese Prüfung erfolgt in einer ProcessHub-Testumgebung mit den aktualisierten
Kendo-Paketen; das SDK selbst enthält keine Kendo-Oberfläche.

1. Einen bestehenden Bereich mit Diagrammkonfiguration öffnen. Mindestens ein
   Säulen- oder Balkendiagramm und ein Linien- oder Kreisdiagramm prüfen:
   Beschriftungen, Legende, Tooltip und Werte müssen den vorhandenen Daten
   entsprechen.
2. Eine Diagrammkonfiguration ändern, speichern und die Seite neu laden. Typ,
   verwendetes Datenfeld und Stapelung müssen erhalten bleiben.
3. Einen konfigurierten Kalender beziehungsweise Scheduler öffnen und die
   Start-/Enddatumsfelder prüfen. Einträge müssen am erwarteten Tag und zur
   erwarteten Uhrzeit erscheinen, auch nach dem Neuladen.
4. Ein bestehendes Formular mit Tabellen-/Spreadsheet-Feld öffnen, Werte ändern,
   speichern und erneut öffnen. Formulardaten dürfen durch die neue Darstellung
   nicht verloren gehen.

Diese Schritte ergänzen die SDK-Tests. Die Kendo-Darstellung und ihre Interaktion
werden nicht durch die SDK-Unit-Tests abgedeckt.
