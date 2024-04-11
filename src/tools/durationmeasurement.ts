export const NS_PER_MS = BigInt(1e6);

export class DurationMeasurement {
  private startBigInt: bigint;
  public startTime: number;

  private constructor() {
    this.startBigInt = DurationMeasurement.now();
    this.startTime = Number(this.startBigInt / NS_PER_MS);
  }

  private static now(): bigint {
    if (typeof window !== "undefined") {
      return BigInt(window.performance.now());
    }
    return process.hrtime.bigint();
  }

  public static start(): DurationMeasurement {
    return new DurationMeasurement();
  }

  /**
   *
   * @returns The duration in milliseconds
   */
  public end(): number {
    const endBigInt = DurationMeasurement.now();
    return Number((endBigInt - this.startBigInt) / NS_PER_MS);
  }
}

export default DurationMeasurement;
