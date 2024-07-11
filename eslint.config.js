// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import eslintPluginNoOnlyTests from "eslint-plugin-no-only-tests";
import eslintPluginDeprecation from "eslint-plugin-deprecation";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import eslintPluginLodash from "eslint-plugin-lodash";
import eslintPluginReactRecommended from "eslint-plugin-react/configs/recommended.js";

export default tseslint.config(
  /**
   * Recommended eslint rules
   */
  eslint.configs.recommended,
  /**
   * React Plugin
   */
  {
    ...eslintPluginReactRecommended,
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/jsx-no-target-blank": "error",
      "react/jsx-key": "error",
      "react/no-direct-mutation-state": "error",
      // Disable react/jsx-uses-react and react/react-in-jsx-scope because they are no longer relevant with the new JSX transform
      // See https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
  /**
   * Recommended + Recommended Type Checked typescript-eslint rules
   */
  ...tseslint.configs.recommendedTypeChecked,
  /**
   * General rules
   */
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "linebreak-style": ["error", "unix"],
      "no-only-tests/no-only-tests": "error",
      "no-cond-assign": "error",
      "capitalized-comments": [
        "error",
        "always",
        {
          ignoreInlineComments: true,
          ignoreConsecutiveComments: true,
        },
      ],
      "spaced-comment": "off",
      "no-eval": "error",
      "no-trailing-spaces": "error",
      "no-unsafe-finally": "error",
      "no-var": "error",
      eqeqeq: [
        "off",
        "always",
        {
          null: "ignore",
        },
      ],
      "id-blacklist": "error",
      "no-underscore-dangle": [
        "error",
        {
          allow: ["__INITIAL_CONFIG__", "__INITIAL_STATE__"],
        },
      ],
      "require-atomic-updates": "off",
      "default-param-last": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "none",
          varsIgnorePattern: "",
        },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/prefer-namespace-keyword": "error",
      semi: "off",
      "@typescript-eslint/semi": ["error", "always"],
      "@typescript-eslint/type-annotation-spacing": ["error"],
      camelcase: "off",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "import",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
        },
        {
          selector: "default",
          format: ["camelCase"],
        },
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: {
            regex: "^I[A-Z]",
            match: true,
          },
        },
        {
          selector: "enumMember",
          format: ["PascalCase", "UPPER_CASE"],
        },
        {
          selector: "variable",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
        },
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "property",
          format: ["PascalCase", "camelCase", "UPPER_CASE"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "property",
          format: null,
          leadingUnderscore: "forbid",
          modifiers: ["requiresQuotes"],
        },
        {
          selector: "memberLike",
          modifiers: ["private"],
          format: ["PascalCase", "camelCase"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
      ],
      "@typescript-eslint/no-use-before-define": [
        "error",
        {
          functions: false,
          classes: false,
          variables: true,
        },
      ],
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false,
        },
      ],
      "@typescript-eslint/unbound-method": "error",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      // Deactivated for now since we use {} a lot as return types
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/restrict-template-expressions": "error",

      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unnecessary-condition": "warn",
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
        },
      ],
    },
  },
  /**
   * Test specific rules
   */
  {
    files: ["**/*.test.ts*"],
    rules: {},
  },
  /**
   * No Only Tests Plugin
   */
  {
    plugins: {
      "no-only-tests": eslintPluginNoOnlyTests,
    },
    rules: {
      "no-only-tests/no-only-tests": "error",
    },
  },
  /**
   * Deprecation Plugin
   */
  {
    plugins: {
      deprecation: eslintPluginDeprecation,
    },
    rules: {
      "deprecation/deprecation": "warn",
    },
  },
  /**
   * Lodash Plugin
   */
  {
    plugins: {
      lodash: eslintPluginLodash,
    },
    rules: {
      "lodash/import-scope": ["error", "method"],
    },
  },
  /**
   * Ignores
   */
  {
    ignores: [
      // Eslint config
      "eslint.config.js",
      // Ignore custom thirdparty types
      "src/process/types/",
    ],
  },
  // Add prettier as last entry to ensure it can overwrite other configurations
  {
    ...eslintPluginPrettier,
  }
);
