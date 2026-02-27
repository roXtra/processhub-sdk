export function isMicrosoftEdge(): boolean {
  const navigatorRef = (globalThis as { navigator?: Navigator }).navigator;
  if (!navigatorRef) return false;

  return /Edge\/1./i.test(navigatorRef.userAgent);
}
