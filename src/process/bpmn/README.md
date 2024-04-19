Die Definitionen wurden aus den bpmn-moddle-jsons mit folgendem Code erzeugt und angepasst: <br />

<code>
 import { expect } from "chai";;
 import { bpmnJson } from "./bpmn-json.js";;
 import { bpmndiJson } from "./bpmndi-json.js";;

const json = bpmndiJson;

interface IProp { name: string; type: string; isVirtual?: boolean; isMany?: boolean; }

interface IType { name: string; properties?: IProp[]; superClass?: string[]; isAbstract?: boolean;

}

function jsType(typeName: string): string { switch (typeName) { case "Boolean": return "boolean"; case "Integer": case "Real": return "number"; case "String": return "string";
default: return typeName.replace(":", "."); } }

function logProp(prop: IProp): void { if (!prop.isVirtual) { const many: string = prop.isMany ? "[]" : ""; console.log(" " + prop.name + ": " + jsType(prop.type) + many +
";"); } }

function logType(type: IType, prefix: string): string { if (type.name !== "Boolean" && type.name !== "Integer" && type.name !== "Real" && type.name !== "String") { if
(type.properties || type.superClass) { const moddleTypeName: string = "\"" + prefix + ":" + type.name + "\""; console.log(""); let sc: string = ""; if (type.superClass) { sc =
" extends " + type.superClass.join(", "); } console.log(" export interface " + type.name + sc + " {"); if (!type.isAbstract) { console.log(" readonly \$type: " +
moddleTypeName + ";"); } if (type.properties) { for (const prop of type.properties) { logProp(prop); } } console.log(" }"); if (!type.isAbstract) { return moddleTypeName; } }

} return undefined; }

describe("json", () => { it("namespace", () => { console.log("declare module \"bpmn-moddle/" + json.prefix + "\" {"); console.log("namespace " + json.prefix + " {"); const
complexTypes: string[] = []; for (const type of json.types) { const moddleTypeName: string = logType(type, json.prefix); if (moddleTypeName) {
complexTypes.push(moddleTypeName); } } console.log(""); console.log(" export type " + json.prefix + "Type = " + complexTypes.join(" | ") + ";"); console.log("}");
console.log("}"); expect(true).to.be.true; }); }); </code>
