import { tl } from "../tl";
import * as Tools from "../tools";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";
import { createId } from "./guid";

// Mailadresse auf Gültigkeit prüfen
export function isValidMailAddress(mail: string | null): boolean {
  if (mail === null) return false;

  // Fault tolerant - don't block too many
  const re = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
  return re.test(mail);
}

// Konvertiert einen String in ein Url-taugliches Format
// Bsp.: Mein schöner Titel -> Mein-schoner-Titel
export function toCleanUrl(text: string): string {
  return text
    .toLowerCase()
    .replace("ä", "ae")
    .replace("ö", "oe")
    .replace("ü", "ue")
    .replace("ß", "ss")
    .replace(/[/\\+.?=&%_#| -:]+/g, "-")
    .replace(/[()]+/g, "")
    .trim();
}

export function stringExcerpt(source: string, maxLen: number): string {
  if (source == null || source.length <= maxLen) return source;
  else {
    let dest = source.substr(0, maxLen);

    // String bis zum letzten vollständigen Wort zurückgeben
    const last = dest.lastIndexOf(" ");
    if (last !== -1) dest = dest.substr(0, last);

    return dest + "...";
  }
}

export function getShuffledNumberArray(amountOfElements: number, numberLenght = 3): number[] {
  const array: number[] = [];
  for (let i = 0; i < amountOfElements; i++) {
    const value = ("000" + String(i)).slice(-numberLenght);
    array.push(parseInt(value));
  }
  return shuffleArray(array);
}

// Randomize array element order in-place.
function shuffleArray(array: number[]): number[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
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

export function replaceOldFieldSyntax(oldValue: string | undefined): string | undefined {
  if (oldValue) {
    return oldValue.replace(/([{]{2}[\s]?(field|role)\.(.+?)(\s)*[}]{2})/g, (match, p1: string, p2: string, p3: string, p4: string, offset, value): string => {
      return p2 + "['" + p3 + "']";
    }); // Fallback: rewrite old syntax {{ field.abc }} -> field['abc'];
  }
  return oldValue;
}

export function getGroupFromQuery(query: string): Group {
  return parseNestedElementsToGroupConstruct(getNestedElements(query), true);
}

export function getQueryFromGroup(group: Group, isChild?: boolean): string | undefined {
  if (group.rules.length === 0) {
    return isChild ? "()" : undefined;
  }

  return "(" + group.rules.map((r) => ((r as Rule).field ? getQueryFromRule(r as Rule) : getQueryFromGroup(r as Group, true))).join(" " + group.combinator + " ") + ")";
}

export function getQueryFromRule(rule: Rule): string {
  let value: string | number | { [index: string]: boolean } | undefined;

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

  if (rule.field === undefined) throw new Error("Field in rule is undefined!");

  if (rule.operator === undefined) throw new Error(`Operator for rule with field ${rule.field} is undefined!`);

  return `${rule.field} ${rule.operator} ${String(value)}`;
}

export class NestedElement {
  query: string;
  type: string;
  top?: boolean;
}
export class NestedElements {
  [key: string]: NestedElement;
}

const ruleRegex = /((field|role|riskMetric)\['([^']*)'\](\.[^\s]+)?)\s(==|!=|<|<=|>|>=|<>|><)\s(('([^']+)')|(([^()&|]+)))/; // /((field|role)\['([^'\]]*)'\](\.[^\s]+)?)\s(==|!=|\<|\<=|\>|\>=)\s(('([^&&\|\|']+)')|(([^()&&\|\|]+)))/
const nestedRegex = /((\(|^|\s){1}(\(\))(\)|$|\s){1})|(\(((((((field|role|riskMetric)\['([^']*)'\](\.[^\s]+)?)\s(==|!=|<|<=|>|>=|<>|><)\s(('([^']+)')|(([^()&&||]+))))|([A-F0-9]{16}))(\s(&&|\|\|)\s)*)+)\))/; // /((\(|^|\s){1}(\(\))(\)|$|\s){1})|(\(((((((field|role)\['([^'\]]*)'\](\.[^\s]+)?)\s(==|!=|\<|\<=|\>|\>=)\s(('([^&&\|\|']+)')|(([^()&&\|\|]+))))|([A-F0-9]{16}))(\s(&&|\|\|)\s)*)+)\))/;
const isCombinatorRegex = /\s(&&|\|\|)\s/;

export function getNestedElements(query: string): NestedElements {
  let match = nestedRegex.exec(query);
  let replacedQuery = query;
  const res: NestedElements = {};

  while (match) {
    const uuid = Tools.createId();
    if (match[3]) {
      res[uuid] = { query: "", type: "nested" };
      replacedQuery = replacedQuery.replace(nestedRegex, (m, p1: string, p2: string, p3: string, p4: string, offset, full) => {
        return p2 + uuid + p4;
      });
    } else {
      res[uuid] = { query: match[6], type: isCombinatorRegex.test(match[6]) ? "group" : ruleRegex.test(match[0]) ? "rule" : "nested" };
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
  id: string = createId();
}

export class Group extends BaseElement {
  rules: BaseElement[] = new Array<BaseElement>();
  combinator = "&&";
  isTopGroup?: boolean = false;
}

export class Rule extends BaseElement {
  field?: string;
  operator?: string;
  value?: string | number | { [key: string]: boolean };

  constructor(field?: string, operator?: string, value?: string | number | { [key: string]: boolean }) {
    super();
    this.field = field;
    this.operator = operator;
    this.value = value;
  }
}

export function parseNestedElementsToGroupConstruct(nestedElement: NestedElements, isTopGroup = false): Group {
  const topGroup: Group = new Group();
  topGroup.isTopGroup = isTopGroup;

  if (isEmpty(nestedElement)) {
    return topGroup;
  }

  const topIndex = Object.keys(nestedElement).find((k) => nestedElement[k].top);

  if (topIndex === undefined) throw new Error(`Could not find index for top element in parseNestedElementsToGroupConstruct: ${JSON.stringify(nestedElement)}`);

  const topEntry: NestedElement = cloneDeep(nestedElement[topIndex]);

  if (topEntry.type === "group") {
    const regexEx = isCombinatorRegex.exec(topEntry.query);
    if (regexEx === null) throw new Error(`Regex isCombinatorRegex returned null for search with ${topEntry.query}`);

    topGroup.combinator = regexEx[1];
  } else {
    topGroup.combinator = "&&";
  }

  const splittedRules = topEntry.type === "group" ? topEntry.query.split(topGroup.combinator).map((item) => item.trim()) : [topEntry.query];
  for (let i = 0; i < splittedRules.length; i++) {
    if (splittedRules[i] === "") {
      // Do nothing
    } else if (!ruleRegex.test(splittedRules[i])) {
      parseNestedElement(splittedRules[i], nestedElement, topGroup);
    } else {
      topGroup.rules.push(parseRule(splittedRules[i]));
    }
  }

  return topGroup;
}

export function parseNestedElement(query: string, nestedElements: NestedElements, group: Group): void {
  const topIndex = Object.keys(nestedElements).find((k) => nestedElements[k].top);
  if (topIndex !== undefined) {
    delete nestedElements[topIndex];
  }

  nestedElements[query].top = true;
  group.rules.push(parseNestedElementsToGroupConstruct(nestedElements));
  if (nestedElements[query]) {
    nestedElements[query].top = false;
  }
}

export function getFieldOrRoleDisplayName(fieldString: string): string | null {
  const regex = new RegExp(/((field|role)\['([^']*)'\](\.[^\s]+)?)/);
  const match = regex.exec(fieldString);

  if (match === null) return null;

  const prefix = match[2] === "field" ? tl("Feld") : tl("Rolle");
  let suffix = "";
  if (match[4]) {
    switch (match[4]) {
      case ".firstName":
        suffix = " (" + tl("Vorname") + ")";
        break;
      case ".lastName":
        suffix = " (" + tl("Nachname") + ")";
        break;
      case ".displayName":
        suffix = " (" + tl("Anzeigename") + ")";
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
  const res: Rule = new Rule();

  const match = ruleRegex.exec(rule);
  if (match) {
    res.field = match[1];
    res.operator = match[5];
    if (match[8]) {
      // Normal text
      res.value = match[8];
    } else if (match[10] === "''") {
      // Empty text
      res.value = "";
    } else if (match[10] === "undefined") {
      // Undefined (object)
      res.value = undefined;
    } else if (!Number.isNaN(Number(match[10]))) {
      res.value = Number(match[10]); // Number
    } else {
      res.value = JSON.parse(match[10]); // Object (checklist)
    }
  }

  return res;
}
