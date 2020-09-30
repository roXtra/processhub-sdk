export const ServiceTaskState = {
  Completed: "completed",
  Running: "running",
  Failed: "failed",
};
export type ServiceTaskState = keyof typeof ServiceTaskState;
