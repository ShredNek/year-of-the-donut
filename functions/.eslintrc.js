module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    quotes: ["error", "double"],
    semi: ["error", "always"],
    indent: ["error", 2],
    "no-multi-spaces": ["error"],
    "object-curly-spacing": ["error", "always"],
    "new-cap": ["error", { capIsNew: false }],
    "quote-props": ["error", "as-needed"],
  },
};
