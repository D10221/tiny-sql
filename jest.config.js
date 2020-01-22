module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  global: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
    },
  },
};
