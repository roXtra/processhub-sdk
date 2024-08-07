/**
 * Error that is thrown if a task failed to complete within a given timeout.
 */
export class TaskTimedOutError extends Error {
  public readonly reason;

  constructor(reason: string) {
    super(reason);
    this.reason = reason;
  }
}

/**
 * Handler that creates a promise that will reject after a given timeout without leaking memory
 */
class TimeoutHandler<T> {
  private timeoutMS: number;
  private timeoutID?: NodeJS.Timeout;

  constructor(config: { milliseconds: number }) {
    this.timeoutMS = config.milliseconds;
    this.timeoutID = undefined;
  }

  get execute(): Promise<T> {
    return new Promise((result, reject) => {
      this.timeoutID = setTimeout(() => {
        reject(new TaskTimedOutError(`Task execution request with ID ${String(this.timeoutID)} failed to complete within timeout ${this.timeoutMS}!`));
      }, this.timeoutMS);
    });
  }

  clear(): void {
    if (this.timeoutID !== undefined) {
      clearTimeout(this.timeoutID);
    }
  }
}

/**
 * Execute a task and cancel it if a given timeout is expired
 * @param task The task to execute
 * @param timeoutMS The maximum timeout to wait for the task completion
 * @returns The task's result. Throws if 1) the task threw an exception or 2) the timeout expired (in this case, throws a TaskTimedOutError)
 */
export function executeWithTimeout<T>(task: () => Promise<T>, timeoutMS = 60000): Promise<T> {
  const timeoutHandler = new TimeoutHandler<T>({ milliseconds: timeoutMS });
  const taskToExecute = task();

  return Promise.race([taskToExecute, timeoutHandler.execute])
    .then(
      (result) => {
        return result;
      },
      (ex) => {
        // Is either a TimeoutExpiredError if the task failed to complete within the timeout, or an exception from the task itself
        throw ex;
      },
    )
    .finally(() => {
      // Always clear timeout to avoid memory leaks
      timeoutHandler.clear();
    });
}
