module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.3" } },
  plugins: ["react-refresh"],
  rules: {
    // React
    "react/prop-types":                 "off",   // tidak pakai PropTypes (proyek kecil)
    "react/display-name":               "off",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

    // Hooks
    "react-hooks/rules-of-hooks":       "error",
    "react-hooks/exhaustive-deps":      "warn",

    // General
    "no-unused-vars":                   ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "no-console":                       ["warn", { allow: ["warn", "error"] }],
    "prefer-const":                     "error",
    "no-var":                           "error",
  },
};
