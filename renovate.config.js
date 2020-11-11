const branchName = 'auto-dep-update';

module.exports = {
  branchPrefix: `${branchName}/`,
  enabledManagers: ['github-actions', 'npm'],
  gitAuthor: 'Dependency Bot <devbot@roxtra.com>',
  logLevel: 'info',
  onboarding: true,
  onboardingBranch: `${branchName}/configure`,
  platform: 'github',
  schedule: ["after 6am and before 4pm on Wednesday"],
  regexManagers: [],
  repositories: [
    'roXtra/processhub-sdk',
  ],
  rebaseWhen: "behind-base-branch",
  stabilityDays: 14,
  prCreation: "not-pending",
  ignoreDeps: [],
  packageRules: [
    {
      packageNames: ["@types/node"],
      allowedVersions: "^12.0.0"
    }
  ]
};