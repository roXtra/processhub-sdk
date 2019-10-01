export function isMicrosoftEdge(): boolean {
  if (typeof navigator === "undefined" || navigator == null)
    return false;

  return /Edge\/1./i.test(navigator.userAgent);
}

export function isIE11(): boolean {
  if (typeof navigator === "undefined" || navigator == null)
    return false;

  return navigator.userAgent.includes("Trident/7.");
}