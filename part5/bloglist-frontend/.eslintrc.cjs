module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/prop-types": "error",
    "react/react-in-jsx-scope": "off",
    "no-unused-vars": "warn",
    semi: ["error", "always"],
    quotes: ["error", "single"],
    indent: ["error", 2],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
