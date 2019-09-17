import { tl } from "../tl";
import * as Tools from "../tools";
import * as _ from "lodash";
import { createId } from "./guid";

// Mailadresse auf Gültigkeit prüfen
export function isValidMailAddress(mail: string): boolean {
  // fault tolerant - don't block too many
  let re = /\S+@\S+\.\S+/;
  return re.test(mail);
}

export function isValidWorkspaceName(workspaceName: string): boolean {
  if ((workspaceName == null)
    || (workspaceName.length < 5)
    || (workspaceName.indexOf(" ") >= 0)) {
    return false;
  }

  // all UTF-Characters are allowed, because the workspace name 
  // is created from the user name at registration
  return true;
}

// Benutzer-Realname auf Gültigkeit prüfen
export function isValidRealname(realName: string): boolean {
  // Nur Mindestlänge 5 Zeichen einfordern
  if (realName == null || realName.length < 5)
    return false;
  else
    return true;
}

// Konvertiert einen String in ein Url-taugliches Format
// Bsp.: Mein schöner Titel -> Mein-schoner-Titel
export function toCleanUrl(text: string): string {
  return text.toLowerCase()
    .replace("ä", "ae")
    .replace("ö", "oe")
    .replace("ü", "ue")
    .replace("ß", "ss")
    .replace(/[\/\\+\.?=&%_#| -]+/g, "-")
    .replace(/[\(\)]+/g, "")
    .trim();
}

export function stringExcerpt(source: string, maxLen: number) {
  if (source == null || source.length <= maxLen)
    return source;
  else {
    let dest = source.substr(0, maxLen);
    if (source.substr(maxLen, 1) !== " ") { }
    // String bis zum letzten vollständigen Wort zurückgeben  
    let last = dest.lastIndexOf(" ");
    if (last !== -1)
      dest = dest.substr(0, last);

    return dest + "...";
  }
}

export function getQueryParameter(parameter: string, location?: string) {
  if (location == null && typeof window !== "undefined") {
    location = window.location.href;
  }

  parameter = parameter.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + parameter + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(location);
  if (!results)
    return null;
  if (!results[2])
    return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export const SPLITSIGN_EMAILADDRESSES: string[] = [",", ";", " ", "\n"];

export function splitStringOnMultipleSigns(parameter: string, splitSignListOrdner: number = 0): string[] {
  if (parameter.length === 0) {
    return null;
  }

  let splitResult = parameter.split(SPLITSIGN_EMAILADDRESSES[splitSignListOrdner]);

  if (splitResult.length === 1 && (splitSignListOrdner + 1) === SPLITSIGN_EMAILADDRESSES.length) {
    return splitResult;
  }

  // Wenn das splitzeichen nicht korrekt war nochmal
  if (splitResult.length === 1) {
    return splitStringOnMultipleSigns(parameter, (splitSignListOrdner + 1));
  }

  let result: string[] = [];
  for (let split of splitResult) {
    if (split.trim().length > 0)
      result.push(split.trim());
  }

  return result;
}

export function getShuffledNumberArray(amountOfElements: number, numberLenght: number = 3) {
  let array: number[] = [];
  for (let i = 0; i < amountOfElements; i++) {
    let value = ("000" + i).slice(-(numberLenght));
    array.push(parseInt(value));
  }
  return shuffleArray(array);
}

// Randomize array element order in-place.
function shuffleArray(array: number[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export function removeHtmlTags(html: string): string {
  if (!html) {
    return html;
  }
  return html.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "");
}

export function replaceOldFieldSyntax(oldValue: string): string {
  if (oldValue) {
    return oldValue.replace(/([{]{2}[\s]?(field|role)\.(.+?)(\s)*[}]{2})/g, (match, p1, p2, p3, p4, offset, value): string => { return p2 + "['" + p3 + "']"; }); // fallback: rewrite old syntax {{ field.abc }} -> field['abc'];         
  }
  return oldValue;
}

export function getGroupFromQuery(query: string): Group {
  return parseNestedElementsToGroupConstruct(getNestedElements(query), true);
}

export function getQueryFromGroup(group: Group, isChild?: boolean): string {
  if (group.rules.length === 0) {
    return isChild ? "()" : null;
  }

  return "(" + group.rules.map(r => (<Rule>r).field ? getQueryFromRule(r as Rule) : getQueryFromGroup(r as Group, true)).join(" " + group.combinator + " ") + ")";
}

export function getQueryFromRule(rule: Rule) {
  let value: string | number | { [index: string]: boolean };

  switch (typeof rule.value) {
    case "undefined":
      value = undefined;
      break;
    case "number":
      value = rule.value;
      break;
    case "string":
      value = `'${rule.value}'`;
      break;
    case "object":
      value = JSON.stringify(rule.value);
      break;
  }

  return `${rule.field} ${rule.operator} ${value}`;
}

export class NestedElement {query: string; type: string; top?: boolean; }
export class NestedElements {[key: string]: NestedElement}

const ruleRegex = /((field|role)\['([^']*)'\](\.[^\s]+)?)\s(==|!=|\<|\<=|\>|\>=|\<\>|\>\<)\s(('([^']+)')|(([^()&\|]+)))/; // /((field|role)\['([^'\]]*)'\](\.[^\s]+)?)\s(==|!=|\<|\<=|\>|\>=)\s(('([^&&\|\|']+)')|(([^()&&\|\|]+)))/
const nestedRegex = /((\(|^|\s){1}(\(\))(\)|$|\s){1})|(\(((((((field|role)\['([^']*)'\](\.[^\s]+)?)\s(==|!=|\<|\<=|\>|\>=|\<\>|\>\<)\s(('([^']+)')|(([^()&&\|\|]+))))|([A-F0-9]{16}))(\s(&&|\|\|)\s)*)+)\))/; // /((\(|^|\s){1}(\(\))(\)|$|\s){1})|(\(((((((field|role)\['([^'\]]*)'\](\.[^\s]+)?)\s(==|!=|\<|\<=|\>|\>=)\s(('([^&&\|\|']+)')|(([^()&&\|\|]+))))|([A-F0-9]{16}))(\s(&&|\|\|)\s)*)+)\))/;
const isCombinatorRegex = /\s(&&|\|\|)\s/;

export function getNestedElements(query: string): NestedElements {
  let match = nestedRegex.exec(query);
  let replacedQuery = query;
  let res: NestedElements = {};

  while (match) {
      let uuid = Tools.createId();
      if (match[3]) {
        res[uuid] = { query: "", type: "nested"};
        replacedQuery = replacedQuery.replace(nestedRegex, (m, p1, p2, p3, p4, offset, full) => { return p2 + uuid + p4; });
      } else {
        res[uuid] = { query: match[6], type: isCombinatorRegex.test(match[6]) ? "group" : (ruleRegex.test(match[0]) ? "rule" : "nested")};
        replacedQuery = replacedQuery.replace(nestedRegex, uuid);
      }
      match = nestedRegex.exec(replacedQuery);
      if (!match) {
        res[uuid].top = true;
      }
  }

  return res;
}

export class BaseElement {
  id?: string = createId();
}

export class Group extends BaseElement {
  rules: BaseElement[] = new Array<BaseElement>();
  combinator: string = "&&"; 
  isTopGroup?: boolean = false;
}

export class Rule extends BaseElement {  
  field: string;
  operator: string;
  value: string | number | { [key: string]: boolean };

  constructor(field?: string, operator?: string, value?: string | number | { [key: string]: boolean }) {
    super();
    this.field = field;
    this.operator = operator;
    this.value = value;
  }
}

export function parseNestedElementsToGroupConstruct(nestedElement: NestedElements, isTopGroup: boolean = false): Group {
  let topGroup: Group = new Group();
  topGroup.isTopGroup = isTopGroup;

  if (_.isEmpty(nestedElement)) {
    return topGroup;
  }

  let topEntry: NestedElement = _.cloneDeep(nestedElement[Object.keys(nestedElement).find(k => nestedElement[k].top)]);
  topGroup.combinator = topEntry.type === "group" ? isCombinatorRegex.exec(topEntry.query)[1] : "&&";

  let splittedRules = topEntry.type === "group" ? topEntry.query.split(topGroup.combinator).map(item => item.trim()) : [topEntry.query];
  for (let i: number = 0; i < splittedRules.length; i++) {
    if (splittedRules[i] === "") {

    } else if (!ruleRegex.test(splittedRules[i])) {
      parseNestedElement(splittedRules[i], nestedElement, topGroup);
    } else {
      topGroup.rules.push(parseRule(splittedRules[i]));
    }
  }

  return topGroup;
}

export function parseNestedElement(query: string, nestedElements: NestedElements, group: Group) {
  delete nestedElements[Object.keys(nestedElements).find(k => nestedElements[k].top)];
  nestedElements[query].top = true;
  group.rules.push(parseNestedElementsToGroupConstruct(nestedElements));
  if (nestedElements[query]) {
    nestedElements[query].top = false;
  }
}

export function getFieldOrRoleDisplayName(fieldString: string): string {
  
  let match = fieldString.match(/((field|role)\['([^']*)'\](\.[^\s]+)?)/);
  let prefix = match[2] === "field" ? tl("Feld") : tl("Rolle");
  let suffix = "";
  if (match[4]) {
    switch (match[4]) {
      case ".firstName":
          suffix = " (" + tl("Vorname")  + ")";
        break;
      case ".lastName":
          suffix = " (" + tl("Nachname")  + ")";
        break;
      case ".displayName":
          suffix = " (" + tl("Anzeigename")  + ")";
        break;
    }
  }

  return `${prefix}: ${match[3]}${suffix}`;
}

/**
 * Returns a Rule object parsed from a string expression like "(field['Title'] == 'Process')"
 * @param rule
 * @return {Rule} the Rule object representing a string expression containing a field, an operator and a value
 */
export function parseRule(rule: string): Rule {
  let res: Rule = new Rule();

  let match = ruleRegex.exec(rule);
  if (match) {    
    res.field = match[1];
    res.operator = match[5];
    if (match[8]) { // normal text
      res.value = match[8];
    } else if (match[10] === "''") { // empty text
      res.value = "";
    } else if (match[10] === "undefined") { // undefined (object)
      res.value = undefined;
    } else if (!Number.isNaN(Number(match[10]))) {
      res.value = Number(match[10]); // number
    } else {
      res.value = JSON.parse(match[10]); // object (checklist)
    }
  }

  return res;
}