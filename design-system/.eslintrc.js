module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
    //tsconfig에 eslint.json을 추가함
    //tsconfig에 파싱을 하면서 base ts를 사용할 수도 있지만 범위를
    //조금더 제한해서 범위내에서만 eslint가 적용되도록 
    tsconfigRootDir: __dirname,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:storybook/recommended",
    "prettier",
  ],
  plugins: ["react", "@typescript-eslint", "react-hooks", "jsx-a11y"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/react-in-jsx-scope": "off",
    "comma-dangle": "off",
    "react/display-name": "off",
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": ["off"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "storybook/prefer-pascal-case": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "no-undef": "off",
      },
    },
  ],
  ignorePatterns: ["**/dist/**/*", ".eslintrc.js"],
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
};