// Wir nutzen im gesamten Code ausgiebig Assertion-Tests, da hiermit Fehler sehr schnell entdeckt werden.

// In allen Bereichen außer /test sollen nur die hier gekapselten Asserts verwendet werden,
// die wir später so implementieren, dass sie im Production-Code automatisch entfernt werden.

// Production Environment?
const isProduction = false;

export function error(message?: string): void {
  if (!isProduction) {
    if (message) {
      throw new Error("Assertion failed: " + message);
    } else {
      throw new Error("Assertion failed");
    }
  }
}

export function equal<T extends string | number | boolean>(actual: T, expected: T, message?: string): void {
  if (!isProduction) {
    if (actual !== expected) {
      if (message) {
        throw new Error("Assertion failed: " + message);
      } else {
        throw new Error("Assertion failed: expected " + String(actual) + " to equal " + String(expected));
      }
    }
  }
}

export function isTrue(actual: boolean, message?: string): void {
  if (!isProduction) {
    if (!actual) {
      if (message) {
        throw new Error("Assertion failed: " + message);
      } else {
        throw new Error("Assertion failed: expected " + String(actual) + " to be true");
      }
    }
  }
}

export function isFalse(actual: boolean, message?: string): void {
  if (!isProduction) {
    if (actual) {
      if (message) {
        throw new Error("Assertion failed: " + message);
      } else {
        throw new Error("Assertion failed: expected " + String(actual) + " to be false");
      }
    }
  }
}
