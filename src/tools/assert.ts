// Wir nutzen im gesamten Code ausgiebig Assertion-Tests, da hiermit Fehler sehr schnell entdeckt werden.
// In allen Bereichen außer /test sollen nur die hier gekapselten Asserts verwendet werden.

import { getLogger } from "./logger.js";

function throwOrLog(logMsg: string): void {
  // Production Environment?
  const isProduction = typeof window !== "undefined" ? window.__INITIAL_CONFIG__.isProduction : process.env.NODE_ENV === "production";

  if (isProduction) {
    getLogger()?.error(logMsg);
  } else {
    throw new Error(logMsg);
  }
}

export function error(message?: string): void {
  const logMsg = message ? "Assertion failed: " + message : "Assertion failed";
  throwOrLog(logMsg);
}

export function equal<T extends string | number | boolean>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    const logMsg = message ? "Assertion failed: " + message : "Assertion failed: expected " + String(actual) + " to equal " + String(expected);
    throwOrLog(logMsg);
  }
}

export function isTrue(actual: boolean, message?: string): void {
  if (!actual) {
    const logMsg = message ? "Assertion failed: " + message : "Assertion failed: expected " + String(actual) + " to be true";
    throwOrLog(logMsg);
  }
}

export function isFalse(actual: boolean, message?: string): void {
  if (actual) {
    const logMsg = message ? "Assertion failed: " + message : "Assertion failed: expected " + String(actual) + " to be false";
    throwOrLog(logMsg);
  }
}
