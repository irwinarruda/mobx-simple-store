/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>$1",
    "^@models/(.*)$": "<rootDir>src/models/$1",
    "^@types/(.*)$": "<rootDir>src/types/$1",
    "^@utils/(.*)$": "<rootDir>src/utils/$1",
    "^@utils-types/(.*)$": "<rootDir>src/utils-types/$1",
  },
};
