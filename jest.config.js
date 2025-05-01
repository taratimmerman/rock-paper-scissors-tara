/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
  setupFiles: ["jest-localstorage-mock"],
};
