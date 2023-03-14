import { SystemUserId } from "../user/usertools";

const ID_LENGTH = 16;

function idHelper(count: number): string {
  let out = "";
  for (let i = 0; i < count; i++) {
    out += (((1 + Math.random()) * 0x10000) | 0).toString(ID_LENGTH).substring(1);
  }
  return out;
}

// Wir verwenden keine echten Ids, sondern Hexstrings mit 16 Zeichen länge.
// Das spart in Summe Platz, steigert langfristig die Performance und bietet ausreichend Genauigkeit
export function createId(): string {
  // Wir verwenden UpperCase-Ids da MySql HEX()-Funktion ebenfalls Uppercase liefert - das vereinfacht das Handling
  return idHelper(4).toUpperCase();
}

// Ist String eine Id?
export function isId(id: string): boolean {
  return id != null && id.length === ID_LENGTH && id.toUpperCase() === id;
}

export function isUserId(id: string): boolean {
  return id === SystemUserId || /^\d+$/.test(id);
}

export function isGroupId(id: string): boolean {
  return id.startsWith("G_");
}

export function nullId(): string {
  return "0000000000000000";
}

// Number format 123.4567.890
export function createInstanceNumber(): string {
  return (
    Math.floor(1000 + Math.random() * 1000)
      .toString()
      .substr(1, 3) +
    "." +
    Math.floor(10000 + Math.random() * 10000)
      .toString()
      .substr(1, 4) +
    "." +
    Math.floor(1000 + Math.random() * 1000)
      .toString()
      .substr(1, 3)
  );
}
