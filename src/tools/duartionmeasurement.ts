export const NS_PER_MS = BigInt(1e6);

export default class DuartionMeasurement {
  private startBigInt: bigint;
  public startTime: number;

  private constructor() {
    this.startBigInt = DuartionMeasurement.now();
    this.startTime = Number(this.startBigInt / NS_PER_MS);
  }

  private static now(): bigint {
    if (typeof window !== "undefined") {
      return BigInt(window.performance.now());
    }
    return process.hrtime.bigint();
  }

  public static start(): DuartionMeasurement {
    return new DuartionMeasurement();
  }

  /**
   *
   * @returns The duration in milliseconds
   */
  public end(): number {
    const endBigInt = DuartionMeasurement.now();
    return Number((endBigInt - this.startBigInt) / NS_PER_MS);
  }
}
