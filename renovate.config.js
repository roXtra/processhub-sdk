const branchName = "auto-dep-update";

module.exports = {
  branchPrefix: `${branchName}/`,
  enabledManagers: ["github-actions", "npm"],
  gitAuthor: "Dependency Bot <devbot@roxtra.com>",
  logLevel: "info",
  onboarding: true,
  onboardingBranch: `${branchName}/configure`,
  platform: "github",
  schedule: ["after 9am and before 4pm on Friday"],
  regexManagers: [],
  repositories: ["roXtra/processhub-sdk"],
  rebaseWhen: "behind-base-branch",
  ignoreDeps: [],
  packageRules: [
    {
      packageNames: ["node", "@types/node"],
      allowedVersions: "^14.0.0",
    },
    {
      packageNames: ["npm"],
      allowedVersions: "^6.0.0",
    },
  ],
};
