import { IProcessDetails } from "./processinterfaces.js";

// Filter tags that are used in the given processes
export function filterExistingTags(processes: IProcessDetails[], tags: string[]): string[] {
  const filteredTags: string[] = [];
  processes.map((process) => {
    if (process.tags) {
      process.tags.map((processTag) => {
        const foundTag = tags.find((tag) => tag === processTag);
        if (foundTag != null) {
          if (filteredTags.find((tag) => tag === processTag) == null) {
            filteredTags.push(foundTag);
          }
        }
      });
    }
  });

  return filteredTags;
}
