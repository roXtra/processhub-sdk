export function compareRoXtraVersions(a: string, b: string): number {
  const aParts: string[] = a.split(".");
  const aMajor: number = +aParts[0];
  const aMinor: number = +aParts[1];
  const aBuild: number = +aParts[2];

  const bParts: string[] = b.split(".");
  const bMajor: number = +bParts[0];
  const bMinor: number = +bParts[1];
  const bBuild: number = +bParts[2];

  if (aMajor < bMajor) {
    return -1;
  } else if (aMajor > bMajor) {
    return 1;
  }

  if (aMinor < bMinor) {
    return -1;
  } else if (aMinor > bMinor) {
    return 1;
  }

  if (aBuild < bBuild) {
    return -1;
  } else if (aBuild > bBuild) {
    return 1;
  }

  return 0;
}
