module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],
};
