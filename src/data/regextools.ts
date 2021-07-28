export function createLiteralTypeRegExp(literalTypeOptions: string[]): RegExp {
  let regExpString = "";

  for (const typeOption of literalTypeOptions) {
    if (typeof typeOption === "string") {
      regExpString += "^" + typeOption + "$|";
    } else {
      throw new Error("Error: Type option is not a string!");
    }
  }

  // Remove last "|"
  regExpString = regExpString.substring(0, regExpString.length - 1);

  return new RegExp(regExpString);
}
