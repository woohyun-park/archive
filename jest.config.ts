import type { Config } from "jest";

const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  collectCoverageFrom: [
    // "apis/**/*.[jt]s?(x)",
    // "assets/**/*.[jt]s?(x)",
    "components/**/*.[jt]s?(x)",
    // "consts/**/*.[jt]s?(x)",
    // "hooks/**/*.[jt]s?(x)",
    // "libs/**/*.[jt]s?(x)",
    // "pages/**/*.[jt]s?(x)",
    // "providers/**/*.[jt]s?(x)",
    // "stores/**/*.[jt]s?(x)",
    // "styles/**/*.[jt]s?(x)",
    "!**/*.stories.[jt]s?(x)",
  ],
};

module.exports = createJestConfig(customJestConfig);
