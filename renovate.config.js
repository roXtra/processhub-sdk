const branchName = "auto-dep-update";

module.exports = {
  branchPrefix: `${branchName}/`,
  enabledManagers: ["github-actions", "npm"],
  gitAuthor: "Dependency Bot <devbot@roxtra.com>",
  logLevel: "info",
  onboarding: true,
  onboardingBranch: `${branchName}/configure`,
  platform: "github",
  schedule: ["after 9am and before 4pm on Wednesday"],
  regexManagers: [],
  repositories: ["roXtra/processhub-sdk"],
  rebaseWhen: "behind-base-branch",
  ignoreDeps: [],
  packageRules: [
    {
      matchPackageNames: ["renovatebot/github-action"],
      // Reduce stability days for renovate bot updates for itself as they update regularly and otherwise, it would never update itself
      stabilityDays: 0,
    },
    {
      matchPackageNames: ["node", "@types/node"],
      allowedVersions: "^16.0.0",
    },
    {
      matchPackageNames: ["npm"],
      allowedVersions: "^8.0.0",
    },
    {
      matchPackageNames: ["react", "react-dom", "@types/react"],
      allowedVersions: "^17.0.0",
    },
    {
      groupName: "progress monorepo",
      matchPackagePatterns: ["^@progress/", "kendo-ui-core"],
    },
  ],
};
